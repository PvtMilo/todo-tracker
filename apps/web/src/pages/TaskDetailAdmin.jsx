import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";
import { fmtDate } from "../utils/formatters";
import TagInput from "../components/TagInput";
import UpdateTimeline from "../components/UpdateTimeline";
import UpdateForm from "../components/UpdateForm";
import Lightbox from "../components/Lightbox";
import Toast from "../components/Toast";

import AdminHeader from "../components/AdminHeader";

export default function TaskDetailAdmin(){
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = React.useState(null);
  const [edit, setEdit] = React.useState(null);
  const [imgPreview, setImgPreview] = React.useState("");
  const [toast, setToast] = React.useState({show:false, type:"success", text:""});
  const [detailsCollapsed, setDetailsCollapsed] = React.useState(true);

  const load = async ()=>{
    const fetched = await API.getTask(id);
    if(fetched?.deadline){
      const existing = fetched.deadline;
      let dateVal = existing.date || "";
      let timeVal = existing.time || "";
      if(dateVal && dateVal.includes("T")){
        const [dPart, tPart] = dateVal.split("T");
        dateVal = dPart;
        if(!timeVal && tPart) timeVal = tPart.slice(0,5);
      }
      fetched.deadline = {
        type: existing.type || null,
        date: dateVal || null,
        time: timeVal || null
      };
      if(!fetched.deadline.type){
        fetched.deadline = {type:null, date:null, time:null};
      }
    }
    setTask(fetched);
  };
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [id]);
  React.useEffect(()=>{ if(!API.token()) navigate('/admin/login'); }, [navigate]);

  if(!task) return <div className="small">Loading...</div>;

  return (
    <div className="grid" style={{gap:12}}>
      <AdminHeader />
      <div className="panel">
        <div className="row" style={{justifyContent:'space-between', alignItems:'center'}}>
          <div className="h2">Task Detail (Admin)</div>
          <button className="btn" onClick={()=>setDetailsCollapsed(v=>!v)} aria-expanded={!detailsCollapsed} aria-controls="task-details-body">
            {detailsCollapsed ? 'Expand' : 'Collapse'}
          </button>
        </div>
        {!detailsCollapsed && (
          <div id="task-details-body">
            <div className="grid grid-3">
              <div>
                <label className="small">Judul</label>
                <input className="input" value={task.title}
                  onChange={e=>setTask({...task, title:e.target.value})}/>
              </div>
              <div>
                <label className="small">Kategori</label>
                <select className="select" value={task.category}
                  onChange={e=>setTask({...task, category:e.target.value})}>
                  <option>Operational</option>
                  <option>Development</option>
                  <option>Experiment/Belajar</option>
                </select>
              </div>
              <div>
                <label className="small">Progress %</label>
                <input className="input" type="number" min="0" max="100"
                  value={task.progress_pct??0}
                  onChange={e=>setTask({...task, progress_pct:Number(e.target.value)})}/>
              </div>
              <div>
                <label className="small">Deadline Type</label>
                <select className="select" value={task.deadline?.type || ""}
                  onChange={e=>{
                    const v = e.target.value;
                    if(!v){
                      setTask({...task, deadline:{type:null, date:null, time:null}});
                    } else {
                      setTask({...task, deadline:{...(task.deadline||{}), type:v}});
                    }
                  }}>
                  <option value="">(None)</option>
                  <option value="soft">soft</option>
                  <option value="hard">hard</option>
                </select>
              </div>
              <div>
                <label className="small">Deadline Date</label>
                <input
                  className="input"
                  type="date"
                  value={task.deadline?.date || ""}
                  onChange={e=>setTask({...task, deadline:{...(task.deadline||{}), date:e.target.value || null}})}
                  disabled={!task.deadline?.type}
                />
              </div>
              <div>
                <label className="small">Deadline Time</label>
                <input
                  className="input"
                  type="time"
                  value={task.deadline?.time || ""}
                  onChange={e=>setTask({...task, deadline:{...(task.deadline||{}), time:e.target.value || null}})}
                  disabled={!task.deadline?.type}
                />
              </div>
              <div>
                <label className="small">Tags</label>
                <TagInput value={task.tags||[]} onChange={tags=>setTask({...task, tags})}/>
              </div>
            </div>
            <div className="row" style={{marginTop:8}}>
              <button className="btn btn-blue" onClick={async ()=>{
                const dl = task.deadline && task.deadline.type ? {
                  type: task.deadline.type,
                  date: task.deadline.date || null,
                  time: task.deadline.time || null
                } : {type:null, date:null, time:null};
                await API.updateTask(task.id, {
                  title: task.title, category: task.category,
                  progress: task.progress_pct,
                  deadline: dl,
                  tags: task.tags || []
                });
                await load();
                setToast({show:true, type:"success", text:"Perubahan task disimpan"});
              }}>Save</button>
              <span className="small">Created: {fmtDate(task.created_at)} - Updated: {fmtDate(task.updated_at)}</span>
            </div>
          </div>
        )}
      </div>

      <div className="panel">
        <div className="h2">Timeline</div>
        <UpdateTimeline
          updates={task.updates}
          admin
          onEdit={(u)=>setEdit(u)}
          onDelete={async (u)=>{ if(confirm("Hapus update?")){ await API.deleteUpdate(u.id); await load(); setToast({show:true,type:"success",text:"Update dihapus"}); } }}
          onViewImage={(u)=> setImgPreview(u.image_path)}
        />
      </div>

      <UpdateForm
        submitLabel="Tambah Update"
        onSubmit={async (fd)=>{
          await API.createUpdate(task.id, fd);
          await load();
          setToast({show:true, type:"success", text:"Update berhasil ditambahkan"});
        }}
      />

      {edit && (
        <div className="panel">
          <div className="h2">Edit Update</div>
          <UpdateForm
            defaults={edit}
            submitLabel="Simpan Perubahan"
            onSubmit={async (fd)=>{
              await API.editUpdate(edit.id, fd);
              setEdit(null);
              await load();
              setToast({show:true, type:"success", text:"Perubahan update disimpan"});
            }}
          />
          <button className="btn" onClick={()=>setEdit(null)}>Batal</button>
        </div>
      )}

      <Lightbox src={imgPreview} onClose={()=>setImgPreview("")}/>
      <Toast show={toast.show} type={toast.type} text={toast.text} onClose={()=>setToast({...toast, show:false})}/>
      <button
        className="fab"
        onClick={()=>{
          const el = document.getElementById('add-update');
          if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
        }}
        aria-label="Add Update"
      >
        + Add Update
      </button>
    </div>
  );
}
