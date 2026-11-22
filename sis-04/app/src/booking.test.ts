import { test, expect } from "vitest";
import { canBook, checkRoom } from "./booking";
import type { Room } from "./rooms";

// Fixed clock for every case: 08:00.
const NOW = 8 * 60;
const TEN_TO_ELEVEN = [{ start: 600, end: 660 }];

// Fixed catalog for the checkRoom cases, independent of src/rooms.ts.
const CATALOG: Room[] = [
  {
    id: "alpha",
    name: "Alpha",
    capacity: 20,
    equipment: ["projector"],
    blocked: false,
    bookings: [{ start: 600, end: 660 }],
  },
  {
    id: "beta",
    name: "Beta",
    capacity: 12,
    equipment: ["whiteboard"],
    blocked: false,
    bookings: [],
  },
  {
    id: "gamma",
    name: "Gamma",
    capacity: 30,
    equipment: ["projector"],
    blocked: true,
    bookings: [],
  },
];

test("AC1 a request whose start equals its end is Unavailable", () => {
  expect(canBook({ start: 660, end: 660, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC1 a request that ends before it starts is Unavailable", () => {
  expect(canBook({ start: 700, end: 660, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC1 a request that starts at the current time is Unavailable", () => {
  expect(canBook({ start: NOW, end: NOW + 60, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC1 a request that ends after midnight is Unavailable", () => {
  expect(canBook({ start: 1380, end: 1441, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC2 a request longer than 120 minutes is Unavailable", () => {
  expect(canBook({ start: 660, end: 781, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC2 B2: 121 minutes (660-781) is Unavailable", () => {
  expect(canBook({ start: 660, end: 781, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("AC2 B1: exactly 120 minutes (720-840) is Available", () => {
  expect(canBook({ start: 720, end: 840, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test("AC3 a request for a blocked room is Unavailable", () => {
  expect(canBook({ start: 720, end: 780, now: NOW, blocked: true, bookings: [] })).toBe(false);
});

test("AC4 B3: a request that touches the end of a booking is Available", () => {
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(true);
});

test("AC4 B4: a request that overlaps a booking by one minute is Unavailable", () => {
  expect(canBook({ start: 599, end: 640, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(false);
});

test("AC4 a request fully inside a booking is Unavailable", () => {
  expect(canBook({ start: 610, end: 620, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(false);
});

test("AC4 a slot between two bookings that touches both is Available", () => {
  const bookings = [
    { start: 600, end: 660 },
    { start: 720, end: 780 },
  ];
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })).toBe(true);
});

test("AC5 an Available decision leaves the bookings array unchanged", () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = bookings.map((booking) => ({ ...booking }));

  expect(canBook({ start: 900, end: 960, now: NOW, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});

test("AC5 checkRoom leaves the catalog and its bookings unchanged", () => {
  const before = CATALOG.map((room) => ({ ...room, bookings: room.bookings.map((b) => ({ ...b })) }));

  checkRoom(CATALOG, "alpha", { start: 900, end: 960, now: NOW });
  checkRoom(CATALOG, "gamma", { start: 900, end: 960, now: NOW });

  expect(CATALOG).toEqual(before);
});

test("F3 checkRoom rejects a blocked room even when its slot is free", () => {
  expect(checkRoom(CATALOG, "gamma", { start: 900, end: 960, now: NOW })).toBe(false);
});

test("F5 checkRoom uses the chosen room's bookings: 10:00-11:00 is busy in alpha and free in beta", () => {
  const request = { start: 600, end: 660, now: NOW };

  expect(checkRoom(CATALOG, "alpha", request)).toBe(false);
  expect(checkRoom(CATALOG, "beta", request)).toBe(true);
});

test("F5 checkRoom reports an unknown room id as Unavailable", () => {
  expect(checkRoom(CATALOG, "no-such-room", { start: 900, end: 960, now: NOW })).toBe(false);
});
