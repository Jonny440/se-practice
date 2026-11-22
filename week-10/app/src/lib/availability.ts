import { Booking, Room } from "./rooms";
import { Decision, decide, MAX_DURATION } from "./decision";
import { labelToMinutes, MINUTES_PER_DAY, minutesToLabel } from "./time";

// The page keeps one import path: the time helpers and the decision live in
// small pure modules (src/lib/time.ts, src/lib/decision.ts) and are re-exported here.
export { labelToMinutes, MINUTES_PER_DAY, MAX_DURATION, minutesToLabel };
export type { Decision };

export interface CheckResult {
  available: boolean;
  reason?: string;
}

/** Thin adapter kept for the page: same inputs, outputs and reason text as before. */
export function checkAvailability(
  room: Room,
  start: number,
  end: number,
  currentTime: number,
  bookings: Booking[]
): CheckResult {
  return decide(room, start, end, currentTime, bookings);
}
