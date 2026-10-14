# Week 06 — Lab report

**Name:** Zhanibek Batyrbekov
**Group:** Mon 16:00-19:00
**Date:** 2026-10-13

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Tool | Bolt.new |
| Exact model (as Bolt shows it, or `not displayed`) | Standart |
| Bolt project link (or `not shared`, and why) | https://smart-campus-room-av-1y0l.bolt.host |
| Browser and version | Chrome 151.0.7922.48 |
| If you could not use Bolt.new: the tool you used instead, and why | Claude Code, because it is already on my pc, easy to start |

---

## 2. Task 1 — define before generating

**Two predictions, written BEFORE you send the first prompt.** Where do you expect v1 to go wrong?
Fill the first three columns now; fill the last one after Task 3.

| # | What I expect to go wrong | AC it concerns | Was I right? (after Task 3) |
| --- | --- | --- | --- |
| 1 | Edge cases: 0; 1440 | AC1 |  |
| 2 | Mobile page | AC6 | |

**The initial prompt exactly as I sent it** — the deck's prompt with AC1–AC6 pasted in place of
`[paste AC1–AC6]`, nothing else changed:

```text
Build a small responsive Smart Campus Room Availability Checker. Requirements: [AC1: Accept a candidate interval only when 0 ≤ start < end ≤ 1440 and start is after the supplied current time.
AC2: Reject a booking longer than 120 minutes.
AC3: Reject the request when the selected room is blocked.
AC4: Reject any interval that overlaps an existing booking; touching endpoints are allowed.
AC5: Show a clear Available / Unavailable decision without changing the existing booking data.
AC6: The page remains usable at desktop and narrow/mobile width and gives understandable validation feedback.]. Use fictional sample data only. Keep the implementation simple and within one-page scope. Do not add authentication, backend services, analytics, or unrelated features. After building, briefly list the main files/components you created.
```

---

## 3. Task 2 — prototype v1

v1 export saved in `original/` and screenshot saved as `evidence/v1.png` **before** any cleanup
prompt: yes / no

**Bolt's list of the files/components it created, pasted unedited:**

```text
dist            
package.json        
tsconfig.app.json
eslint.config.js    
postcss.config.js    
tsconfig.json
index.html        
src            
tsconfig.node.json
package-lock.json    
tailwind.config.js    
vite.config.ts
```

**What v1 does — one line per thing that works, or visibly does not:**

Room choosing - each room has its own bookings, blocked criteria.
Check Availability button - the button itself works, it starts the availability algorithm, but the algo itself is wrong.
Blocked criteria - a user cannot book a blocked room
Current time updates correctly
-

**Repair prompt** (only if the first build did not run — the deck allows one, then the result is
v1). Leave empty if you did not need it:

```text
```

---

## 4. Task 3 — the nine cases

Base for every case unless the row says otherwise: **current time 09:00**, room **not blocked**,
the room's **only booking 10:00–11:00**. The Expected column comes from AC1–AC6 — do not change it.
Write each result exactly as **Available**, **Unavailable** or **Not testable** (the page gives you
no way to set up the case). Save each final run as `evidence/final-T<n>.png`.

| # | Case | What you set up and request | Expected | AC | Result on v1 | Result on final | Final screenshot |
| --- | --- | --- | --- | --- | --- | --- | --- |
| T1 | Touching | 11:00–12:00 | Available | AC4 | Unavailable | Available | final-T1.png |
| T2 | Overlap | 10:30–11:30 | Unavailable | AC4 | Unavailable | Unavailable | final-T2.png |
| T3 | Blocked | 11:00–12:00, room blocked | Unavailable | AC3 | Unavailable | Unavailable | final-T3.png |
| T4 | Exactly 2 hours | 12:00–14:00 | Available | AC2 | Available | Available  | final-T4.png |
| T5 | Over 2 hours | 12:00–14:01 | Unavailable | AC2 | Available | Unavailable | final-T5.png |
| T6 | Starts now | 09:00–09:30 (current time 09:00) | Unavailable | AC1 | Not testable | Unavailable | final-T6.png |
| T7 | Reversed times | 12:00–11:00, and the page says why | Unavailable | AC1, AC6 | Unavailable | Unavailable | final-T7.png |
| T8 | Same check twice | T1, then T1 again without reloading | Available | AC5 | Available | Available | final-T8.png |
| T9 | Narrow screen | T1 at about 375 px wide | Available | AC6 | Available | Available | final-T9.png |

