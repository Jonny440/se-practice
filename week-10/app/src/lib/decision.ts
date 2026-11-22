import { canBook } from "./booking";
import { Booking, Room } from "./rooms";
import { MINUTES_PER_DAY, minutesToLabel } from "./time";

export const MAX_DURATION = 120;

export interface Decision {
  available: boolean;
  reason?: string;
}

/**
 * The whole availability decision, pure: no React, no clock, no I/O.
 * AC1-AC5 are decided by canBook; the reason for a rejection is produced here,
 * in the same order canBook checks, so the page and the rule cannot disagree.
 */
export function decide(
  room: Room,
  start: number,
  end: number,
  now: number,
  bookings: Booking[]
): Decision {
  const roomBookings = bookings.filter((b) => b.roomId === room.id);
  const available = canBook({
    start,
    end,
    now,
    blocked: room.blocked,
    bookings: roomBookings.map((b) => ({ start: b.start, end: b.end })),
  });
  if (available) return { available: true };

  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) {
    return {
      available: false,
      reason:
        "Invalid time interval. Start must be before end, and both must be between 00:00 and 24:00.",
    };
  }
  if (!(start > now)) {
    return {
      available: false,
      reason: `Start time must be after the current time (${minutesToLabel(now)}).`,
    };
  }
  if (end - start > MAX_DURATION) {
    return {
      available: false,
      reason: `Booking exceeds the 120-minute maximum (requested ${end - start} minutes).`,
    };
  }
  if (room.blocked) {
    return {
      available: false,
      reason: "This room is currently blocked and cannot be booked.",
    };
  }

  const overlap = roomBookings.find((b) => start < b.end && end > b.start);
  if (!overlap) {
    return { available: false, reason: "The room is unavailable for this interval." };
  }
  return {
    available: false,
    reason: `Overlaps existing booking (${minutesToLabel(overlap.start)}–${minutesToLabel(overlap.end)} by ${overlap.bookedBy}).`,
  };
}
