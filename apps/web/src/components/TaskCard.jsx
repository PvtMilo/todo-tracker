import React from "react";
import { Link } from "react-router-dom";
import DeadlineBadge from "./DeadlineBadge";
import { fmtDate } from "../utils/formatters";

export default function TaskCard({task, admin=false, onAction}){
  const pct = task.progress_pct ?? 0;
  const actions = admin ? (
    <div className="row-actions">
      <button className="btn btn-blue" onClick={()=>onAction("update", task)}>Update</button>
      <button className="btn btn-green" onClick={()=>onAction("to_inprogress", task)}>In Progress</button>
      <button className="btn btn-yellow" onClick={()=>onAction("to_onhold", task)}>On Hold</button>
      <button className="btn btn-purple" onClick={()=>onAction("to_done", task)}>Mark Done</button>
      <button className="btn btn-teal" onClick={()=>onAction("set_deadline", task)}>Set Deadline</button>
      <button className="btn btn-red" onClick={()=>onAction("delete", task)}>Delete</button>
    </div>
  ) : null;

  return (
    <div className={`card ${task.stale ? 'stale':''}`}>
      <div style={{flex:1}}>
        <div className="title">{admin
          ? <Link to={`/admin/task/${task.id}`}>{task.title}</Link>
          : <Link to={`/t/${task.id}`}>{task.title}</Link>
        }</div>
        <div className="meta">
          <span className="chip">{task.category}</span>
          {task.tags?.map(t=><span key={t} className="chip">#{t}</span>)}
          <DeadlineBadge deadline={task.deadline} status={task.status} completedAt={task.completed_at}/>
          <span className="small">Last update: {fmtDate(task.last_update_at) }</span>
        </div>
        <div className="progress" style={{marginTop:8}}>
          <span style={{width:`${pct}%`}}/>
        </div>
      </div>
      {actions}
    </div>
  );
}
