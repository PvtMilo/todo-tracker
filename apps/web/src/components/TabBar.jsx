import React from "react";
import { NavLink } from "react-router-dom";

const items = [
  { to: "/today", label: "Today", icon: "📅" },
  { to: "/tasks", label: "All", icon: "📋" },
  { to: "/history", label: "History", icon: "🕓" },
  { to: "/report", label: "Report", icon: "📈" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function TabBar(){
  return (
    <nav className="tabbar" aria-label="Primary">
      {items.map(it => (
        <NavLink key={it.to} to={it.to} className={({isActive}) => `tabbar-item${isActive? ' active':''}`}>
          <span className="tab-ico" aria-hidden>{it.icon}</span>
          <span className="tab-lbl">{it.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

