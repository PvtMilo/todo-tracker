import React from "react";
import { fmtDate } from "../utils/formatters";

export default function UpdateTimeline({updates=[], admin=false, onEdit, onDelete, onViewImage}){
  if(updates.length===0) return <div className="small">Belum ada update.</div>;
  return (
    <div className="grid" style={{gap:8}}>
      {updates.map(u=>(
        <div key={u.id} className={`panel ${u.is_highlight? 'hl':''}`}>
          <div className="row" style={{justifyContent:"space-between"}}>
            <div>
              <div className="small">{fmtDate(u.created_at)}</div>
              {u.progress_pct !== null && u.progress_pct !== undefined && (
                <div className="small">Progress: {u.progress_pct}%</div>
              )}
            </div>
            {admin && (
              <div className="row">
                <button className="btn btn-blue" onClick={()=>onEdit(u)}>Edit</button>
                <button className="btn btn-red" onClick={()=>onDelete(u)}>Delete</button>
              </div>
            )}
          </div>
          <div style={{marginTop:6}}>{u.text}</div>
          {u.links_json && JSON.parse(u.links_json).length>0 && (
            <div className="chips" style={{marginTop:6}}>
              {JSON.parse(u.links_json).map((L,idx)=>(
                <a key={idx} className="chip" href={L} target="_blank" rel="noreferrer">{L}</a>
              ))}
            </div>
          )}
          {u.image_path && (
            <div style={{marginTop:8}}>
              <img
                src={u.image_path}
                alt="bukti" style={{maxWidth:"220px",borderRadius:8,cursor:"zoom-in"}}
                onClick={()=>onViewImage(u)}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
