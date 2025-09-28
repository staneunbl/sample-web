export function formatDateForInput(isoDate?: string) {
  if (!isoDate) return "";
  return isoDate.split("T")[0];
}