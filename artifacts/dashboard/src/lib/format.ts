export function formatUptime(seconds: number): string {
  if (!seconds || isNaN(seconds)) return "0d 0h 0m";
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${d}d ${h}h ${m}m`;
}
