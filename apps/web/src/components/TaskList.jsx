import React from "react";
import TaskCard from "./TaskCard";

export default function TaskList({title, items, admin=false, onAction}){
  return (
    <div className="panel">
      <div className="h2">{title}</div>
      <div className="grid" style={{gap:8}}>
        {items.map(t=>(
          <TaskCard key={t.id} task={t} admin={admin} onAction={onAction}/>
        ))}
        {items.length===0 && <div className="small">Tidak ada data.</div>}
      </div>
    </div>
  );
}
