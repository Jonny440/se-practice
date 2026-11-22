import { test, expect } from "vitest";
import { filterRooms } from "./filter";
import { checkRoom } from "./booking";
import type { Room } from "./rooms";

// Fixed catalog for every case, independent of the demo data in src/rooms.ts.
const CATALOG: Room[] = [
  {
    id: "atlas",
    name: "Atlas",
    capacity: 20,
    equipment: ["projector", "whiteboard"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "birch",
    name: "Birch",
    capacity: 12,
    equipment: ["whiteboard"],
    blocked: false,
    bookings: [],
  },
  {
    id: "cobalt",
    name: "Cobalt",
    capacity: 30,
    equipment: ["projector", "microphone"],
    blocked: true,
    bookings: [],
  },
];

test("F1 filterRooms keeps only rooms with capacity >= the number of attendees", () => {
  const result = filterRooms(CATALOG, { attendees: 15, equipment: [] });
  expect(result.map((room) => room.id)).toEqual(["atlas", "cobalt"]);
});

test("F1 filterRooms keeps every room when the group is small and needs no equipment", () => {
  const result = filterRooms(CATALOG, { attendees: 4, equipment: [] });
  expect(result).toHaveLength(3);
});

test("F2 filterRooms requires every selected equipment item, not just one of them", () => {
  const result = filterRooms(CATALOG, {
    attendees: 1,
    equipment: ["projector", "whiteboard"],
  });
  expect(result.map((room) => room.id)).toEqual(["atlas"]);
});

test("F2 filterRooms returns no room when one required item is missing from every room", () => {
  const result = filterRooms(CATALOG, { attendees: 1, equipment: ["video-conference"] });
  expect(result).toHaveLength(0);
});

test("F4 filterRooms returns an empty list when no room can seat the group", () => {
  const result = filterRooms(CATALOG, { attendees: 100, equipment: [] });
  expect(result).toEqual([]);
});

test("B5 a room whose capacity equals the attendees is included", () => {
  const result = filterRooms(CATALOG, { attendees: 20, equipment: [] });
  expect(result.map((room) => room.id)).toContain("atlas");
});

test("B6 a room whose capacity is one below the attendees is excluded", () => {
  const result = filterRooms(CATALOG, { attendees: 21, equipment: [] });
  expect(result.map((room) => room.id)).not.toContain("atlas");
});

test("INT filterRooms then checkRoom: the matching free room books and the busy one does not", () => {
  const matching = filterRooms(CATALOG, { attendees: 15, equipment: ["projector"] });
  expect(matching.map((room) => room.id)).toEqual(["atlas", "cobalt"]);

  const busy = checkRoom(matching, "atlas", { start: 600, end: 660, now: 480 });
  const blocked = checkRoom(matching, "cobalt", { start: 600, end: 660, now: 480 });
  const free = checkRoom(matching, "atlas", { start: 660, end: 720, now: 480 });

  expect(busy).toBe(false);
  expect(blocked).toBe(false);
  expect(free).toBe(true);
});
