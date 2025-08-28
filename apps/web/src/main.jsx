import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import App from "./App";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TaskDetailAdmin from "./pages/TaskDetailAdmin";
import HistoryAdmin from "./pages/HistoryAdmin";
import PublicHome from "./pages/PublicHome";
import TaskDetailPublic from "./pages/TaskDetailPublic";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Public */}
          <Route path="/" element={<PublicHome />} />
          <Route path="/t/:id" element={<TaskDetailPublic />} />

          {/* Admin */}
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/task/:id" element={<TaskDetailAdmin />} />
          <Route path="/admin/history" element={<HistoryAdmin />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
