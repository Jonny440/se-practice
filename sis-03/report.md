# SIS #03 — Report: Smart Campus Room Availability Checker

## 1. Setup and reuse

| Item | Value |
| --- | --- |
| Coding assistant (tool) | ChatGPT |
| Coding assistant model | ChatGPT-5.6 Sol |
| Bolt.new model | not displayed |
| Bolt project link | https://bolt.new/p/71992720 |
| Language | python |
| Path | A |
| Python v1 from | week-05 |
| Web v1 from | week-06 |

Both v1 artifacts are copied unchanged: `code/original/booking_v1.py` is the Week 05 v1 and
`web/original/project/` is the unzipped Week 06 Bolt export, `evidence/web-v1.png` is its first
usable preview. Everything else here — the twelve-case table, the issue log, the critique, the
agent analysis, the reflection — was produced for this SIS.

## 2. Baseline — before any new AI exchange

### 2.1 Scope in my own words

**Scope:** The user is a student, who can search through a catalog of rooms, select a needed room, check its availability and create a booking. After creation the user gets a confirmation message and can cancel the booking using the system.

### 2.2 The acceptance criteria in my own words

| AC | In my own words |
| --- | --- |
| AC1 | The booking may be created throughout the whole day, where day is from 0 to 1440 |
| AC2 | The maximum booking time is 120 minutes |
| AC3 | Some rooms are blocked and may not be booked |
| AC4 | Reject the booking, which overlap with other booking |
| AC5 | Show a clear message, if the room available or not and do not change the initial booking array data |
| AC6 | The system should be accessible from any device |

### 2.3 Likely failure points

| # | Failure point | AC | How I will check it |
| --- | --- | --- | --- |
| 1 | Boundary data booking | AC1 | use the boundary data like 1440; 0 |
| 2 | Overlapping bookings. Last time it did not calculate the booking time and thus could not tell if bokkings overlap | AC4 | Use dummy data inside the existing array and try to create new booking |

### 2.4 The contract

| Parameter | Meaning | Type and allowed values |
| --- | --- | --- |
| `start` | Starting time of the booking | Integer from 0 to 1440 |
| `end` | Ending time of the booking | Integer from 0 to 1440 |
| `now` | The time right now. (For testing purposes it should be adjustable) | Integer from 0 to 1439 |
| `blocked` | Variable to check if the room is blocked or not | Boolean |
| `existing` | An array of existing booking, to check for overlap | Array of tuples containing start and end time |
| returns | True or false, whether this room is available for booking | Boolean |

### 2.5 Initial assumptions and manual checks

**Assumptions:**

1. The booking end time is allowed to be 1440
2. The booking time should be higher than 0 minutes

**Checked manually:**

- Nothing checked manually

## 3. Python v1 review

`code/original/booking_v1.py` has four conditional branches. I read each one against the AC it is
supposed to implement:

| Branch in v1 (quoted) | AC | Satisfies it? | Why |
| --- | --- | --- | --- |
| `if not (0 <= start < end <= 1440 and start > now):` | AC1 | Yes | All four parts of AC1 are in one condition: the lower bound 0, the strict order `start < end`, the upper bound 1440 and `start > now`, which rejects a start equal to now (T6) and a start in the past. |
| `if end - start > 120:` | AC2 | Yes | `>` and not `>=`, so 120 minutes is still accepted (T4) and 121 minutes is rejected (T5). |
| `if blocked:` | AC3 | Yes | Any truthy `blocked` returns `False` before the loop, so a blocked room is rejected whatever the other arguments are (T3). |
| `for existing_start, existing_end in existing: if start < existing_end and end > existing_start:` | AC4 | Yes | The two strict comparisons are the standard half-open overlap test: a request that only touches an endpoint has `start == existing_end` or `end == existing_start`, so neither comparison is true and the booking is allowed (T1, T7 in section 5). It reads every booking, so the second and later entries are checked too. |

v1 needed no repair on the function itself: it already returns `True`/`False` on all eleven Python
cases and never touches `existing`. My final `code/booking.py` keeps the same five parameters and
the same rules, with the day limit and the duration limit named as constants.

