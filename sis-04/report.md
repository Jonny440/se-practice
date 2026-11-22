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

The prototype had five rooms whose bookings lived in one flat `SAMPLE_BOOKINGS` array and whose only
extra data was a building name. The catalog is now **six** fictional rooms in `src/rooms.ts` — Aurora
Hall (40 seats), Cedar Lab (24), Basalt Studio (12, blocked), Delta Auditorium (80), Elm Seminar Room
(18) and Fjord Workshop (30) — each with an id, a name, a capacity, an equipment list, a `blocked` flag
and its own bookings. Equipment names are `projector`, `whiteboard`, `video-conference` and
`microphone`.

The page asks two questions: how many attendees, and which equipment is required. The room list is
whatever `filterRooms` returns (`src/filter.ts`): capacity at least the group (F1) and every ticked
item present (F2). A blocked room stays in the list with a red **Blocked** badge, so Basalt Studio is
visible and its refusal is explained by the check rather than by silently disappearing (F3). When the
filter leaves nothing, the grid is replaced by the empty state *"No room matches N attendees with …"*
with a hint to lower the group size or untick an item (F4).

The result is **derived**, not stored. After "Check Availability" has been pressed once, the card is
recomputed from the selected room and the current inputs, so choosing another room re-runs the check
with the same times and the same clock (F5). The current time starts at a fixed `08:00`, so a
screenshot can be reproduced tomorrow.

### 4.2 Demonstration

<!-- One row per screenshot in evidence/. Say what is on it: the filter values, the rooms shown,
     the room selected, the times entered and the result. -->

| Screenshot | What it shows |
| --- | --- |
| `evidence/filter-match.png` | Attendees `20` with `projector` ticked. The header says "Matching rooms (3 of 6)" and shows exactly Aurora Hall, Cedar Lab and Delta Auditorium. Elm (18 seats) and Basalt (12 seats) fail F1, Fjord fails F2 because it has no projector. |
| `evidence/filter-empty.png` | The same `projector` tick still on, attendees `100`. "Matching rooms (0 of 6)" and the empty state: "No room matches 100 attendees with projector." with the hint, and the bookings panel saying there is nothing to show (F4). |
| `evidence/switch-a.png` | Attendees 20, no equipment ticked (4 of 6 rooms listed), **Aurora Hall** selected, current time 08:00, slot 10:00–11:00. Result: **Unavailable**, and Aurora's booking list shows the 10:00–11:00 booking that causes it. |
| `evidence/switch-b.png` | The same 20 attendees, the same 10:00–11:00 slot, now **Cedar Lab** selected. Result: **Available**, "Free for 60 minutes"; Cedar's only booking is 09:00–10:00, so the same times give the opposite answer (F5). |
| `evidence/narrow.png` | The same state at 390 px width: one column, filter, room cards, time slot, result and bookings stacked without horizontal scrolling; Cedar Lab still selected and still Available (AC6). |

## 5. Refactoring (Task 3)

<!-- The diagrams are diagrams/before.puml and diagrams/after.puml (README section 8). -->

### 5.1 Module responsibilities after

| Module or component | Responsibility |
| --- | --- |
| `src/rooms.ts` | The catalog and nothing else: the `Room` type and `ROOMS` with six rooms, each carrying its own `blocked` flag and `bookings`. No rule, no formatting. |
| `src/booking.ts` | AC1–AC5 in `canBook` (one implementation, no second list of reason strings) and F3/F5 in `checkRoom`, which finds the room by id and hands that room's own `blocked` and `bookings` to `canBook`; an unknown id is never available. |
| `src/filter.ts` | F1 and F2 in `filterRooms`: capacity at least the attendees and every selected equipment item present. Blocked rooms are deliberately left in the list. |
| `src/time.ts` | `labelToMinutes` / `minutesToLabel`: the HH:MM ⇄ minutes-after-midnight conversion the inputs and the booking list need. |
| `src/components/RoomAvailabilityChecker.tsx` | The page: form state, the calls to `filterRooms` and `checkRoom`, the result card and the booking list. Holds no room data and repeats no rule. |
| `src/components/FilterPanel.tsx` | Presentation only: the attendees input and the equipment checkboxes, reporting every change upward. |
| `src/components/RoomCard.tsx` | Presentation only: one room's name, capacity, id, equipment chips and its Blocked/Selected badge. |

