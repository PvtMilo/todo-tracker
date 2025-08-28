import React from "react";
import API from "../api";
import AdminHeader from "../components/AdminHeader";
import StatusCounters from "../components/StatusCounters";
import Filters from "../components/Filters";
import TaskList from "../components/TaskList";
import TagInput from "../components/TagInput";

export default function AdminDashboard(){
  const [counts, setCounts] = React.useState({});
  const [filters, setFilters] = React.useState({page:1, size:20});
  const [data, setData] = React.useState({items:[], total:0, page:1, size:20});
  const [newTask, setNewTask] = React.useState({title:"", category:"Operational", tags:[]});

  const load = async ()=>{
    setCounts(await API.counts());
    const r = await API.getTasks(filters);
    setData(r);
  };
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [filters.page, filters.status, filters.category, filters.tag, filters.q]);

  const grouped = {
    "Not Started": data.items.filter(i=>i.status==="Not Started"),
    "In Progress": data.items.filter(i=>i.status==="In Progress"),
    "On Hold": data.items.filter(i=>i.status==="On Hold"),
    "Done": data.items.filter(i=>i.status==="Done")
  };

  const handleAction = async (type, task)=>{
    if(type==="delete"){
      if(!confirm("Yakin hapus task ini?")) return;
      await API.deleteTask(task.id);
    }
    if(type==="to_inprogress"){
      await API.updateTask(task.id, {status:"In Progress"});
    }
    if(type==="to_onhold"){
      const reason = prompt("Alasan On Hold? (wajib)"); if(!reason) return;
      await API.createUpdate(task.id, formFrom({text:`[On Hold] ${reason}`, progress_pct:"", links:[], highlight:false}));
      await API.updateTask(task.id, {status:"On Hold"});
    }
    if(type==="to_done"){
      if(!confirm("Konfirmasi Mark Done?")) return;
      await API.updateTask(task.id, {status:"Done"});
    }
    if(type==="set_deadline"){
      const typeSel = prompt("Tipe deadline? (soft/hard) kosong=hapus"); // quick setter
      let dateSel = null;
      if(typeSel==="soft" || typeSel==="hard"){
        dateSel = prompt("Tanggal (YYYY-MM-DD)");
      }
      await API.updateTask(task.id, {deadline:{type:typeSel||null, date:dateSel||null}});
    }
    if(type==="update"){
      location.href = `/admin/task/${task.id}`;
      return;
    }
    await load();
  };

  return (
    <div className="grid" style={{gap:12}}>
      <AdminHeader />
      <div className="panel">
        <StatusCounters counts={counts}/>
      </div>

      {/* Quick Add */}
      <div className="panel">
        <div className="h2">Add Task Cepat</div>
        <div className="grid grid-3">
          <input className="input" placeholder="Judul task..." value={newTask.title} onChange={e=>setNewTask({...newTask, title:e.target.value})}/>
          <select className="select" value={newTask.category} onChange={e=>setNewTask({...newTask, category:e.target.value})}>
            <option>Operational</option>
            <option>Development</option>
            <option>Experiment/Belajar</option>
          </select>
          <div>
            <TagInput value={newTask.tags} onChange={tags=>setNewTask({...newTask, tags})}/>
          </div>
        </div>
        <div className="row" style={{marginTop:8}}>
          <button className="btn btn-green" onClick={async ()=>{
            if(!newTask.title.trim()) { alert("Judul wajib."); return; }
            await API.createTask(newTask);
            setNewTask({title:"", category:"Operational", tags:[]});
            await load();
          }}>Tambah</button>
        </div>
      </div>

      {/* Filters */}
      <Filters
        filters={filters} setFilters={setFilters}
        onApply={()=>setFilters({...filters, page:1})}
        onReset={()=>setFilters({page:1, size:20})}
      />

      {/* Lists grouped */}
      <TaskList title="Not Started" items={grouped["Not Started"]} admin onAction={handleAction}/>
      <TaskList title="In Progress" items={grouped["In Progress"]} admin onAction={handleAction}/>
      <TaskList title="On Hold" items={grouped["On Hold"]} admin onAction={handleAction}/>
      <TaskList title="Done (collapsed preview: showing page items with status=Done)" items={grouped["Done"]} admin onAction={handleAction}/>
    </div>
  );
}

function formFrom({text, progress_pct, links, highlight}){
  const fd = new FormData();
  fd.append("text", text);
  if(progress_pct !== "" && progress_pct !== null && progress_pct !== undefined) fd.append("progress_pct", String(progress_pct));
  fd.append("links_json", JSON.stringify(links||[]));
  fd.append("is_highlight", highlight ? "true" : "false");
  return fd;
}
