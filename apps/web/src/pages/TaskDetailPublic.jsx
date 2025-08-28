import React from "react";
import { useParams } from "react-router-dom";
import API from "../api";
import UpdateTimeline from "../components/UpdateTimeline";
import DeadlineBadge from "../components/DeadlineBadge";
import Lightbox from "../components/Lightbox";

export default function TaskDetailPublic(){
  const { id } = useParams();
  const [task, setTask] = React.useState(null);
  const [imgPreview, setImgPreview] = React.useState("");

  const load = async ()=> setTask(await API.getTask(id));
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [id]);

  if(!task) return <div className="small">Loading...</div>;
  const highlights = (task.updates||[]).filter(u=>u.is_highlight);

  return (
    <div className="grid" style={{gap:12}}>
      <div className="panel">
        <div className="h2">{task.title}</div>
        <div className="chips">
          <span className="chip">{task.category}</span>
          {task.tags.map(t=><span key={t} className="chip">#{t}</span>)}
          <DeadlineBadge deadline={task.deadline} status={task.status} completedAt={task.completed_at}/>
          <span className="chip">Progress {task.progress_pct}%</span>
        </div>
      </div>
      {highlights.length>0 && (
        <div className="panel">
          <div className="h2">Highlights</div>
          <UpdateTimeline
            updates={highlights}
            onViewImage={(u)=> setImgPreview(u.image_path)}
          />
        </div>
      )}
      <div className="panel">
        <div className="h2">Timeline</div>
        <UpdateTimeline
          updates={task.updates}
          onViewImage={(u)=> setImgPreview(u.image_path)}
        />
      </div>
      <Lightbox src={imgPreview} onClose={()=>setImgPreview("")}/>
    </div>
  );
}
