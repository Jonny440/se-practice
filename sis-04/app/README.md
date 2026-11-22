# Smart Campus Room Availability Checker

React + TypeScript + Vite + Tailwind. Fictional rooms and bookings, a fixed clock — no login,
no database, no network calls.

## Setup

```bash
cd app
npm install
```

## Run the page

```bash
npm run dev
```

Vite prints the local URL (usually <http://localhost:5173>).

## Tests

```bash
npx vitest run
```

25 Vitest tests: `src/booking.test.ts` (AC1–AC5, F3, F5, B1–B4) and `src/filter.test.ts`
(F1, F2, F4, B5, B6, INT).

## Type check

```bash
npm run typecheck
```

## Where the code lives

| Path | Responsibility |
| --- | --- |
| `src/rooms.ts` | `Room` type and the `ROOMS` catalog (six rooms, each with its own bookings) |
| `src/booking.ts` | `canBook` (AC1–AC5) and `checkRoom` (F3, F5) |
| `src/filter.ts` | `filterRooms` (F1, F2) |
| `src/time.ts` | `"10:00"` ⇄ minutes |
| `src/components/` | `RoomAvailabilityChecker` (page), `FilterPanel`, `RoomCard` — presentation only |