---

## 5. Issue log — cleanup targets

One row per issue you chose to act on (or deliberately not act on). At least **two**: one
functional and one usability or code-quality issue when you have them. If v1 passed every case,
log a justified cleanup that preserves behaviour. Save a screenshot of each as
`evidence/issue-<n>.png`.

| # | Issue | Evidence: steps → expected → observed | Priority | Decision |
| --- | --- | --- | --- | --- |
| 1 | Duration of the book is not calculated correctly | start_time=11:00, end_time=13:00 -> 120 minutes -> 164 minutes | High | Fix |
| 2 | Invalid problem popup | start_time=15:45, end_time=16:45 -> Unavailable: already booked -> Unavailable: invalid time interval | Medium | Fix |
| 3 | Choosing time slot | You can choose only from given time by 15 minutes, not 15:59 | Low | Reject |
| 4 | Choosing current time | Current time automatically updates, for testing i want to change it | Low | Reject |

---

## 6. Task 4 — cleanup with focused prompts

One issue per prompt. Paste every prompt **as sent** (every `[bracketed field]` and `AC#` filled
in) and Bolt's answer, unedited.

**Functional fix prompt, as sent, and Bolt's answer:**

```text
In the current prototype, start_time=11:00, end_time=13:00 produces 164 minutes , but AC2 requires 120 minutes. Make the smallest change that fixes this behavior. Preserve the other acceptance criteria. Explain which file/component you changed and why.

626f6c742d63632d6167656e74Let me look at the duration calculation in the component.Let me check the availability logic too.Found it. The bug is an argument-order mismatch between the function signature and its call site.

The `checkAvailability` function signature expects `(room, start, end, currentTime, bookings)`, but the call in `handleCheck` passes `(start, end, currentTime, selectedRoom, SAMPLE_BOOKINGS)` — `selectedRoom` lands in the `currentTime` parameter and the actual `currentTime` value lands in the `end` parameter. So `end - start` inside the function computes `currentTime - actualEnd` instead of `actualEnd - actualStart`. With a current time around 15:44 (944 min) and end=13:00 (780 min), that produces 944 - 780 = 164 minutes.Build passes.

**What changed and why:** In `RoomAvailabilityChecker.tsx`, the call to `checkAvailability` had its arguments in the wrong order — it was passing `start, end, currentTime, selectedRoom, ...` but the function expects `room, start, end, currentTime, ...`. This meant the room object landed in the `currentTime` parameter and the real current-time value landed in the `end` parameter, so the duration calculation inside the function computed `currentTime - end` (e.g. ~15:44 minus 13:00 = 164 min) instead of the true `end - start` (120 min). Reordering the arguments to match the signature fixes the behavior while leaving all other acceptance criteria intact.
```

**Cleanup prompt, as sent, and Bolt's answer:**

```text
Review only current time, start_time and end_time for unnecessary duplication, confusing naming, or UI feedback problems. Suggest one small cleanup. Do not add features or redesign the whole application. Implement it only if it preserves AC1–AC6. I want to be able to choose any time i mentioned by writing it

626f6c742d63632d6167656e74Let me re-read the current component to review the time-related code.Here's my review of the time-related code:

**Issue found:** The start and end time fields use `<select>` dropdowns restricted to 15-minute increments (00:00, 00:15, 00:30, ...). This means you can't type a time like 11:00 or 13:00 directly — you can only pick from the pre-built list. The `TIME_OPTIONS` array (97 entries generated at module load) exists solely to populate these dropdowns, which is unnecessary duplication when a native time input handles validation for free.

**Cleanup:** Replace both dropdowns with `<input type="time">` fields. This lets you type any time directly, removes the `TIME_OPTIONS` constant and the `MINUTES_PER_DAY` import that only fed it, and the native input still produces "HH:MM" values that `labelToMinutes` already parses. All acceptance criteria are preserved — validation, the 120-minute cap, overlap checks, blocked rooms, and mobile/desktop usability all work identically.Build passes. 

**What changed:** I replaced the two time dropdowns (which were locked to 15-minute increments) with native time input fields. You can now type any time directly — like 11:00 or 13:00 — instead of picking from a fixed list. The `TIME_OPTIONS` array that existed only to populate those dropdowns was removed, along with the `MINUTES_PER_DAY` import that only fed it. The existing validation in `labelToMinutes` and `checkAvailability` still catches invalid times, durations over 120 minutes, overlaps, and blocked rooms exactly as before.
```

