import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./styles.css";
import App from "./App";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import TaskDetailAdmin from "./pages/TaskDetailAdmin";
import HistoryAdmin from "./pages/HistoryAdmin";
import AllTasks from "./pages/AllTasks";
import Today from "./pages/Today";
import History from "./pages/History";
import Report from "./pages/Report";
import Settings from "./pages/Settings";
import TaskDetailPublic from "./pages/TaskDetailPublic";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<App />}>
          {/* Public */}
          <Route path="/" element={<Navigate to="/today" replace />} />
          <Route path="/today" element={<Today />} />
          <Route path="/tasks" element={<AllTasks />} />
          <Route path="/history" element={<History />} />
          <Route path="/report" element={<Report />} />
          <Route path="/settings" element={<Settings />} />
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