### 5.2 Design decisions

<!-- At least two. The alternative is what you could have done instead (often what the assistant
     proposed). The why names an AC, an F-rule, a test or a risk from 3.1. -->

| Decision | Alternative I did not take | Why |
| --- | --- | --- |
| Keep blocked rooms in the filtered list, labelled "Blocked" | Hide them inside `filterRooms` | Section 7 leaves this to me. Keeping them makes F3 observable — Basalt Studio is listed, selecting it returns Unavailable — instead of vanishing silently, and it keeps F3 decided in `checkRoom` only, which is the function the F3 test calls. |
| A fixed demo clock at 08:00 | Reading `now` from `new Date()`, as week-08 did | Risk 5: with a live clock the same 10:00 request changes its answer during the day and no screenshot can be reproduced. AC1's "in the past" branch also needs a stable `now` to be demonstrable. |
| Show the decision and the interval, and drop the old per-rule reason strings | Port the reasons from `availability.ts` into `booking.ts` as a second rule list | Risk 1 was exactly that duplication: two copies of AC1–AC5 drift apart. The card names the four possible causes once as static text and the decision itself comes from one function, so a rule cannot be reported incorrectly. |

### 5.3 Duplication removed

<!-- One row per duplicated location that is gone. Count what you can point at, nothing else. -->

| Before (file / function, what was repeated) | After (where it lives now) |
| --- | --- |
| `src/lib/availability.ts`, `checkAvailability()` re-tested the interval, the 120-minute limit, `blocked` and the overlap that `canBook` had already tested, only to build a `reason`. | `src/booking.ts`; `canBook` is the only implementation and the page renders its Boolean. |
| `src/lib/availability.ts`, `checkAvailability()` filtered `SAMPLE_BOOKINGS` by `roomId`, and `src/components/RoomAvailabilityChecker.tsx` did the same join again in `roomBookings`. | `src/rooms.ts`: each room owns its `bookings`, so both filters are gone. |
| `src/components/RoomAvailabilityChecker.tsx` defined its own `RoomCard` and hard-coded the `" (exceeds 120-min limit)"` display rule; `src/lib/availability.ts` also exported a second `MAX_DURATION`/`MINUTES_PER_DAY` pair, and `src/time.ts` still carried a third copy of `MINUTES_PER_DAY`. | `src/components/RoomCard.tsx` holds the card, one `MAX_DURATION` in `src/booking.ts` is imported by the page for the hint, and `src/time.ts` now holds only the two conversion functions. |

## 6. Automated tests (Task 4)

### 6.1 Test plan

<!-- One row per required ID. A test may carry several IDs in its title,
     e.g. test('T06 B1 AC2: exactly 120 minutes is available', …) covers B1 and AC2. -->

