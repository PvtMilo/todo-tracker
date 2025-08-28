import React from "react";

const mapTitle = {
  "Not Started": "Not Started",
  "In Progress": "In Progress",
  "On Hold": "On Hold",
  "Done": "Done"
};
const colors = {
  "Not Started": "",
  "In Progress": "border-green-600",
  "On Hold": "border-yellow-600",
  "Done": "border-purple-600"
};

export default function StatusCounters({counts}){
  return (
    <div className="kpis">
      {Object.keys(mapTitle).map((k)=>(
        <div key={k} className="kpi">
          <div className="v">{counts?.[k] ?? 0}</div>
          <div className="k">{mapTitle[k]}</div>
        </div>
      ))}
    </div>
  );
}