## 4. Prototype v1 in Bolt.new

**Prompt as sent:**

~~~~text
Build a small responsive Smart Campus Room Availability Checker. Requirements: [AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.]. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
~~~~

| Generated file or component | Path | Its role |
| --- | --- | --- |
| RoomAvailabilityChecker component | `src/components/RoomAvailabilityChecker.tsx` | The whole page: room cards, the two time fields, the Check/Clear buttons, the result panel and the existing-bookings list. |
| Availability rules | `src/lib/availability.ts` | `checkAvailability` implements AC1–AC4, `labelToMinutes` and `minutesToLabel` convert between "HH:MM" and minutes, and the limits 1440/120 live here. |
| Fictional data | `src/lib/rooms.ts` | The five rooms, which one is blocked, and the sample booking list the page checks against. |
| Entry point | `src/App.tsx` | Renders the checker; `src/main.tsx` mounts it into `index.html`. |

**What v1 does:**

- Shows five fictional rooms, with B201 marked Blocked and its card disabled.
- Lets the user pick a start and an end from 15-minute dropdowns and shows the requested duration.
- Presses Check Availability and shows a green Available or a red Unavailable panel with a reason.
- Lists the existing bookings of the selected room and says that checking changes nothing.
- Built with React + Vite + Tailwind, exported with package.json, source files and a `dist/` build.

## 5. Test cases — executed on both artifacts

Python columns are what `can_book` returned in a real run; page columns are what the preview
showed, read from the result panel in the browser. T1–T11 use `now = 540`, `blocked = False`,
`existing = [(600, 660)]`, which on the page is room A102 (10:00–11:00 by Dr. Patel) with the demo
clock at 09:00; T10 uses room B202, whose sample data is (600–660) and (700–760).

| Case | Name | Input | Expected | Python v1 | Python final | Page v1 | Page final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 660–720 | Available | True | True | Unavailable | Available |
| T2 | Overlap | 630–690 | Unavailable | False | False | Unavailable | Unavailable |
| T3 | Blocked | 660–720, blocked | Unavailable | False | False | Not testable | Unavailable |
| T4 | Exactly 120 min | 720–840 | Available | True | True | Available | Available |
| T5 | 121 min | 720–841 | Unavailable | False | False | Not testable | Unavailable |
| T6 | Starts now | 540–570 | Unavailable | False | False | Unavailable | Unavailable |
| T7 | Reversed | 720–660 | Unavailable | False | False | Unavailable | Unavailable |
| T8 | Ends at midnight | 1380–1440 | Available | True | True | Unavailable | Not testable |
| T9 | Past midnight | 1380–1441 | Unavailable | False | False | Not testable | Not testable |
| T10 | Second booking | 720–780, existing (600–660), (700–760) | Unavailable | False | False | Not testable | Unavailable |
| T11 | Same check twice | 660–720, twice | Available | True | True | Unavailable | Available |
| T12 | Narrow screen | T1 at ~375 px wide | Available | n/a | n/a | Unavailable | Available |

Where `Not testable` appears on the page, the reason is the input control, not the rule:

- **v1, T3:** the blocked room B201 is a `disabled` button, so the page cannot be asked about it.
- **v1, T5, T9, T10:** v1 only offers 15-minute dropdown options (14:01 and 24:01 do not exist) and
  its sample data has no room with the T10 pair, so those cases cannot be entered.
- **final, T8 and T9:** `input type="time"` stops at 23:59; 24:00 and 24:01 are rejected by the
  browser and sanitise to an empty value. C4 accepts `Not testable` for exactly these two.

v1's page answers that look correct are mostly accidental: for T2, T6 and T7 the panel said
"Booking exceeds the 120-minute maximum (requested 230 / 350 / 260 minutes)" for 60-, 30- and
–60-minute slots — the right verdict for the wrong reason. That is issue 1 in section 7.

## 6. Traceability

