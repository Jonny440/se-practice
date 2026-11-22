# AGENTS.md — Smart Campus Room Availability Checker

Instructions for any coding agent working in this project. Read this file before you change
anything, and follow it over any general habit of yours.

## Project

A React + TypeScript page (Vite) that tells a student whether a campus room is free for a
requested time. The booking rule lives in `src/lib/booking.ts` (`canBook`); the page is
`src/components/RoomAvailabilityChecker.tsx`; the tests are in `src/lib/booking.test.ts`.

Use one fictional room with a made-up timetable; never use real names or the KBTU portal.

## Acceptance contract

- AC1 Reject start ≥ end and requests in the past.
- AC2 Enforce the maximum allowed duration (120 minutes).
- AC3 Reject a blocked room.
- AC4 Reject overlaps. Bookings that only touch at an endpoint are allowed, not an overlap.
- AC5 Return Available / Unavailable without changing booking data.
- AC6 Keep the feedback clear on desktop and mobile: the decision plus a readable reason.

## Commands

- Install: `npm install`
- Dev server: `npm run dev`
- Tests: `npm test`
- Build: `npm run build`

## You may

- Edit any file in the project.
- Add packages when a task needs them.
- Do not add a login, sign-in or any database (no Supabase, SQL, Firebase or backend); the bookings stay in `src/lib/rooms.ts`.

## Before you finish

- Make sure the page still loads.
- Run `npm test` and keep the whole suite green before you propose the change as accepted.
- Never commit secrets, API keys, passwords or a `.env` file; this project needs no credentials.
- Do not deploy or publish anywhere (no Netlify, Vercel or production builds).
