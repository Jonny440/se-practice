# SIS #04 — Report: Evolving the Smart Campus Room Availability Checker

<!-- The ONLY file you write prose in. Keep every numbered heading (## 1. … ## 10.), every
     ### sub-heading and every **Label:** word — the checker finds your answers by them.
     Replace every "(write here)" and "(paste here)". Delete these <!-- --> comments if you like. -->

## 1. Setup and starting point

<!-- Model: the exact model with its version, as the tool shows it ("ChatGPT" is a tool, not a
     model). If the tool does not show it, write: not displayed
     Starting point: week-08 | week-07 | sis-03 | starter   (README section 3)
     Baseline commit: the commit that brings your starting point into sis-04/app/ UNCHANGED —
     git rev-parse --short HEAD right after that commit. It is your "initial version". -->

| Item | Value |
| --- | --- |
| Assistant (tool) | DeepSeek (chat.deepseek.com) |
| Assistant model | DeepSeek V4.1 Flash |
| Starting point | week-08 |
| Baseline commit | 2ab0c27 |
| Language (ts or js) | ts |
| Vitest version | 3.2.7 |
| Where I ran the tests | macOS terminal, inside `sis-04/app`, Node 24.13.1 |

### 1.1 Baseline run

<!-- Before you change anything: run the tests of your starting point inside app/ and paste the
     REAL output. No tests yet (starter, sis-03)? Paste the run anyway: Vitest prints
     "No test files found". That is your honest "original" number, 0/0. -->

```text
$ npx vitest run

 RUN  v3.2.7 /Users/Z1/Desktop/software_engineering/sis-04/app

 ✓ src/lib/booking.test.ts (19 tests) 2ms

 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  18:58:01
   Duration  238ms (transform 22ms, setup 0ms, collect 18ms, tests 2ms, environment 0ms, prepare 43ms)
```

## 2. Context for the assistant

### 2.1 Repository map

<!-- The concise map you gave the assistant: the files that matter and one line each on what
     they do. A tree is fine:  src/App.tsx — the page, holds the rooms and the form … -->

```text
sis-04/app/
├── index.html                  entry page, mounts #root
├── package.json                Vite + React + TypeScript + Vitest 3.2.7
├── vite.config.ts              @ -> ./src alias, react plugin
└── src/
    ├── main.tsx                React root
    ├── App.tsx                 renders <RoomAvailabilityChecker />
    ├── index.css               tailwind directives
    ├── components/
    │   └── RoomAvailabilityChecker.tsx   the whole page: clock, room cards,
    │                                     start/end inputs, result card, booking list
    └── lib/
        ├── rooms.ts            Room + Booking types, ROOMS (5 rooms, no equipment),
        │                       SAMPLE_BOOKINGS (6 bookings, joined to rooms by roomId)
        ├── booking.ts          canBook({start,end,now,blocked,bookings}) -> boolean (AC1-AC5)
        ├── availability.ts     labelToMinutes, minutesToLabel, MAX_DURATION and
        │                       checkAvailability(), which re-checks the rules to build a reason
        └── booking.test.ts     19 Vitest tests of canBook (T01-T14, X1, X2, BUG-A, BUG-B, AC5)
```

### 2.2 The context message as sent

<!-- The whole first message of your analysis chat: the map, AC1–AC6, F1–F5 and the constraints
     (no login, payments, live APIs or database; fictional data only). Unedited. -->

```text
You are helping me extend a Smart Campus Room Availability Checker (React + TypeScript + Vite + Vitest).
Do not write code yet. I want maintainability risks and a plan of small steps, not a rewrite.

Repository map (starting point, week-08):
- src/App.tsx: renders RoomAvailabilityChecker.
- src/components/RoomAvailabilityChecker.tsx: the entire page -- current-time input, room cards, start/end inputs, duration hint, the result card and the list of bookings of the selected room.
- src/lib/rooms.ts: Room type (id, name, building, capacity, blocked), Booking type (roomId, start, end, bookedBy), ROOMS (5 rooms) and SAMPLE_BOOKINGS (one flat array for all rooms, joined by roomId).
- src/lib/booking.ts: canBook({start,end,now,blocked,bookings}) -> boolean, the single place for AC1-AC5.
- src/lib/availability.ts: labelToMinutes, minutesToLabel, MAX_DURATION and checkAvailability(room,start,end,currentTime,bookings), which calls canBook and then repeats the same rules to produce a human-readable reason.
- src/lib/booking.test.ts: 19 Vitest tests of canBook (no UI tests).

Requirements to preserve: AC1 reject start >= end and requests in the past; AC2 maximum duration 120 minutes; AC3 reject a blocked room; AC4 reject overlaps but allow bookings that only touch at endpoints; AC5 return Available/Unavailable without changing booking data; AC6 clear, responsive feedback on desktop and mobile.

New requirements: a fictional catalog of at least four rooms, each with id, name, capacity, equipment list, blocked status and its own bookings. F1 capacity filter (capacity >= attendees); F2 equipment filter (the room must contain ALL selected items); F3 a blocked room is never reported available; F4 a clear empty state when no room matches; F5 changing the selected room refreshes the result.

Constraints: no login, no payments, no live APIs, no database, fictional data only. The page must stay responsive (AC6) and must not hold room data or booking rules of its own. The final file layout is fixed: src/rooms.ts (Room + ROOMS), src/booking.ts (canBook unchanged, plus checkRoom(rooms, roomId, request)), src/filter.ts (filterRooms(rooms, criteria)).

Give me: (1) the maintainability risks you can see, each pointing at a file or a function(), with the evidence; (2) a prioritised plan of small steps, smallest safe step first. No code yet.
```

## 3. Codebase analysis (Task 1)

### 3.1 Maintainability risks

<!-- At least three, found in YOUR starting code. "Where" names a file or a function(),
     e.g. src/App.tsx, check(). Evidence is what you saw, not what the assistant said.
     Priority: High / Medium / Low. -->

| # | Risk | Where (file / function) | Evidence | Priority |
| --- | --- | --- | --- | --- |
| 1 | The availability rules exist twice: `canBook` returns the boolean and `checkAvailability` repeats the same five checks, in the same order, only to build a message. A change to one copy silently disagrees with the other. | `src/lib/availability.ts`, `checkAvailability()`; `src/lib/booking.ts`, `canBook()` | `canBook` tests `start > now`, `end - start > 120`, `blocked` and the strict overlap loop; `checkAvailability` calls it and then re-tests the same four conditions with the same constants to pick a `reason`. The page displays that `reason`, so a rule fixed in one file and not the other shows a wrong explanation. | High |
| 2 | Bookings are stored in one flat `SAMPLE_BOOKINGS` array keyed by `roomId`, so every reader re-implements the join and a new room can be added with orphaned bookings. | `src/lib/rooms.ts`, `SAMPLE_BOOKINGS`; two filters at `src/lib/availability.ts`, `checkAvailability()` and `src/components/RoomAvailabilityChecker.tsx`, `roomBookings` | `checkAvailability` does `bookings.filter((b) => b.roomId === room.id)` and the page separately does `SAMPLE_BOOKINGS.filter((b) => b.roomId === selectedRoomId)`. Nothing in the type system connects a room to a booking; changing an id in `ROOMS` leaves its bookings attached to a room that no longer exists. | High |
| 3 | The data model cannot express the new feature: `Room` has no `equipment`, and `capacity` is only printed on the card, never used in a decision, so F1 and F2 have nothing to read. | `src/lib/rooms.ts`, `Room`; `src/components/RoomAvailabilityChecker.tsx`, `RoomCard` | `Room` is `{id, name, building, capacity, blocked}` -- no equipment field; `capacity` appears once, as `{room.capacity} seats` in the card text. There is no function that takes an attendees count. | High |
| 4 | One 380-line component owns the form state, the clock formatting, the room cards, the result card and the booking list, and it also hard-codes the 120-minute display rule. | `src/components/RoomAvailabilityChecker.tsx`, `RoomAvailabilityChecker()` | The file holds `getNowMinutes`, the `RoomCard` component, six `useState` hooks, the duration hint (`diff > MAX_DURATION ? " (exceeds 120-min limit)"`), the result markup and the bookings list; any UI change means editing the same file as the rules. | Medium |
| 5 | The page derives the current time from the real clock, so the same input gives a different result depending on when the page is opened, and the result cannot be reproduced from a screenshot. | `src/components/RoomAvailabilityChecker.tsx`, `getNowMinutes()` | `getNowMinutes()` returns `new Date().getHours() * 60 + new Date().getMinutes()` and initialises `currentTimeLabel` from it; the tests fix `now = 480` instead, so page and test can disagree. | Medium |

### 3.2 Improvement plan — before editing

<!-- Numbered, in the order you will do it, smallest safe step first. Written BEFORE you change
     code: the commit that adds this section comes before the commit that changes app/src. -->

1. Freeze the demo clock: replace `getNowMinutes()` with a fixed `08:00` default, so every demonstration and screenshot is reproducible (risk 5).
2. Add the catalog shape: rewrite `src/rooms.ts` to the fixed `Room` type (`id`, `name`, `capacity`, `equipment`, `blocked`, `bookings`) with six fictional rooms, and delete `SAMPLE_BOOKINGS` so each room owns its bookings (risks 2 and 3).
3. Add `src/filter.ts` with `filterRooms(rooms, {attendees, equipment})` and write the F1, F2, F4, B5 and B6 tests first against a fixed catalog inside the test file.
4. Add `checkRoom(rooms, roomId, request)` to `src/booking.ts` that looks the room up and calls `canBook` with that room's own `blocked` and `bookings`; add the F3, F5 and unknown-id tests.
5. Move the rule list out of `availability.ts` into one `bookingProblem()` in `booking.ts`, so `canBook` is `bookingProblem(...) === null` and the reason text no longer repeats the checks (risk 1); keep all 19 baseline tests green.
6. Split the page: `App.tsx` keeps the layout, `RoomCard` and `FilterPanel` become presentational components, and the page imports `filterRooms`, `checkRoom` and the time helpers instead of holding rules (risk 4). Commit after each step and re-run the whole suite.

### 3.3 One AI suggestion I rejected or modified

| Suggestion (as the assistant made it) | Decision | Why — with the AC, F-rule, test or file behind it |
| --- | --- | --- |
| Change `canBook` to take a whole `Room` object (`canBook(room, start, end, now)`) so it can read `blocked` and `bookings` directly, instead of adding `checkRoom`. | Rejected | Section 7 fixes `canBook({ start, end, now, blocked, bookings })` and the 19 baseline tests already call it that way; changing its shape would rewrite every AC test for no behavioural gain. `checkRoom` is the room-aware adapter the brief asks for, and A4 checks that it passes the chosen room's `blocked` and `bookings` into the unchanged `canBook`. |

## 4. Feature extension (Task 2)

### 4.1 What I added

<!-- Short: the catalog (how many rooms, which equipment), how the filter is chosen on the page,
     what the empty state says, what happens to an old result when the room changes. -->

(write here)

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | (write here) |
| `evidence/filter-empty.png` | (write here) |
| `evidence/switch-a.png` | (write here) |
| `evidence/switch-b.png` | (write here) |
| `evidence/narrow.png` | (write here) |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | (write here) |
| `src/booking.ts` | (write here) |
| `src/filter.ts` | (write here) |
| (write here) | (write here) |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| (write here) | (write here) | (write here) |
| (write here) | (write here) | (write here) |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| (write here) | (write here) |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | (write here) | (write here) |
| AC2 | (write here) | (write here) |
| AC3 | (write here) | (write here) |
| AC4 | (write here) | (write here) |
| AC5 | (write here) | (write here) |
| F1 | (write here) | (write here) |
| F2 | (write here) | (write here) |
| F3 | (write here) | (write here) |
| F4 | (write here) | (write here) |
| F5 | (write here) | (write here) |
| B1 | (write here) | (write here) |
| B2 | (write here) | (write here) |
| B3 | (write here) | (write here) |
| B4 | (write here) | (write here) |
| B5 | (write here) | (write here) |
| B6 | (write here) | (write here) |
| INT | (write here) | (write here) |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
(paste here)
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
(paste here)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | (write here) | (write here) | (write here) |
| Duplicated logic locations removed | (write here) | (write here) | (write here) |
| Code structure: modules and their responsibilities | (write here) | (write here) | (write here) |
| Remaining limitation | (write here) | (write here) | (write here) |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.2 Exchange 2

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

### 8.3 Exchange 3

**Tool and model:** (write here)
**Date:** (write here)
**Purpose:** (write here)

**Prompt:**

```text
(paste here)
```

**Output used:**

```text
(paste here)
```

**Problems found:** (write here)
**Changes made:** (write here)
**Verified by:** (write here)

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| (write here) | (write here) |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

(write here)