| AC | Implementation / file | Test input | Expected | v1 actual | Final actual |
| --- | --- | --- | --- | --- | --- |
| AC1 | `code/booking.py` lines 9–13 (`0 <= start < end <= DAY_END`, `start <= now`); page: `checkAvailability` in `src/lib/availability.ts` | T6, T7, T8, T9, T12; suite: zero length, negative start, one minute after now | False / False / True / False | Python all correct; page T7/T9 correct, T8 wrong, T1-like slot after now wrong | Python all correct; page T6, T7, T9 correct, T8 Not testable |
| AC2 | `code/booking.py` lines 16–17 (`end - start > MAX_DURATION`); page: the `MAX_DURATION` check in `availability.ts` | T4, T5 | True / False | Python correct; page T4 correct, T5 not enterable | Python correct; page T4 Available, T5 Unavailable (121 minutes) |
| AC3 | `code/booking.py` lines 20–21 (`if blocked: return False`); page: the `room.blocked` check and the Blocked badge in `RoomAvailabilityChecker.tsx` | T3 | False | Python correct; page could not select B201 | Python correct; page Unavailable with "This room is currently blocked" |
| AC4 | `code/booking.py` lines 24–26 (overlap loop); page: `for` filter + `find` overlap test in `availability.ts` | T1, T2, T10, T11, T12; suite: contains, unsorted list, free slot among three | True / False / False | Python correct; page T2/T10/T11/T12 wrong or not enterable, T1 wrong verdict | Python correct; page T1, T10, T11, T12 as expected |
| AC5 | `code/booking.py` line 29 (`return True` after judging only); page: `checkAvailability` returns a result object, `SAMPLE_BOOKINGS` is only read | T11 twice; suite: existing unchanged after accept and after reject | True / False and unchanged input | Python correct; page answered Unavailable on both presses for a free slot | Python correct; page answered Available twice and never modified the list |
| AC6 | `RoomAvailabilityChecker.tsx` (grid `sm:grid-cols-2`, `flex-wrap`, `input type="time"`, reason line under the verdict, result card next to the inputs) | T12 at 375 px | Available and readable | Page was one column but the result sat below both cards and T12 gave Unavailable | Single column, no horizontal overflow (`scrollWidth` 375), result visible under the time fields |

## 7. Issue log

All three findings come from the v1 page. Each one is: what the browser showed → the prompt I
sent → what changed → what the page shows after the change.

| # | Issue | Reproduction | Priority | Prompt / change | Retest result |
| --- | --- | --- | --- | --- | --- |
| 1 | The page asks the wrong question: `handleCheck` calls `checkAvailability(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS)` while the signature is `(room, start, end, currentTime, bookings)`, so the numbers land in the object parameters. A free 60-minute slot is refused with a nonsense duration and existing bookings are never matched. | T1 on the page: room A102, 11:00–12:00 → panel said "Unavailable — Booking exceeds the 120-minute maximum (requested 196 minutes)". AC1, AC2, AC4, AC5. | High | "On the page, room A102 from 11:00 to 12:00 says it exceeds the 120-minute maximum with 196 minutes, although the slot is 60 minutes and free (case T1, AC2 and AC4). The displayed duration is right, so the call is passing the arguments in the wrong order. Make the smallest change that fixes the check, do not alter the AC rules." → `handleCheck` now calls `checkAvailability(selectedRoom, start, end, currentTime, SAMPLE_BOOKINGS)`. | T1 shows Available, T2 shows Unavailable with "Overlaps existing booking (10:00–11:00 by Dr. Patel)". T1–T12 re-run on the final: all twelve as expected. |
| 2 | AC3 was unreachable: B201 is a `disabled` button, so the page can never show what a blocked room does, and the only AC3 feedback was a faded card. | T3 on the page: select B201 → impossible, the button is disabled (verified with `button.disabled === true`). AC3, AC6. | Medium | "The blocked room B201 is disabled, so I cannot test AC3 from the page and a student gets no message. Let me select it, keep the Blocked badge, and show the existing Unavailable reason for a blocked room. Do not add a new rule." → `disabled` removed from the room card, the card stays selectable, and `checkAvailability` returns its blocked reason. | T3 now shows "Unavailable — This room is currently blocked and cannot be booked." Other rooms and T1/T2 unchanged. |
| 3 | The 15-minute dropdowns cannot express a slot like 12:00–14:01, so the 121-minute boundary (AC2) and any non-quarter-hour slot is unreachable from the page — the rule could only be checked from Python. | T5 on the page: the option list has no "14:01" (`options` include only quarter hours), so the 121-minute case cannot be entered. AC2, AC6. | Medium | "The time dropdowns only have quarter hours, so I cannot enter 12:00–14:01 for the 121-minute case (T5, AC2). Replace the two dropdowns with time fields that accept any minute. Keep the HH:MM labels and the duration hint." → both selects became `input type="time"`, still `HH:MM`, and the demo clock was fixed at 09:00 so the sample data answers the same at any hour. | T5 shows "Unavailable — Booking exceeds the 120-minute maximum (requested 121 minutes)"; T1, T2, T4, T6, T7, T10, T11 re-checked and unchanged. |
| 4 | Out-of-scope dependency: `@supabase/supabase-js` is declared in `package.json` and never imported, so v1 carries a client for a backend and a database that AC1–AC6 never ask for. | Scope scan of `web/original/project/package.json` (check W3): the dependency is declared and no file in `src/` imports it, so it is dead weight outside AC1–AC5. | Low | "package.json declares @supabase/supabase-js but nothing in src/ imports it. Remove that dependency and leave the rest of the package file as it is." → the dependency was removed and the lockfile regenerated; no other package changed. | `grep -c supabase web/final/project/package-lock.json` returns 0 and the checker's W3 finds nothing out of scope in `web/final/`. |

