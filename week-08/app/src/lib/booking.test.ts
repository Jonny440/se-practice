import { test, expect } from "vitest";
import { canBook } from "./booking";

// Fixed clock for every case: 08:00.
const NOW = 8 * 60;
const TEN_TO_ELEVEN = [{ start: 600, end: 660 }];

test("T01 a request that touches the start of a booking is Available (AC4)", () => {
  expect(canBook({ start: 540, end: 600, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(true);
});

test("T02 a request that overlaps a booking by one minute is Unavailable (AC4)", () => {
  expect(canBook({ start: 599, end: 640, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(false);
});

test("T03 a request whose start equals its end is Unavailable (AC1)", () => {
  expect(canBook({ start: 660, end: 660, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("T04 a request that ends before it starts is Unavailable (AC1)", () => {
  expect(canBook({ start: 700, end: 660, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("T05 a request that starts at the current time is Unavailable (AC1)", () => {
  expect(canBook({ start: NOW, end: NOW + 60, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("T06 a 121-minute request is Unavailable (AC2)", () => {
  expect(canBook({ start: 660, end: 781, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("T07 a request of exactly 120 minutes is Available (AC2)", () => {
  expect(canBook({ start: 660, end: 780, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test("T08 a request that touches the end of a booking is Available (AC4)", () => {
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(true);
});

test("T09 a request for a blocked room is Unavailable (AC3)", () => {
  expect(canBook({ start: 720, end: 780, now: NOW, blocked: true, bookings: [] })).toBe(false);
});

test("T10 a free midday slot is Available (AC4)", () => {
  expect(canBook({ start: 720, end: 780, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test("T11 a request fully inside a booking is Unavailable (AC4)", () => {
  expect(canBook({ start: 610, end: 620, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(false);
});

test("T12 a request that ends exactly at midnight is Available (AC1)", () => {
  expect(canBook({ start: 1380, end: 1440, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test("T13 a request that ends after midnight is Unavailable (AC1)", () => {
  expect(canBook({ start: 1380, end: 1441, now: NOW, blocked: false, bookings: [] })).toBe(false);
});

test("T14 a slot between two bookings that touches both is Available (AC4)", () => {
  const bookings = [{ start: 600, end: 660 }, { start: 720, end: 780 }];
  expect(canBook({ start: 660, end: 720, now: NOW, blocked: false, bookings })).toBe(true);
});

test("X1 a request that covers an existing booking is Unavailable (AC4)", () => {
  expect(canBook({ start: 540, end: 720, now: NOW, blocked: false, bookings: TEN_TO_ELEVEN })).toBe(false);
});

test("X2 a request with no existing bookings is Available (AC4)", () => {
  expect(canBook({ start: 900, end: 960, now: NOW, blocked: false, bookings: [] })).toBe(true);
});

test("BUG-A a request that touches bookings on both sides is Available", () => {
  const bookings = [{ start: 540, end: 600 }, { start: 660, end: 720 }];
  expect(canBook({ start: 600, end: 660, now: NOW, blocked: false, bookings })).toBe(true);
});

test("BUG-B an Available request that touches nothing changes no booking", () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = bookings.map((b) => ({ ...b }));

  expect(canBook({ start: 900, end: 960, now: NOW, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});

test("AC5 an Available decision leaves the bookings array unchanged", () => {
  const bookings = [{ start: 600, end: 660 }];
  const before = bookings.map((b) => ({ ...b }));

  expect(canBook({ start: 720, end: 780, now: NOW, blocked: false, bookings })).toBe(true);
  expect(bookings).toEqual(before);
});
