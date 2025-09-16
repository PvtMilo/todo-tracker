import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminHeader(){
  const loc = useLocation();
  const title = React.useMemo(()=>{
    if(loc.pathname.startsWith("/admin/history")) return "History ADMIN";
    return "Dashboard ADMIN";
  }, [loc.pathname]);
  return (
    <div className="hdr">
      <div className="h1">{title}</div>
      <div className="row">
        <Link className="btn" to="/admin">Dashboard</Link>
        <Link className="btn" to="/admin/history">History</Link>
        <Link className="btn" to="/">Public</Link>
      </div>
    </div>
  );
}