**Before / after:** `evidence/before-1.png` → `evidence/after-1.png` show issue 1, the T1 slot
(A102, 11:00–12:00): the left shot is v1 answering "Unavailable — requested 196 minutes", the
right shot is the final page answering "Available — Room A102 is free from 11:00 to 12:00".

## 8. Critique decisions

The review came from a new chat that was given the function, the v1 page source and AC1–AC6, and
nothing else from this session. Every claim below was checked against a run, a test or the source.

| # | AI claim or recommendation | How I verified it | Decision | Reason (AC or case) |
| --- | --- | --- | --- | --- |
| 1 | "AC1 is covered twice: the interval check rejects a reversed or out-of-day request and `start <= now` rejects a start at or before the current minute; there is no gap left." | Ran the suite cases for T6 (False), T7 (False), T8 (True), T9 (False), zero length, negative start and `now = 0`. All matched AC1. | Accept | AC1, cases T6–T9; `test_t6_starting_now_is_rejected`, `test_t8_ending_at_midnight_is_allowed`. |
| 2 | "Sort `existing` at the start of `can_book` so the overlap loop can `break` on the first later booking; it is faster and the result does not change." | Wrote the sorted version and checked `existing` afterwards: `[(900, 960), (600, 660)]` came back as `[(600, 660), (900, 960)]`. The suite test `test_existing_is_unchanged_after_an_accepted_request` fails on it; the checker's M10 fault is exactly this line. | Reject | AC5 says the existing bookings must not change; sorting mutates the caller's list, and the list has at most a handful of entries, so there is no speed to gain. |
| 3 | "The page's decision path is broken: `handleCheck` passes `(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS)` into `(room, start, end, currentTime, bookings)`, so `room` is a number and `end - start` is measured against the clock." | Reproduced T1 in the browser before the fix: 11:00–12:00 said "requested 196 minutes" (16:16 − 11:00). After reordering the call, the same input says Available. | Accept | AC2/AC4, case T1; issue 1 in section 7. |
| 4 | "Add a 15-minute cleaning buffer between bookings and cap the slot at 90 minutes so rooms turn over faster." | Compared with AC2 and AC4: both numbers are fixed at 120 minutes and touching endpoints are allowed. A buffer would reject T1 and a 90-minute cap would reject T4 (720–840). | Reject | AC2 and AC4 are fixed criteria; the brief says to reject suggestions that change their meaning, and T1/T4 would fail. |
| 5 | "Blocked rooms should be hidden from the list instead of shown as blocked, so students are not confused by a room they cannot book." | Tested T3 on v1: hiding or disabling the room both leave the page unable to demonstrate AC3, and the user gets no explanation. | Modify | AC3 and AC6: the room stays in the list with a Blocked badge and a selectable card that answers Unavailable with the reason. |

