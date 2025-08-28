import React from "react";
import API from "../api";
import TaskList from "../components/TaskList";
import Filters from "../components/Filters";

export default function PublicHome(){
  const [filters, setFilters] = React.useState({page:1, size:50});
  const [data, setData] = React.useState({items:[], total:0, page:1, size:50});

  const load = async ()=> setData(await API.getTasks(filters));
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [filters.page, filters.status, filters.category, filters.tag, filters.q]);

  const grouped = {
    "Not Started": data.items.filter(i=>i.status==="Not Started"),
    "In Progress": data.items.filter(i=>i.status==="In Progress"),
    "On Hold": data.items.filter(i=>i.status==="On Hold"),
    "Done": data.items.filter(i=>i.status==="Done").slice(0,10)
  };

  return (
    <div className="grid" style={{gap:12}}>
      <Filters
        filters={filters} setFilters={setFilters} compact
        onApply={()=>setFilters({...filters, page:1})}
        onReset={()=>setFilters({page:1, size:50})}
      />
      <TaskList title="Planned (Not Started)" items={grouped["Not Started"]}/>
      <TaskList title="In Progress" items={grouped["In Progress"]}/>
      <TaskList title="On Hold" items={grouped["On Hold"]}/>
      <TaskList title="Done (Latest 10)" items={grouped["Done"]}/>
      <div className="panel">
        <a className="btn" href="/admin/history">View all history →</a>
      </div>
    </div>
  );
}
