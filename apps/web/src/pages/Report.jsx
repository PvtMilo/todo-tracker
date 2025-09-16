import React from "react";
import API from "../api";

function percent(n,d){ if(!d) return 0; return Math.round((n/d)*100); }

export default function Report(){
  const [counts, setCounts] = React.useState({});
  const [kpi, setKpi] = React.useState({done:0, ontime:0});

  React.useEffect(()=>{
    (async ()=>{
      setCounts(await API.counts());
      const to = new Date();
      const from = new Date(Date.now() - 13*24*3600*1000);
      const fmt = (d)=> d.toISOString().slice(0,10);
      const hist = await API.getHistory({from: fmt(from), to: fmt(to), page:1, size:200});
      const items = hist.items||[];
      const ontime = items.filter(t=>{
        const dd = t.deadline?.date; if(!dd) return true; // count no-deadline as on-time
        const completed = new Date(t.completed_at);
        const end = new Date(dd + 'T23:59:59');
        return completed <= end;
      }).length;
      setKpi({done: items.length, ontime});
    })();
  }, []);

  const ontimePct = percent(kpi.ontime, kpi.done);

  return (
    <div className="grid" style={{gap:12}}>
      <div className="panel">
        <div className="h2">Report (Read‑only)</div>
        <div className="kpis">
          <div className="kpi"><div className="v">{counts['Not Started']||0}</div><div className="k">Not Started</div></div>
          <div className="kpi"><div className="v">{counts['In Progress']||0}</div><div className="k">In Progress</div></div>
          <div className="kpi"><div className="v">{counts['On Hold']||0}</div><div className="k">On Hold</div></div>
          <div className="kpi"><div className="v">{counts['Done']||0}</div><div className="k">Done (all)</div></div>
          <div className="kpi"><div className="v">{kpi.done}</div><div className="k">Done (14 days)</div></div>
          <div className="kpi"><div className="v">{ontimePct}%</div><div className="k">On Time (14 days)</div></div>
        </div>
        <div className="row" style={{marginTop:8}}>
          <button className="btn" onClick={()=>{ navigator.clipboard?.writeText(window.location.href); }}>Copy Link</button>
          <button className="btn" onClick={()=>window.print()}>Download PDF</button>
        </div>
      </div>
    </div>
  );
}

