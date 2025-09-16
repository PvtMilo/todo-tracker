import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import AdminHeader from "../components/AdminHeader";
import StatusCounters from "../components/StatusCounters";
import Filters from "../components/Filters";
import TaskList from "../components/TaskList";
import TagInput from "../components/TagInput";

export default function AdminDashboard(){
  const navigate = useNavigate();
  React.useEffect(()=>{ if(!API.token()) navigate('/admin/login'); }, [navigate]);
  const [counts, setCounts] = React.useState({});
  const [filters, setFilters] = React.useState({page:1, size:20});
  const [data, setData] = React.useState({items:[], total:0, page:1, size:20});
  const [newTask, setNewTask] = React.useState({title:"", category:"Operational", tags:[]});

  const [deadlineDialog, setDeadlineDialog] = React.useState(emptyDeadlineState);

  const load = async ()=>{
    setCounts(await API.counts());
    const r = await API.getTasks(filters);
    setData(r);
  };
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [filters.page, filters.status, filters.category, filters.tag, filters.q]);

  React.useEffect(()=>{
    if(!deadlineDialog.open) return;
    const handler = (e)=>{
      if(e.key === "Escape"){
        e.preventDefault();
        setDeadlineDialog(emptyDeadlineState());
      }
    };
    window.addEventListener("keydown", handler);
    return ()=> window.removeEventListener("keydown", handler);
  }, [deadlineDialog.open]);

  const grouped = {
    "Not Started": data.items.filter(i=>i.status==="Not Started"),
    "In Progress": data.items.filter(i=>i.status==="In Progress"),
    "On Hold": data.items.filter(i=>i.status==="On Hold"),
    "Done": data.items.filter(i=>i.status==="Done")
  };

  const openDeadlineDialog = (task)=>{
    const existing = task.deadline || {};
    let typeSel = existing.type || "";
    let dateSel = "";
    let timeSel = existing.time || "";
    if(existing.date){
      if(existing.date.includes("T")){
        const [dPart, tPart] = existing.date.split("T");
        dateSel = dPart;
        if(!timeSel && tPart) timeSel = tPart.slice(0,5);
      } else {
        dateSel = existing.date;
      }
    }
    setDeadlineDialog({open:true, task, type:typeSel, date:dateSel, time:timeSel});
  };

  const closeDeadlineDialog = ()=> setDeadlineDialog(emptyDeadlineState());

  const submitDeadline = async ()=>{
    const {task, type, date, time} = deadlineDialog;
    if(!task) return;
    if(!type){
      await API.updateTask(task.id, {deadline:{type:null, date:null, time:null}});
      closeDeadlineDialog();
      await load();
      return;
    }
    const typeVal = type;
    const dateVal = (date || "").trim();
    const timeVal = (time || "").trim();
    if(!dateVal){ alert("Tanggal deadline wajib."); return; }
    if(!timeVal){ alert("Waktu deadline wajib."); return; }
    await API.updateTask(task.id, {deadline:{type:typeVal, date:dateVal, time:timeVal}});
    closeDeadlineDialog();
    await load();
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
      openDeadlineDialog(task);
      return;
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
      {deadlineDialog.open && (
        <div className="modal-backdrop" onClick={closeDeadlineDialog}>
          <form className="modal" role="dialog" aria-modal="true" aria-labelledby="deadline-dialog-title" onSubmit={e=>{e.preventDefault(); submitDeadline();}} onClick={e=>e.stopPropagation()}>
            <div className="h2" id="deadline-dialog-title">Set Deadline</div>
            <div className="small" style={{marginBottom:12}}>Task: {deadlineDialog.task?.title}</div>
            <div className="small" style={{marginBottom:16}}>Pilih tipe untuk mengaktifkan tanggal & waktu. Gunakan opsi "No Deadline" untuk menghapus.</div>
            <div className="grid grid-3" style={{marginBottom:12}}>
              <div>
                <label className="small">Tipe</label>
                <select className="select" value={deadlineDialog.type} autoFocus onChange={e=>{
                  const v = e.target.value;
                  setDeadlineDialog(prev=>({...prev, type:v, ...(v ? {} : {date:"", time:""})}));
                }}>
                  <option value="">(No Deadline)</option>
                  <option value="soft">Soft</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label className="small">Tanggal</label>
                <input className="input" type="date" value={deadlineDialog.date} onChange={e=>setDeadlineDialog(prev=>({...prev, date:e.target.value}))} disabled={!deadlineDialog.type}/>
              </div>
              <div>
                <label className="small">Waktu</label>
                <input className="input" type="time" value={deadlineDialog.time} onChange={e=>setDeadlineDialog(prev=>({...prev, time:e.target.value}))} disabled={!deadlineDialog.type}/>
              </div>
            </div>
            <div className="row" style={{justifyContent:"flex-end"}}>
              <button className="btn" type="button" onClick={closeDeadlineDialog}>Batal</button>
              <button className="btn btn-blue" type="submit">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

function emptyDeadlineState(){
  return {open:false, task:null, type:"", date:"", time:""};
}

function formFrom({text, progress_pct, links, highlight}){
  const fd = new FormData();
  fd.append("text", text);
  if(progress_pct !== "" && progress_pct !== null && progress_pct !== undefined) fd.append("progress_pct", String(progress_pct));
  fd.append("links_json", JSON.stringify(links||[]));
  fd.append("is_highlight", highlight ? "true" : "false");
  return fd;
}
