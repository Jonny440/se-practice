export const MINUTES_PER_DAY = 1440;

/** 1440 formats as "24:00", the end-of-day bound the contract allows (AC1). */
export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Parses an HH:MM label into minutes from midnight.
 * "24:00" is the one accepted end-of-day label; 00:00 stays the start of the day.
 */
export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h === 24 && m === 0) return MINUTES_PER_DAY;
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}
