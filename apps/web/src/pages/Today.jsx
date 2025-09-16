import React from "react";
import API from "../api";
import TaskList from "../components/TaskList";

function isToday(dStr){
  if(!dStr) return false;
  const today = new Date();
  const d = new Date(dStr + "T00:00:00");
  return d.getFullYear()===today.getFullYear() && d.getMonth()===today.getMonth() && d.getDate()===today.getDate();
}
function isOverdue(task){
  const d = task?.deadline?.date; if(!d) return false;
  if(task.status === "Done") return false;
  const end = new Date(d + "T23:59:59");
  return new Date() > end;
}

export default function Today(){
  const [data, setData] = React.useState({items:[]});
  const load = async ()=> setData(await API.getTasks({page:1, size:100}));
  React.useEffect(()=>{ load(); }, []);

  const items = data.items||[];
  const overdue = items.filter(isOverdue);
  const dueToday = items.filter(t=> isToday(t?.deadline?.date) && t.status !== "Done");
  const notStarted = items.filter(t=> t.status === "Not Started");
  const inProgress = items.filter(t=> t.status === "In Progress");
  const stale = items.filter(t=> t.stale);

  return (
    <div className="grid" style={{gap:12}}>
      <div className="panel">
        <div className="h2">Today</div>
        <div className="small">Overdue: {overdue.length} · Due Today: {dueToday.length} · In Progress: {inProgress.length}</div>
      </div>
      <TaskList title="Not Started" items={notStarted} />
      <TaskList title="Overdue" items={overdue} />
      <TaskList title="Due Today" items={dueToday} />
      <TaskList title="In Progress" items={inProgress} />
      <TaskList title="Stale (no update 3+ days)" items={stale} />
    </div>
  );
}