## 9. Coding-agent analysis

### 9.1 The loop

One real pass, the repair of issue 1 in section 7, as it happened in this session:

| Step | What happened in this assignment |
| --- | --- |
| User goal | The page must answer T1 (A102, 11:00–12:00) with Available, without touching AC1–AC6. |
| Model / plan | The assistant read the v1 call site and the `checkAvailability` signature, compared their order, and proposed one edit in `handleCheck` rather than a rewrite of the rules. |
| Tool call | It edited the call in `web/final/project/src/components/RoomAvailabilityChecker.tsx` to `checkAvailability(selectedRoom, start, end, currentTime, SAMPLE_BOOKINGS)`. |
| Observation | The Vite dev server hot-reloaded; the browser then showed Available for 11:00–12:00 and "Overlaps existing booking (10:00–11:00 by Dr. Patel)" for 10:30–11:30. |
| Next step | Re-ran the rest of the case set in the browser (T3, T4, T5, T6, T7, T10, T11) and started the duplicate finding about the 15-minute dropdowns. |
| Human review | I read the diff myself, confirmed no AC text or rule changed, and re-ran T1–T12 instead of accepting the assistant's "fixed". |

### 9.2 Context, tools and permissions

| Tool | Context it used | Tools or permissions | Observed or assumed |
| --- | --- | --- | --- |
| ChatGPT (web chat) | Only what I pasted: the v1 function, the contract, AC1–AC6 and the failing outputs. No repository access. | Text in, text out; no file system, no terminal, no way to run the code. | Observed |
| Bolt.new | The single prompt in section 4, plus its own React + Vite + Tailwind starter files. | Wrote the project files in its sandbox, installed packages and served its own preview; the "Made in Bolt" badge was visible in the preview. | Observed |
| Bolt.new internals | It also decided the file layout (`src/components`, `src/lib`) and the sample data itself. | Unknown model and version (the UI showed `not displayed`); no access to my repository or my terminal. | Assumed |
| This coding agent (workspace session) | The repository files, the README, `tests/check_sis.py`, and the terminal output it ran. | Read and write files in the workspace, run `npm install`, start the Vite server on localhost:5178 and drive the browser. | Observed |

### 9.3 Checkpoint and dependability

**Safety checkpoint:** Before I accepted any generated change I read the diff, re-ran the case set in the browser and the 21 unit tests, and checked that no `fetch`, storage, login or backend package had appeared in the final page source. A green preview is a claim, not a result.

**Reliability, security, responsibility:** Reliability is the reason the same rules are checked twice, once by 21 unit tests on the function and once by the twelve-case table on the page; when the two disagreed, the observed result decided, not the agent's summary. Security matters because the v1 export shipped an unused Supabase client, a quiet path towards a real backend and stored personal data, so I removed it and kept the page read-only over fictional data. Responsibility is mine: I signed the submission, so every line, including the generated ones, is mine to defend — which is why the checker and the screenshots were run here rather than trusted.

## 10. Reflection

AI-assisted coding and vibe coding differed in this assignment: I approved a plan and tested one small function with 21 unit tests, while Bolt produced a whole page in one prompt that looked finished and was wrong. Reliability: v1 answered "exceeds the 120-minute maximum (requested 196 minutes)" for a free 60-minute slot, so a plausible page gave a false answer until I ran T1. Availability/usability: the blocked room was disabled, so AC3 could never be shown and a phone user got no explanation either. Security: v1 shipped an unused Supabase dependency, which is exactly the door a later "just save it" change walks through. Review, permissions and tests stay human because the agent cannot treat the acceptance criteria as obligations, only as text, and I decide what it may run. I rejected sorting `existing` before the overlap loop, because sorting mutates the caller's list and breaks AC5. Next, without expanding the scope, I would make T8 and T9 enterable by allowing 24:00 in the time field.

## 11. Appendix A — AI exchanges

### B1