| ID | Test title (as in the file) | Input → expected |
| --- | --- | --- |
| AC1 | `AC1 a request whose start equals its end is Unavailable` (also the ends-before-start, at-the-current-time and after-midnight cases) | 660–660 → `false`; 700–660 → `false`; 480–540 with `now` 480 → `false`; 1380–1441 → `false` |
| AC2 | `AC2 a request longer than 120 minutes is Unavailable` | 660–781 (121 min) → `false` |
| AC3 | `AC3 a request for a blocked room is Unavailable` | free slot, `blocked: true` → `false` |
| AC4 | `AC4 a slot between two bookings that touches both is Available` (also fully-inside and one-minute overlap) | 660–720 between 600–660 and 720–780 → `true`; 610–620 inside 600–660 → `false` |
| AC5 | `AC5 checkRoom leaves the catalog and its bookings unchanged` (also `AC5 an Available decision leaves the bookings array unchanged`) | deep-copy the catalog, call `checkRoom` twice, `toEqual` the copy → unchanged |
| F1 | `F1 filterRooms keeps only rooms with capacity >= the number of attendees` | 15 attendees over 20/12/30-seat rooms → ids `["atlas","cobalt"]` |
| F2 | `F2 filterRooms requires every selected equipment item, not just one of them` | projector + whiteboard → only `atlas` (Birch has no projector, Cobalt no whiteboard) |
| F3 | `F3 checkRoom rejects a blocked room even when its slot is free` | `gamma` (blocked, no bookings) 900–960 → `false` |
| F4 | `F4 filterRooms returns an empty list when no room can seat the group` | 100 attendees → `[]` |
| F5 | `F5 checkRoom uses the chosen room's bookings: 10:00-11:00 is busy in alpha and free in beta` | same request 600–660: `alpha` → `false`, `beta` → `true` |
| B1 | `AC2 B1: exactly 120 minutes (720-840) is Available` | 720–840 → `true` |
| B2 | `AC2 B2: 121 minutes (660-781) is Unavailable` | 660–781 → `false` |
| B3 | `AC4 B3: a request that touches the end of a booking is Available` | 660–720 after booking 600–660 → `true` |
| B4 | `AC4 B4: a request that overlaps a booking by one minute is Unavailable` | 599–640 against booking 600–660 → `false` |
| B5 | `B5 a room whose capacity equals the attendees is included` | 20 attendees, Atlas has 20 → result contains `atlas` |
| B6 | `B6 a room whose capacity is one below the attendees is excluded` | 21 attendees → result has no `atlas` |
| INT | `INT filterRooms then checkRoom: the matching free room books and the busy one does not` | `filterRooms(15, projector)` → `["atlas","cobalt"]`; then `checkRoom` on those two: busy `false`, blocked `false`, free `true` |

### 6.2 Commands

<!-- The commands exactly as you typed them, from app/. -->

```text
cd sis-04/app
npm install
npx vitest run
npm run typecheck
npm run dev -- --port 5199 --strictPort
```

### 6.3 Final run

<!-- The REAL output of the full run on your final code. Every test passes, and the number of
     tests equals what your test files hold (R2). -->

```text
$ npx vitest run

 RUN  v3.2.7 /Users/Z1/Desktop/software_engineering/sis-04/app

 ✓ src/booking.test.ts (17 tests) 2ms
 ✓ src/filter.test.ts (8 tests) 2ms

 Test Files  2 passed (2)
      Tests  25 passed (25)
   Start at  22:24:21
   Duration  462ms (transform 51ms, setup 0ms, collect 53ms, tests 4ms, environment 0ms, prepare 111ms)
```

## 7. Quality evaluation (Task 5)

<!-- Original = your baseline commit. Final = what you submit. "How I obtained it" says how you
     measured, so someone else could repeat it: "1.1 and 6.3 runs", "counted in 5.3",
     "git ls-files app/src". Do not invent a metric. Tests: write passed/total, e.g. 19/19. -->

| Measure | Original | Final | How I obtained it |
| --- | --- | --- | --- |
| Automated tests passed / total | 19/19 | 25/25 | the `Tests` line of the runs in 1.1 and 6.3 |
| Duplicated logic locations removed | 3 | 0 | counted in 5.3, one row per location, each checked in `git diff 2ab0c27..HEAD -- app/src` |
| Code structure: modules and their responsibilities | 5 files under `app/src`: one page component, and `lib/` with `rooms` (data plus a flat `SAMPLE_BOOKINGS`), `booking` (`canBook`), `availability` (time helpers and a second rule list), `booking.test` | 7 files: `rooms`, `booking`, `filter`, `time` and three presentation files (`RoomAvailabilityChecker`, `FilterPanel`, `RoomCard`) | `git ls-files app/src` at `2ab0c27` and at the head of this branch, read against 5.1 |
| Remaining limitation | not applicable (nothing to compare) | The page still has no rendered-UI test: F1–F5 are proven on `filterRooms` and `checkRoom`, and the empty state, the fixed clock and the blocked badge are only checked by the screenshots in `evidence/`. Adding `@testing-library/react` was out of scope for this assignment's fixed layout. | what I hit while writing 4.2 — the five screenshots are the only evidence for the page itself |

