import React from "react";
import { Link } from "react-router-dom";

export default function PublicHeader(){
  return (
    <header className="panel" role="banner">
      <div className="container hdr">
        <div className="h1">To-Do Tracker</div>
        <div className="row">
          <Link className="btn" to="/today">Today</Link>
          <Link className="btn" to="/tasks">All</Link>
          <Link className="btn" to="/history">History</Link>
          <a className="btn" href="/api/export.csv">CSV</a>
          <a className="btn" href="/api/export.xlsx">XLSX</a>
          <Link className="btn" to="/admin/login">Admin</Link>
        </div>
      </div>
    </header>
  );
}

