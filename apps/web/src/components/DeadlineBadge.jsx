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

  const cls = type === "soft"
    ? (late ? "badge-yellow" : "badge-blue")
    : (late ? "badge-red" : "badge-red");
  const label = type === "soft" ? "Soft" : "Hard";
  return <span className={`badge ${cls}`}>{label} • {d || "-"}</span>;
}