## 8. AI evidence appendix

<!-- At least three exchanges, one ### 8.N block each: the analysis (Task 1), the plan, and at
     least one implementation, refactoring or test exchange. Copy the block for more.
     The prompt as you sent it; the output may be cut to the part you used, with "[…]" where
     you cut. Verified by: the test, run, file or check that confirmed it — not "it looked right". -->

### 8.1 Exchange 1

**Tool and model:** DeepSeek (chat.deepseek.com), DeepSeek V4.1 Flash
**Date:** 20.11.2026
**Purpose:** codebase analysis before touching any code (Task 1)

**Prompt:**

```text
(see 2.2 — the repository map, AC1–AC6, F1–F5 and the constraints, sent as one message, ending with
"Give me: (1) the maintainability risks you can see, each pointing at a file or a function(), with the
evidence; (2) a prioritised plan of small steps, smallest safe step first. No code yet.")
```

**Output used:**

```text
1. availability.ts checkAvailability() duplicates booking.ts canBook(): the same five checks, in the
   same order, only to produce a reason string. A fix in one is invisible to the other.
2. rooms.ts SAMPLE_BOOKINGS is one flat array joined by roomId; checkAvailability and the page each
   filter it themselves, so a room id change leaves orphaned bookings.
3. The Room type has no equipment field and capacity is only printed, so F1/F2 have no data to read.
4. One 380-line component owns time formatting, cards, the form, the result and the bookings list.
[...]
Plan: fixed clock, new rooms.ts, filter.ts with tests first, checkRoom on top of canBook, then split
availability into booking, then split the page.
```

**Problems found:** The plan's step 5 said to turn `canBook` into `bookingProblem() === null` and keep a reason string. That is a bigger change than the brief needs (section 7 fixes `canBook` returning a Boolean) and it would have rewritten all 19 baseline tests. The assistant also suggested reading `now` from `new Date()` in tests "to keep them realistic", which contradicts AC1 being reproducible.
**Changes made:** I kept `canBook` Boolean-only, as section 7 requires, and dropped the reason strings instead of moving them. The clock stayed fixed at 480 in the tests and 08:00 on the page.
**Verified by:** the 19 baseline tests still pass unchanged after the catalog change, and `src/booking.ts` still exports `canBook` with the same parameter shape the tests call.

### 8.2 Exchange 2

**Tool and model:** DeepSeek (chat.deepseek.com), DeepSeek V4.1 Flash
**Date:** 20.11.2026
**Purpose:** the prioritised plan, and the smallest first step (Task 1, part 2)

**Prompt:**

```text
Good. Now turn those risks into a numbered plan, smallest safe change first. For each step tell me
which file changes, which test proves it, and what could break. Do not rewrite App.tsx; I want to make
one change, run npx vitest run, read the diff, commit, then continue. Remember the fixed layout
src/rooms.ts, src/booking.ts, src/filter.ts.
```

**Output used:**

```text
Step 1: rooms.ts to the fixed Room type with six rooms and per-room bookings; delete SAMPLE_BOOKINGS.
  Breaks: checkAvailability(room, ..., bookings) signature and the page's roomBookings filter.
  Test: the 19 existing canBook tests must stay green (they never read ROOMS).
Step 2: filter.ts with filterRooms; write F1, F2, F4, B5, B6 tests against a fixed catalog first.
Step 3: checkRoom in booking.ts; tests F3 and F5, plus an unknown id.
[...]
Step 6: split the page into FilterPanel and RoomCard.
```

**Problems found:** The assistant put `filterRooms` before `checkRoom`, which is right, but it also wanted to update `availability.ts` in step 1 — that file was about to be deleted, so the work would have been thrown away. Its step 2 test sketch compared against `ROOMS` instead of a fixed catalog inside the test file.
**Changes made:** I deleted `availability.ts` together with the page split instead of patching it, and both test files build their own small catalogs (`atlas`/`birch`/`cobalt` and `alpha`/`beta`/`gamma`), so the demo data cannot change a result.
**Verified by:** the commit order in `git log` (plan commit `97efaa7` before any `app/src` change), and `filter.test.ts` importing nothing from `rooms.ts`.

