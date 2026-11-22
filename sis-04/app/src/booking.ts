import type { Room } from "./rooms";

export const MAX_DURATION = 120;
export const MINUTES_PER_DAY = 1440;

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

export interface RoomRequest {
  start: number;
  end: number;
  now: number;
}

/**
 * The single implementation of AC1-AC5. It reads its input and never mutates
 * the bookings it is given (AC5).
 */
export function canBook({ start, end, now, blocked, bookings }: CanBookInput): boolean {
  if (!(0 <= start && start < end && end <= MINUTES_PER_DAY)) return false; // AC1
  if (!(start > now)) return false; // AC1, requests in the past
  if (end - start > MAX_DURATION) return false; // AC2
  if (blocked) return false; // AC3
  for (const booking of bookings) {
    if (start < booking.end && end > booking.start) return false; // AC4, touching is allowed
  }
  return true;
}

/**
 * F3 and F5: the decision always comes from the chosen room's own `blocked` and
 * `bookings`, and an unknown id is never available. AC5: nothing changes.
 */
export function checkRoom(rooms: Room[], roomId: string, request: RoomRequest): boolean {
  const room = rooms.find((candidate) => candidate.id === roomId);
  if (!room) return false;
  return canBook({
    start: request.start,
    end: request.end,
    now: request.now,
    blocked: room.blocked,
    bookings: room.bookings,
  });
}
