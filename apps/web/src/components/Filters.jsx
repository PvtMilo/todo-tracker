import React from "react";

export default function Filters({filters, setFilters, onApply, onReset, compact=false}){
  const [q, setQ] = React.useState(filters.q || "");
  React.useEffect(()=>{ setQ(filters.q||""); /* sync external changes */ }, [filters.q]);
  React.useEffect(()=>{
    const t = setTimeout(()=> setFilters({...filters, q, page:1}), 250);
    return ()=> clearTimeout(t);
  // eslint-disable-next-line
  }, [q]);

  return (
    <div className="panel">
      <div className="grid grid-3">
        <div>
          <label className="small" htmlFor="search-input">Search</label>
          <input id="search-input" className="input" placeholder="Cari judul..." value={q}
            onChange={e=>setQ(e.target.value)} aria-label="Search tasks"/>
        </div>
        <div>
          <label className="small">Status</label>
          <select className="select" value={filters.status||""} onChange={e=>setFilters({...filters, status:e.target.value||undefined, page:1})}>
            <option value="">Semua</option>
            <option>Not Started</option>
            <option>In Progress</option>
            <option>On Hold</option>
            <option>Done</option>
          </select>
        </div>
        <div>
          <label className="small">Kategori</label>
          <select className="select" value={filters.category||""} onChange={e=>setFilters({...filters, category:e.target.value||undefined, page:1})}>
            <option value="">Semua</option>
            <option>Operational</option>
            <option>Development</option>
            <option>Experiment/Belajar</option>
          </select>
        </div>
        <div>
          <label className="small" htmlFor="tag-input">Tag (exact)</label>
          <input id="tag-input" className="input" placeholder="mis. docker" value={filters.tag||""}
            onChange={e=>setFilters({...filters, tag:e.target.value||undefined, page:1})}/>
        </div>
        {!compact && (
          <>
            <div/>
            <div className="row">
              <button className="btn" onClick={onApply}>Apply</button>
              <button className="btn" onClick={onReset}>Reset</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
