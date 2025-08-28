import React from "react";
import API from "../api";

export default function TagInput({value=[], onChange}){
  const [input, setInput] = React.useState("");
  const [suggest, setSuggest] = React.useState([]);

  React.useEffect(()=>{
    let active = true;
    (async ()=>{
      const r = await API.tagSuggest(input.trim().toLowerCase());
      if(active) setSuggest(r.items || []);
    })();
    return ()=>{active=false;}
  }, [input]);

  const addTag = (t)=>{
    t = (t||"").trim().toLowerCase();
    if(!t) return;
    if(value.includes(t)) return;
    onChange([...value, t]);
    setInput("");
  };

  const remove = (t)=> onChange(value.filter(x=>x!==t));

  return (
    <div>
      <div className="chips" style={{marginBottom:8}}>
        {value.map(t=>(
          <span key={t} className="chip" onClick={()=>remove(t)} title="hapus tag">{t} ✕</span>
        ))}
      </div>
      <input className="input" placeholder="Tambah tag (Enter)..." value={input}
        onChange={e=>setInput(e.target.value)}
        onKeyDown={e=>{
          if(e.key==="Enter"){ e.preventDefault(); addTag(input); }
        }}
      />
      {input && suggest.length>0 && (
        <div className="panel-2" style={{marginTop:6}}>
          <div className="small">Saran</div>
          <div className="chips">
            {suggest.map(s=>(
              <span key={s} className="chip" onClick={()=>addTag(s)}>{s}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
