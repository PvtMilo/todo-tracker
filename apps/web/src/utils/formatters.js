export const fmtDate = (iso) => {
  if(!iso) return "-";
  try {
    const d = new Date(iso);
    const tz = localStorage.getItem('tz') || 'Asia/Jakarta';
    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric', month: 'short', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
      hour12: false, timeZone: tz
    }).format(d);
  } catch { return iso; }
};
export const daysLate = (deadlineDate, completedAt) => {
  if(!deadlineDate || !completedAt) return 0;
  const a = new Date(deadlineDate + "T00:00:00Z").getTime();
  const b = new Date(completedAt).getTime();
  const diff = Math.floor((b - a) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
};