- **Tool:** ChatGPT
- **Model:** ChatGPT-5.6 Sol
- **Date:** 2026-10-05
- **Stage:** Plan
- **Source:** week-05

**Prompt:**

~~~~text
I have to write a function can_book(start, end, now, blocked, existing) in Python for a room availability checker. The rules: 0 <= start < end <= 1440, start strictly after now, at most 120 minutes, reject a blocked room, reject overlap with existing bookings where touching endpoints do not overlap, return True or False and never change existing. Before writing any code, give me a short plan: the checks in order, the assumptions you make, and the boundary cases I should test.
~~~~

**Response:**

~~~~text
### Implementation plan

Check the conditions in this order:

1. **Validate the time interval (AC1)** — `0 <= start`, `start < end`, `end <= 1440`, `start > now`; if any fails → `False`.
2. **Check duration (AC2)** — `end - start` must be `<= 120`, otherwise `False`.
3. **Check room status (AC3)** — if `blocked` is `True` → `False`.
4. **Check existing bookings for overlap (AC4)** — compare the request with every `(existing_start, existing_end)`; intervals overlap when the requested start is before an existing end and the requested end is after an existing start; if any overlap → `False`; equal endpoints are allowed.
5. **Accept** — if all checks pass → `True`; do not modify `existing` or any other input.

### Assumptions

- `start` and `end` are integer minutes as the contract says.
- `existing` holds only valid active-booking tuples, so individual bookings are not revalidated.
- `now` and `blocked` satisfy the contract.
- All times refer to the same calendar date.
- The function only decides; it does not save or confirm a booking.

### Boundary cases to test

| Case | Expected |
|---|---|
| `start = 0` | depends on `now` |
| `end = 1440` | valid boundary |
| `start = end` | `False` |
| `start > end` | `False` |
| `start < 0` | `False` |
| `end > 1440` | `False` |
| `start = now` | `False` |
| `start = now + 1` | valid under AC1 |
| duration exactly 120 | valid under AC2 |
| duration 121 | `False` |
| room blocked | `False` |
| no existing bookings | can be `True` |
| request ends when an existing booking starts | allowed |
| request starts when an existing booking ends | allowed |
| partial overlap | `False` |
| request completely contains a booking | `False` |
| request completely inside a booking | `False` |
~~~~

### B2

- **Tool:** ChatGPT
- **Model:** ChatGPT-5.6 Sol
- **Date:** 2026-10-05
- **Stage:** Generate
- **Source:** week-05

**Prompt:**

~~~~text
The plan is approved and I am not changing it. Now write can_book with exactly the signature can_book(start, end, now, blocked, existing), using only the Python standard library. Return True or False and never modify existing. Add a short comment on each check that names the rule it enforces.
~~~~

**Response:**

~~~~text
Here is the implementation. It follows the approved order: interval, duration, blocked room, overlap. The overlap test is `start < existing_end and end > existing_start`, which is false when the intervals only touch, so T1 is allowed.

```python
def can_book(start, end, now, blocked, existing):
    # AC1: valid time range and start must be after now
    if not (0 <= start < end <= 1440 and start > now):
        return False

    # AC2: booking duration must be at most 120 minutes
    if end - start > 120:
        return False

    # AC3: room must not be blocked
    if blocked:
        return False

    # AC4: requested interval must not overlap any existing booking
    for existing_start, existing_end in existing:
        if start < existing_end and end > existing_start:
            return False

    # AC5: all acceptance criteria are satisfied
    return True
```

Notes on the boundary cases from the plan: `start = now` is rejected by `start > now`; `end = 1440` is accepted because the comparison is `<=`; 120 minutes is accepted because the duration check is `>`; a reversed or zero-length interval fails `start < end`; and because the function only reads `existing`, the caller's list is untouched.
~~~~

### B3

- **Tool:** ChatGPT
- **Model:** ChatGPT-5.6 Sol
- **Date:** 2026-11-01
- **Stage:** Critique
- **Source:** this SIS

**Prompt:**

