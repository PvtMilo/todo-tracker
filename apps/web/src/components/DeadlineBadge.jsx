import React from "react";

export default function DeadlineBadge({deadline, status, completedAt}){
  if(!deadline || !deadline.type) return <span className="badge">No deadline</span>;
  const {type, date} = deadline;
  const d = date || "";
  const late = (() => {
    if(!d) return false;
    const today = new Date();
    const end = new Date(d + "T23:59:59");
    if(status === "Done" && completedAt){
      return new Date(completedAt) > end;
    }
    // if not done, check current lateness
    return today > end;
  })();

  // On-time: blue; Soft-late: yellow; Hard-late: red
  const cls = late ? (type === "soft" ? "badge-yellow" : "badge-red") : "badge-blue";
  const label = type === "soft" ? "Soft" : "Hard";
  return <span className={`badge ${cls}`}>{label} · {d || "-"}{late ? " (Overdue)" : ""}</span>;
}

