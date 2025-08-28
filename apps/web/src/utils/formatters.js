export const fmtDate = (iso) => {
  if(!iso) return "-";
  try {
    const d = new Date(iso);
    return d.toLocaleString();
  } catch { return iso; }
};
export const daysLate = (deadlineDate, completedAt) => {
  if(!deadlineDate || !completedAt) return 0;
  const a = new Date(deadlineDate + "T00:00:00Z").getTime();
  const b = new Date(completedAt).getTime();
  const diff = Math.floor((b - a) / (1000*60*60*24));
  return diff > 0 ? diff : 0;
};
