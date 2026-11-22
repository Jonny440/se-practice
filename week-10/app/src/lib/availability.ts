import { canBook } from "./booking";
import { Booking, Room } from "./rooms";

export interface CheckResult {
  available: boolean;
  reason?: string;
}

export const MINUTES_PER_DAY = 1440;
export const MAX_DURATION = 120;

export function minutesToLabel(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function labelToMinutes(label: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(label.trim());
  if (!match) return null;
  const h = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return null;
  return h * 60 + m;
}

/**
 * Core availability check implementing AC1–AC5.
 * Returns a decision without mutating booking data (AC5).
 */
export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[]
): CheckResult {
  // The decision itself belongs to canBook (AC1-AC5).
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const available = canBook({
    start,
    end,
    now: currentTime,
    blocked: room.blocked,
    bookings: roomBookings.map((b) => ({ start: b.start, end: b.end })),
  });
  if (available) return { available: true };

  // Unavailable: report the first criterion that rejected it, in the same order as canBook.
  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    return { available: false, reason: "Invalid time interval. Start must be before end, and both must be between 00:00 and 24:00." };
  }
  if (!(start > currentTime)) {
    return { available: false, reason: `Start time must be after the current time (${minutesToLabel(currentTime)}).` };
  }
  if (end - start > MAX_DURATION) {
    return { available: false, reason: `Booking exceeds the 120-minute maximum (requested ${end - start} minutes).` };
  }
  if (room.blocked) {
    return { available: false, reason: "This room is currently blocked and cannot be booked." };
  }

  const overlap = roomBookings.find((b) => start < b.end && end > b.start)!;
  return {
    available: false,
    reason: `Overlaps existing booking (${minutesToLabel(overlap.start)}–${minutesToLabel(overlap.end)} by ${overlap.bookedBy}).`,
  };
}
