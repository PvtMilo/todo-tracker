import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import PublicHeader from "./components/PublicHeader";

export default function App(){
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <div>
      {isAdmin ? (
        <header className="panel">
          <div className="container hdr">
            <div className="row" style={{alignItems:"center"}}>
              <div className="h1">To-Do Tracker — Admin</div>
              <div className="row">
                <Link className="btn" to="/admin">Dashboard</Link>
                <Link className="btn" to="/admin/history">History</Link>
                <Link className="btn" to="/">Public</Link>
              </div>
            </div>
          </div>
        </header>
      ) : (
        <PublicHeader />
      )}
      <main className="container" style={{paddingTop:12}}>
        <Outlet />
      </main>
    </div>
  );
}
