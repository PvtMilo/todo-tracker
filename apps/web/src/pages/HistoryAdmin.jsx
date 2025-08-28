import React from "react";
import API from "../api";
import Filters from "../components/Filters";
import Pagination from "../components/Pagination";
import DeadlineBadge from "../components/DeadlineBadge";
import { daysLate, fmtDate } from "../utils/formatters";

export default function HistoryAdmin(){
  const [filters, setFilters] = React.useState({page:1, size:20});
  const [data, setData] = React.useState({items:[], total:0, page:1, size:20});

  const load = async ()=> setData(await API.getHistory(filters));
  React.useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [filters.page, filters.status, filters.category, filters.tag, filters.q]);

  return (
    <div className="grid" style={{gap:12}}>
      <div className="panel">
        <div className="h2">History (Done)</div>
        <div className="row">
          <a className="btn" href={`/api/export.csv?${new URLSearchParams(filters)}`}>Export CSV</a>
          <a className="btn" href={`/api/export.xlsx?${new URLSearchParams(filters)}`}>Export XLSX</a>
        </div>
      </div>

      <Filters
        filters={filters} setFilters={setFilters}
        onApply={()=>setFilters({...filters, page:1})}
        onReset={()=>setFilters({page:1, size:20})}
      />

      <div className="panel">
        <table className="table">
          <thead>
            <tr>
              <th>Title</th><th>Category</th><th>Tags</th><th>Deadline</th><th>Completed</th><th>Late?</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map(t=>{
              const lateDays = daysLate(t.deadline?.date, t.completed_at);
              return (
                <tr key={t.id}>
                  <td>{t.title}</td>
                  <td>{t.category}</td>
                  <td>{t.tags.join(", ")}</td>
                  <td><DeadlineBadge deadline={t.deadline} status={t.status} completedAt={t.completed_at}/></td>
                  <td>{fmtDate(t.completed_at)}</td>
                  <td>{lateDays>0 ? `Late ${lateDays} hari` : "-"}</td>
                </tr>
              );
            })}
            {data.items.length===0 && (
              <tr><td colSpan={6}><div className="small">Tidak ada data.</div></td></tr>
            )}
          </tbody>
        </table>
        <div style={{marginTop:8}}>
          <Pagination page={data.page} size={data.size} total={data.total}
            onChange={(p)=>setFilters({...filters, page:p})}/>
        </div>
      </div>
    </div>
  );
}
