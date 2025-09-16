import React from "react";

const TZ_KEY = "tz"; const LANG_KEY = "lang";

export default function Settings(){
  const [tz, setTz] = React.useState(localStorage.getItem(TZ_KEY) || "Asia/Jakarta");
  const [lang, setLang] = React.useState(localStorage.getItem(LANG_KEY) || "EN");

  return (
    <div className="grid" style={{gap:12}}>
      <div className="panel">
        <div className="h2">Settings / Pengaturan</div>
        <div className="grid grid-3">
          <div>
            <label className="small">Timezone</label>
            <select className="select" value={tz} onChange={e=>{ setTz(e.target.value); localStorage.setItem(TZ_KEY, e.target.value); }}>
              <option>Asia/Jakarta</option>
              <option>Asia/Makassar</option>
              <option>Asia/Jayapura</option>
              <option>UTC</option>
            </select>
          </div>
          <div>
            <label className="small">Language</label>
            <select className="select" value={lang} onChange={e=>{ setLang(e.target.value); localStorage.setItem(LANG_KEY, e.target.value); }}>
              <option value="EN">English</option>
              <option value="ID">Indonesia</option>
            </select>
          </div>
        </div>
      </div>
      <div className="panel">
        <div className="small">Default timezone is Asia/Jakarta. Dates shown respect this setting.</div>
      </div>
    </div>
  );
}

