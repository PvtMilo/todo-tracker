import React from "react";
import { Link } from "react-router-dom";

export default function AdminHeader(){
  return (
    <div className="hdr">
      <div className="h1">Dashboard</div>
      <div className="row">
        <Link className="btn" to="/admin">Dashboard</Link>
        <Link className="btn" to="/admin/history">History</Link>
        <Link className="btn" to="/">Public</Link>
      </div>
    </div>
  );
}
