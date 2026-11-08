export interface Interval {
  start: number;
  end: number;
}

export interface CanBookInput {
  start: number;
  end: number;
  now: number;
  blocked: boolean;
  bookings: Interval[];
}

/**
 * Availability decision for one room, implementing AC1-AC5.
 * It reads the bookings and never changes them (AC5).
 */
export function canBook({ start, end, now, blocked, bookings }: CanBookInput): boolean {
  if (!(0 <= start && start < end && end <= 1440)) return false;
  if (!(start > now)) return false;
  if (end - start > 120) return false;
  if (blocked) return false;
  for (const b of bookings) {
    if (start < b.end && end > b.start) return false;
  }
  return true;
}