Add further blocks for further prompts.

**Every change or suggestion Bolt made, judged.** Accepting is a decision; so is rejecting. Cite
the AC (or the scope) that justifies it.

| # | What Bolt changed or suggested | accept / reject | Reason — cite the AC or the scope | Retest: which cases, result |
| --- | --- | --- | --- | --- |
| 1 | Fixed the can_book function | accept | AC1-AC5 | AC1-AC5, all of them are now produce expected result |
| 2 | Changed start_time and end time choosing from dropdown menu to input text box | accept | UX | Better UX |

---

## 7. Change log — v1 to final

Two to four concrete changes, each one retested.

| # | Issue | Decision | Change (file or component) | Result after retest |
| --- | --- | --- | --- | --- |
| 1 | can_book function not working properly | fix the attributes | bolt changed the order of the attributes, like: start_time, end_time, existing | Expected result |
| 2 | Time is chosen through dropdown menu | Fix | Change it to input type text box | Better UX |

---

## 8. One generated component, in my own words

Pick one file or component Bolt generated that matters for AC1–AC5 — the one that decides
availability is the best choice. Name its path in backticks, then explain in your own words, without
the assistant, what it does and how it decides. 60 words or more.

**File:** `(write here, e.g. src/App.tsx)` project/src/components/RoomAvailabilityChecker.tsx

<!-- Write your explanation below this line -->
This file is showing our whole page. It downloads availability.ts as a lib and sends what user inputed into this file. Availability.ts checks each AC and if it fails, sends the unavailable with a appropriate warning message. And since our UI input are in format HH:MM there are also 2 helper functions to turn them into minutes after midnight and vice versa. If all AC1-AC4 are passed correctly then AC5 sends the available text, which is processed by a typescript component page.
---

## 9. What still fails, and what the criteria do not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| none | none |

### 9.2 The end of the day

AC1 allows `end ≤ 1440` — a booking may end at 24:00. Can a user of your final page ask for
23:00–24:00? How — and if not, why is that acceptable or not? (This is the value you declare in
`submission.yml` under `assumptions.end_of_day`.)

No, the maximum time is allowed is 23:59, this is not acceptible, we should send one more focused prompt to allow that
-

### 9.3 Which "now"?

AC1 says "after the supplied current time". What did **v1** use as the current time, and what did
that mean for testing case T6?

At first it automatically update to real current time. I fixed it for testing, and now you can choose the current time.
-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Which of your two predictions in section 2 was right, and what did v1 actually get wrong?
     (b) Which AI suggestion did you reject, or would have been wrong to accept, and why?
     (c) What is the difference between "the prototype looks finished" and "the prototype meets
         AC1-AC6" - shown with one case from section 4?
     Worthless: "Bolt made some mistakes and I fixed them."
     Worth everything: "T8 failed on v1: the Check button also added the booking to the list, so
     checking 11:00-12:00 a second time said Unavailable. AC5 says the check must not change the
     booking data." -->

<!-- Write your conclusion below this line -->
I predicted it would be hard for assistant to work with edge cases (0, 1440), and in the end it really brought troubles. Page can not handle the end time to be 1440. After that, the AI did not give any suggestions, because I only asked for focused changes, and cleanups. The main difference between the projec looks finished and it meets all criteria is unit testing. QA engineer should take to account all possible inputs the user can come up with and give the proper warning to help user. In the V1 almost 50% percent of the Testcases went wrong, these are: T1, T5, T6. And some other tests like T4 and T3 gave the expected result, however they were wrong too. With different inputs they gave wrong output. It happened because the webpage did the order of the function attributes wrong and after my focused prompt everything was ok.