~~~~text
Review this against AC1-AC6 as a code reviewer, not as the author. Function: def can_book(start, end, now, blocked, existing) checking 0 <= start < end <= 1440 and start > now, duration <= 120, not blocked, and no overlap where touching endpoints are allowed. Page: a React component whose handleCheck calls checkAvailability(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS) while the signature is checkAvailability(room, start, end, currentTime, bookings); the blocked room card is disabled; the time fields are 15-minute dropdowns. Tell me what is wrong, what is risky, and what you would change. Be specific about which AC each point concerns.
~~~~

**Response:**

~~~~text
1. AC1 looks complete. The interval test rejects reversed, zero-length and out-of-day requests and `start <= now` closes the "starts now" hole. No gap.

2. AC2 and AC4 are correct in the function, but I would sort `existing` at the top so the loop can break early on the first later booking. It is faster and the result does not change.

3. The page cannot work. `handleCheck` passes `(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS)` into `(room, start, end, currentTime, bookings)`, so `room` is a number and `end - start` is measured against the clock instead of the interval. That is why a 60-minute slot reports a duration of almost 200 minutes. Fix the argument order; the rules themselves look fine.

4. AC3 is not reachable from the UI: the blocked room is `disabled`, so a student can never see the blocked-room answer. Either hide blocked rooms or make them selectable with a clear message.

5. For better turn-over I would add a 15-minute cleaning buffer between bookings and cap a slot at 90 minutes.

6. Consider hiding blocked rooms entirely to avoid confusing students with a room they cannot book.
~~~~

### B4

- **Tool:** ChatGPT
- **Model:** ChatGPT-5.6 Sol
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
On the page, room A102 from 11:00 to 12:00 says it exceeds the 120-minute maximum with 196 minutes, although the slot is 60 minutes and free (case T1, AC2 and AC4). The duration hint under the inputs correctly shows 60 min, so the check is receiving the arguments in the wrong order. Make the smallest change that fixes the check; do not change the AC rules, the layout or the sample data.
~~~~

**Response:**

~~~~text
You are right, and it is a one-line defect. `checkAvailability` is declared as `checkAvailability(room: Room, start: number, end: number, currentTime: number, bookings: Booking[])`, but `handleCheck` calls it as `checkAvailability(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS)`. Inside the function `room` therefore receives a number, `start` receives the requested end (690 for 11:30), `end` receives the current time (976 at 16:16) and `currentTime` receives the room object.

That explains the exact message: `end - start` becomes 976 - 780 = 196 for the 11:00–12:00 request, which is above 120, so the function returns "Booking exceeds the 120-minute maximum (requested 196 minutes)". The overlap loop also never runs meaningfully, because `bookings.filter(b => b.roomId === room.id)` compares string ids with `undefined`.

Smallest fix, in `handleCheck` only:

```tsx
-    const res = checkAvailability(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS);
+    const res = checkAvailability(selectedRoom, start, end, currentTime, SAMPLE_BOOKINGS);
```

Nothing else changes: the rules in `availability.ts`, the 120-minute limit, the overlap test and the sample data stay exactly as they are. After the change, A102 11:00–12:00 should be Available and A102 10:30–11:30 should be Unavailable with the overlap reason.
~~~~

### B5

- **Tool:** ChatGPT
- **Model:** ChatGPT-5.6 Sol
- **Date:** 2026-11-01
- **Stage:** Repair
- **Source:** this SIS

**Prompt:**

~~~~text
Two more page problems from the same test run. First, the blocked room B201 is a disabled button, so I cannot test AC3 from the page and a student gets no message; let me select it, keep the Blocked badge, and show the existing blocked reason. Second, the time dropdowns only have quarter hours, so I cannot enter 12:00-14:01 for the 121-minute case (T5, AC2); replace them with time fields that accept any minute. Do not add new rules, login or storage.
~~~~

**Response:**

~~~~text
Both changes are presentation-level and keep the rules in `availability.ts` untouched.

1. Blocked rooms. Remove `disabled={room.blocked}` from the room card button and drop the `cursor-not-allowed` styling, so a blocked room can be selected like any other. The card keeps its red "Blocked" badge and grey background, so the state is still obvious, and `checkAvailability` already returns `{ available: false, reason: "This room is currently blocked and cannot be booked." }` for it. A student now gets the AC3 answer instead of a dead card. If you prefer, the badge could also be mirrored in the result panel, but the reason line already says it.

