import React from "react";

export default function DeadlineBadge({deadline, status, completedAt}){
  if(!deadline || !deadline.type) return <span className="badge">No deadline</span>;
  const {type, date, time} = deadline;
  const datePart = date ? date.split("T")[0] : "";
  let timePart = time || "";
  if(!timePart && date && date.includes("T")){
    const [, tPart] = date.split("T");
    if(tPart) timePart = tPart.slice(0,5);
  }
  const displayDate = [datePart, timePart].filter(Boolean).join(" ");
  const isoTarget = datePart ? `${datePart}T${timePart ? `${timePart}:00` : "23:59:59"}` : null;
  const late = (() => {
    if(!isoTarget) return false;
    const end = new Date(isoTarget);
    if(status === "Done" && completedAt){
      return new Date(completedAt) > end;
    }
    return new Date() > end;
  })();
  const cls = late ? (type === "soft" ? "badge-yellow" : "badge-red") : "badge-blue";
  const label = type === "soft" ? "Soft" : "Hard";
  return <span className={`badge ${cls}`}>{label} - {displayDate || "-"}{late ? " (Overdue)" : ""}</span>;
}
