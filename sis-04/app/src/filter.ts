import type { Room } from "./rooms";

export type FilterCriteria = {
  attendees: number;
  equipment: string[];
};

/**
 * F1: capacity must be at least the number of attendees.
 * F2: the room must contain every selected equipment item.
 * Blocked rooms stay in the list (they are labelled in the UI) and are rejected
 * by checkRoom instead, so F3 is decided in one place.
 */
export function filterRooms(rooms: Room[], criteria: FilterCriteria): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.every((item) => room.equipment.includes(item))
  );
}
