import React from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

export default function Login(){
  const nav = useNavigate();
  const [username, setUsername] = React.useState("samuel");
  const [password, setPassword] = React.useState("");
  const [err, setErr] = React.useState("");

  return (
    <div className="panel" style={{maxWidth:420, margin:"40px auto"}}>
      <div className="h2">Admin Login</div>
      {err && <div className="badge badge-red" style={{marginBottom:8}}>{err}</div>}
      <div className="grid">
        <input className="input" placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input className="input" placeholder="password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="btn btn-blue" onClick={async ()=>{
          const r = await API.login(username, password);
          if(r.ok){ nav("/admin"); } else { setErr("Login gagal."); }
        }}>Masuk</button>
      </div>
    </div>
  );
}