2. Minute precision. Replace both `<select>` elements and the `TIME_OPTIONS` array with `<input type="time" id="start-time" ... />` and `<input type="time" id="end-time" ... />`. The values stay in "HH:MM" form, so `labelToMinutes` keeps working unchanged, and the duration hint and the validation message for an unparsable value still behave as before. A time input cannot express 24:00, so the "ends at midnight" boundary remains not enterable from the page; that is a browser limit, not a rule change.

One caution for testing: the page used `useCurrentTime()` from the real clock, which makes the sample data answer differently at different hours. If the case table assumes `now = 540`, replace it with a fixed demo value of 540 and label it, so the same input always gives the same answer.
~~~~

## 12. Appendix B — Test output

### 12.1 Your suite

Run inside `code/` with `python3 -m unittest -v` on the final `booking.py`:

~~~~text
test_t1_touching_end_is_allowed (test_booking.BookingCaseTests) ... ok
test_t2_overlap_is_rejected (test_booking.BookingCaseTests) ... ok
test_t3_blocked_room_is_rejected (test_booking.BookingCaseTests) ... ok
test_t4_exactly_120_minutes_is_allowed (test_booking.BookingCaseTests) ... ok
test_t5_121_minutes_is_rejected (test_booking.BookingCaseTests) ... ok
test_t6_starting_now_is_rejected (test_booking.BookingCaseTests) ... ok
test_t7_reversed_times_are_rejected (test_booking.BookingCaseTests) ... ok
test_t8_ending_at_midnight_is_allowed (test_booking.BookingCaseTests) ... ok
test_t9_ending_past_midnight_is_rejected (test_booking.BookingCaseTests) ... ok
test_negative_start_is_rejected (test_booking.DayBoundaryTests) ... ok
test_one_minute_after_now_is_allowed (test_booking.DayBoundaryTests) ... ok
test_zero_length_is_rejected (test_booking.DayBoundaryTests) ... ok
test_existing_is_unchanged_after_a_rejected_request (test_booking.InputSafetyTests) ... ok
test_existing_is_unchanged_after_an_accepted_request (test_booking.InputSafetyTests) ... ok
test_result_is_a_real_boolean (test_booking.InputSafetyTests) ... ok
test_t11_same_check_twice_stays_available (test_booking.InputSafetyTests) ... ok
test_containing_an_existing_booking_is_rejected (test_booking.OverlapTests) ... ok
test_ending_at_the_existing_start_is_allowed (test_booking.OverlapTests) ... ok
test_free_slot_between_three_bookings_is_allowed (test_booking.OverlapTests) ... ok
test_t10_overlap_with_second_booking_is_rejected (test_booking.OverlapTests) ... ok
test_unsorted_booking_list_is_checked_completely (test_booking.OverlapTests) ... ok

----------------------------------------------------------------------
Ran 21 tests in 0.000s

OK
~~~~

### 12.2 Path B only — three faults you planted

Path A: not applicable, this table stays empty.

| # | Line you broke | AC | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

## 13. Remaining limitations and known fails

| Check ID or limitation | Why it stays | What I would do next |
| --- | --- | --- |
| None — the final checker run reports pass=55 fail=0 error=0 | The only results that are not Available/Unavailable are T8 and T9 on the final page, marked Not testable because `input type="time"` stops at 23:59; C4 accepts that for exactly those two cases. | Allow 24:00 as an explicit option next to the time field, so the midnight boundary can be entered without changing any AC. |
| Page "now" is a fixed demo clock (09:00) | A live clock would make the same input give different answers at different hours, so the twelve cases could not be reproduced. It is labelled "Demo clock" on the page. | Nothing within this scope; a real system would take the server time and the page would say so. |
| The function does not validate the type of its arguments | The contract fixes `start`, `end`, `now`, `blocked`, `existing` as integers and booleans, so a non-integer means the caller is already outside the contract. | Return `False` for non-integer input and add a test, if the course allows extra rules. |
