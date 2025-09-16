import React from "react";

export default function Toast({show, type="success", text, onClose}){
  React.useEffect(()=>{
    if(!show) return;
    const t = setTimeout(()=> onClose?.(), 2500);
    return ()=> clearTimeout(t);
  }, [show, onClose]);

  if(!show) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <div className={`toast-item ${type}`}>{text}</div>
    </div>
  );
}
