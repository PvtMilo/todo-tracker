import React from "react";
import { Link } from "react-router-dom";

export default function PublicHeader(){
  return (
    <header className="panel">
      <div className="container hdr">
        <div className="h1">To-Do Tracker — Public</div>
        <div className="row">
          <Link className="btn" to="/">Home</Link>
          <a className="btn" href="/api/export.csv">Export CSV</a>
          <a className="btn" href="/api/export.xlsx">Export XLSX</a>
          <Link className="btn" to="/admin/login">Admin</Link>
        </div>
      </div>
    </header>
  );
}
