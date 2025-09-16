import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import PublicHeader from "./components/PublicHeader";
import TabBar from "./components/TabBar";

export default function App(){
  const loc = useLocation();
  const isAdmin = loc.pathname.startsWith("/admin");

  return (
    <div>
      {isAdmin ? null : <PublicHeader />}
      <main className="container" style={{paddingTop:12}} role="main">
        <Outlet />
      </main>
      {!isAdmin && <TabBar />}
    </div>
  );
}
