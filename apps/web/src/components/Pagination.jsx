import React from "react";

export default function Pagination({page, size, total, onChange}){
  const pages = Math.max(1, Math.ceil(total / size));
  return (
    <div className="pagination">
      <button className="btn" disabled={page<=1} onClick={()=>onChange(page-1)}>Prev</button>
      <span className="small">Page {page} / {pages} • {total} items</span>
      <button className="btn" disabled={page>=pages} onClick={()=>onChange(page+1)}>Next</button>
    </div>
  );
}
