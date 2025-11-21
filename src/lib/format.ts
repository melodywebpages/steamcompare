export function formatPlaytime(minutes: number): string {
  if (minutes === 0) return "0 min";
  
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const mins = minutes % 60;
  
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  if (hours > 0) parts.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  if (mins > 0 || parts.length === 0) parts.push(`${mins} min${mins !== 1 ? "s" : ""}`);
  
  return parts.join(", ");
}
