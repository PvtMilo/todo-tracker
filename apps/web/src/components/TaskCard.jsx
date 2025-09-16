import React from "react";
import { Link } from "react-router-dom";
import DeadlineBadge from "./DeadlineBadge";
import { fmtDate } from "../utils/formatters";

export default function TaskCard({task, admin=false, onAction}){
  const pct = task.progress_pct ?? 0;
  const pctDisplay = Math.round(pct);

  const progressInfo = React.useMemo(()=>{
    if(task.status === "Done"){
      return {
        variant:"success",
        message:"Completed",
        tooltip: task.completed_at ? `Completed at ${fmtDate(task.completed_at)}` : "Task completed"
      };
    }
    const dl = task.deadline;
    if(!dl || !dl.type || !dl.date){
      return {variant:"info", message:"No deadline", tooltip:"No deadline set"};
    }
    const rawTime = (dl.time || "23:59").padEnd(5, "0");
    const due = new Date(`${dl.date}T${rawTime}:00`);
    if(Number.isNaN(due.getTime())){
      return {variant:"info", message:"Invalid deadline", tooltip:"Deadline value not parseable"};
    }
    const diffMs = due.getTime() - Date.now();
    const diffHours = diffMs / (1000*60*60);
    const absHours = Math.abs(diffHours);
    const days = Math.floor(absHours/24);
    const hours = Math.round(absHours % 24);
    const describe = ()=>{
      const parts = [];
      if(days>0) parts.push(`${days}d`);
      if(hours>0 && days < 3) parts.push(`${hours}h`);
      if(parts.length===0) parts.push(`${Math.max(1, Math.round(absHours))}h`);
      return parts.join(" ");
    };
    if(diffHours < 0){
      return {
        variant:"danger",
        message:`Overdue by ${describe()}`,
        tooltip:`Deadline was ${fmtDate(`${dl.date}T${rawTime}:00`)}`
      };
    }
    const variant = diffHours <= 48 ? "warning" : "info";
    const prefix = diffHours <= 4 ? "Due soon" : "Due in";
    return {
      variant,
      message: `${prefix} ${describe()}`,
      tooltip: `Deadline ${fmtDate(`${dl.date}T${rawTime}:00`)}`
    };
  }, [task.deadline, task.status, task.completed_at]);

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
        <div
          className={`progress progress-${progressInfo.variant}`}
          style={{marginTop:8}}
          title={progressInfo.tooltip}
          role="progressbar"
          aria-valuenow={pctDisplay}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuetext={`${pctDisplay}%`}
        >
          <span style={{width:`${pct}%`}}/>
        </div>
        <div className="progress-meta">
          <span>{pctDisplay}%</span>
          <span>{progressInfo.message}</span>
        </div>
      </div>
      {actions}
    </div>
  );
}
