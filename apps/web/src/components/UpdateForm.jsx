import React from "react";
import { compressToWebP } from "../utils/imageCompression";

export default function UpdateForm({onSubmit, defaults, submitLabel="Tambah Update"}){
  const [text, setText] = React.useState(defaults?.text || "");
  const [progress, setProgress] = React.useState(defaults?.progress_pct ?? "");
  const [links, setLinks] = React.useState(defaults?.links_json ? JSON.parse(defaults.links_json) : []);
  const [addLink, setAddLink] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [highlight, setHighlight] = React.useState(!!defaults?.is_highlight);
  const [busy, setBusy] = React.useState(false);

  const addLinkNow = ()=>{
    const v = (addLink||"").trim();
    if(!v) return;
    setLinks([...links, v]); setAddLink("");
  };

  const handleFile = async (f) => {
    if(!f) { setImage(null); return; }
    const webp = await compressToWebP(f, 1600, 350);
    setImage(webp);
  };

  return (
    <div className="panel">
      <div className="grid">
        <div>
          <label className="small">Deskripsi singkat</label>
          <textarea className="textarea" value={text} onChange={e=>setText(e.target.value)} />
        </div>
        <div className="grid grid-3">
          <div>
            <label className="small">Progress % (opsional)</label>
            <input className="input" type="number" min="0" max="100"
              value={progress} onChange={e=>setProgress(e.target.value)}/>
          </div>
          <div>
            <label className="small">Bukti Gambar (format bebas)</label>
            <input className="input" type="file" accept="*/*"
              onChange={async e=>{ if(e.target.files?.[0]) await handleFile(e.target.files[0]) }}/>
          </div>
          <div>
            <label className="small">Highlight</label><br/>
            <input type="checkbox" checked={highlight} onChange={e=>setHighlight(e.target.checked)} /> Tampilkan menonjol
          </div>
        </div>
        <div>
          <label className="small">Link bukti (opsional)</label>
          <div className="row">
            <input className="input" placeholder="https://..." value={addLink} onChange={e=>setAddLink(e.target.value)}/>
            <button className="btn" onClick={addLinkNow}>Tambah</button>
          </div>
          <div className="chips" style={{marginTop:6}}>
            {links.map((L,i)=>(
              <span key={i} className="chip" onClick={()=>setLinks(links.filter((_,ix)=>ix!==i))}>{L} ✕</span>
            ))}
          </div>
        </div>

        <div className="row">
          <button className="btn btn-blue" disabled={busy} onClick={async ()=>{
            setBusy(true);
            const fd = new FormData();
            fd.append("text", text);
            if(progress !== "" && progress !== null) fd.append("progress_pct", String(progress));
            fd.append("links_json", JSON.stringify(links));
            fd.append("is_highlight", highlight ? "true" : "false");
            if(image) fd.append("image", image, image.name);
            await onSubmit(fd);
            setBusy(false);
            // Reset form setelah sukses
            setText("");
            setProgress("");
            setLinks([]);
            setImage(null);
            setHighlight(false);
          }}>{submitLabel}</button>
        </div>
      </div>
    </div>
  );
}