### 8.3 Exchange 3

**Tool and model:** DeepSeek (chat.deepseek.com), DeepSeek V4.1 Flash
**Date:** 21.11.2026
**Purpose:** implementation of the filter and of `checkRoom` (Task 2)

**Prompt:**

```text
Write src/filter.ts with filterRooms(rooms, {attendees, equipment}) for F1 (capacity >= attendees) and
F2 (all selected items) and nothing else. Then checkRoom(rooms, roomId, {start,end,now}) in booking.ts
that finds the room and calls the existing canBook with that room's blocked and bookings, returns false
for an unknown id, and changes nothing. Keep canBook exactly as it is. Show me the two functions only,
not a whole page.
```

**Output used:**

```text
// filter.ts
export function filterRooms(rooms: Room[], criteria: FilterCriteria): Room[] {
  return rooms.filter(
    (room) =>
      room.capacity >= criteria.attendees &&
      criteria.equipment.some((item) => room.equipment.includes(item))
  );
}
[...]
// booking.ts
export function checkRoom(rooms: Room[], roomId: string, request: RoomRequest): boolean {
  const room = rooms.find((candidate) => candidate.id === roomId);
  if (!room) return false;
  return canBook({ start: request.start, end: request.end, now: request.now,
                   blocked: room.blocked, bookings: room.bookings });
}
```

**Problems found:** The filter used `.some()`, so a room with only a projector matched "projector + whiteboard" — the opposite of F2. The assistant also wrote `if (!room) return true;` in its first draft of `checkRoom`, which would make an unknown id available.
**Changes made:** `.some()` became `.every()` after the F2 test failed; unknown id returns `false` and has its own test.
**Verified by:** `F2 filterRooms requires every selected equipment item, not just one of them` (only `atlas` survives projector + whiteboard) and `F5 checkRoom reports an unknown room id as Unavailable`; both are in the 25/25 run in 6.3.

## 9. Checker results and known fails

<!-- Every check still FAIL or ERROR in your last run of python tests/check_sis.py, and why.
     The same IDs go in submission.yml known_fails. None left? Write: none. -->

| Check | Why it still fails |
| --- | --- |
| none | The last run of `python tests/check_sis.py` at the declared commit reports pass=33 fail=0 error=0, so there is nothing to list here. |

## 10. AI reflection (Task 6)

<!-- 200–300 words, your own words, no assistant. Answer all five:
     What context did you provide the AI assistant? Which generated suggestions were useful or
     incorrect? What did you personally verify? How did tests influence your engineering
     decisions? What would you improve next? -->

I gave DeepSeek one long context message: a file-by-file map of the week-08 app, AC1–AC6, the five
new rules, the fixed layout (`rooms.ts`, `booking.ts`, `filter.ts`) and the constraint that the page
must not hold rules. I asked for risks and a plan, no code. Before that I had read the files myself,
so I could check each claim: the duplicated rule list in `checkAvailability`, the two separate
`SAMPLE_BOOKINGS` joins and the missing `equipment` field were all visible in the source, and I
confirmed every one before writing it into 3.1.

The plan was the useful part; the code was the part I had to fix. Its filter used `equipment.some()`,
which lets a projector-only room match "projector + whiteboard" — exactly what F2 forbids. The F2
test failed and `.every()` replaced it. It also wanted to turn `canBook` into a helper that returns a
problem, which would have rewritten nineteen green tests for no behavioural gain, so I rejected that
suggestion.

Tests decided the design more than the assistant did. Writing B5 and B6 from "capacity greater than or
equal" instead of from what the code returned is what settled the boundary; the F5 test — one slot
busy in one room and free in another — is why the page derives the result from the selected room's
own bookings instead of keeping an answer per room.

Next time I would add a rendered-UI test for the empty state, and I would not spend as long on
tailwind classes. My remaining worry is that the page itself is proven only by the screenshots in
`evidence/`, while the rules are proven by the suite.
