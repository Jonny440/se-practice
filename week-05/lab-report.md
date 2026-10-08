# Week 05 — Lab report

**Name:** Zhanibek Batyrbekov
**Group:** Mon 17:00-20:00
**Date:** 05.10.2026

Fill in every section. **Do not delete, rename or renumber the headings** — the checker and the
grader find your answers by them. Add rows to any table; never remove its header.

---

## 1. Setup

| | |
| --- | --- |
| Assistant (tool) | ChatGPT |
| **Exact** model name | ChatGPT-5.6 Sol|
| Language and version | Python 3 |
| Path | A |
| My Week 04 declaration for touching bookings | allowed |

<!-- If your Week 04 model said touching bookings are NOT allowed: AC4 now says they are.
     One sentence here on what that changes in your Week 04 diagrams. This is a finding, not a penalty. -->

---

## 2. Task 1 — the plan

**The assistant's plan, pasted unedited:**

```text
### Implementation plan

Check the conditions in this order:

1. **Validate the time interval (AC1)**
   - `0 <= start`
   - `start < end`
   - `end <= 1440`
   - `start > now`
   - If any fails → `False`.

2. **Check duration (AC2)**
   - Calculate `end - start`.
   - It must be `<= 120`.
   - Otherwise → `False`.

3. **Check room status (AC3)**
   - If `blocked` is `True` → `False`.

4. **Check existing bookings for overlap (AC4)**
   - Compare the requested interval with every `(existing_start, existing_end)`.
   - Intervals overlap when the requested start is before an existing end **and** the requested end is after an existing start.
   - If any overlap exists → `False`.
   - Equal endpoints are allowed.

5. **Accept**
   - If all checks pass → `True`.
   - Do not modify `existing` or any other input.

### Assumptions

- `start` and `end` are intended to be integer minutes as specified by the contract.
- `existing` contains only the valid active-booking tuples described by the contract, so individual existing bookings do not need to be revalidated.
- `now` and `blocked` satisfy the stated contract.
- All times refer to the same calendar date.
- The function only makes the booking decision; it does not save or confirm a booking.

### Boundary cases to test

| Case | Expected |
|---|---|
| `start = 0` | Depends on `now`; valid only if `0 > now` |
| `end = 1440` | Valid boundary |
| `start = end` | `False` |
| `start > end` | `False` |
| `start < 0` | `False` |
| `end > 1440` | `False` |
| `start = now` | `False` |
| `start = now + 1` | Valid with respect to AC1 |
| Duration exactly `120` minutes | Valid with respect to AC2 |
| Duration `121` minutes | `False` |
| Room blocked | `False` |
| No existing bookings | Can be `True` if AC1–AC3 pass |
| Requested interval ends exactly when existing starts | Allowed |
| Requested interval starts exactly when existing ends | Allowed |
| Requested interval partially overlaps an existing booking | `False` |
| Requested interval completely contains an existing booking | `False` |
| Requested interval is completely inside an existing booking | `False` |
```

**What the plan invented or changed.** One row for every rule in the plan that is not in the
contract or in AC1–AC5, or that says something different from them. If you found none, write one
row saying which lines of the plan you checked against which AC.

| # | What the plan said | What the contract or the AC says | What I did |
| --- | --- | --- | --- |
| 1 | It listed 5 steps of implementation, all according to AC1-AC5 | AC1-AC5 are done correctly | Did no changes |

**Boundary cases the assistant suggested that I kept as tests:**
| Case | Expected |
|---|---|
| `start = 0` | Depends on `now`; valid only if `0 > now` |
| `end = 1440` | Valid boundary |
| `start = end` | `False` |
| `start > end` | `False` |
| `start < 0` | `False` |
| `end > 1440` | `False` |
| `start = now` | `False` |
| `start = now + 1` | Valid with respect to AC1 |
| Duration exactly `120` minutes | Valid with respect to AC2 |
| Duration `121` minutes | `False` |
| Requested interval ends exactly when existing starts | Allowed |
| Requested interval starts exactly when existing ends | Allowed |
| Requested interval partially overlaps an existing booking | `False` |
| Requested interval completely contains an existing booking | `False` |
| Requested interval is completely inside an existing booking | `False` |

-

---

## 3. Task 2 — the first version (v1), read before it was run

v1 is saved as `code/original/booking_v1.<ext>`, exactly as the assistant returned it: yes

**AC map.** One row per condition in v1. Quote the line.

| # | Line in v1 | AC it implements | Correct as written? If not, why |
| --- | --- | --- | --- |
| 1 | 3 | AC1 | Correct |
| 2 | 7 | AC2 | Not correct, booking duration can be 120 minutes, code allows only 119 |
| 3 | 11 | AC3 | Correct |
| 4 | 15 | AC4 | Correct |

**Anything in v1 that no AC asks for** (extra validation, a buffer between bookings, logging,
saving the booking, a different return type): no such thing

-

---

## 4. Task 3 — my tests

Base input for every row unless the row says otherwise: `now=540, blocked=False, existing=[(600, 660)]`.

| # | Test name | Request (start, end) | What differs from the base input | Expected | AC | Result on v1 | Result on final |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | test_touching_end_is_allowed | (660, 720, EARLY_NOW, False, [(600, 660)]) | touching ends | True | AC4 | True | True |
| 2 | test_touching_start_is_allowed | (540, 600, EARLY_NOW, False, [(600, 660)]) | touchgin start | True | AC4 | True | True |
| 3 | test_overlap_is_rejected | (630, 690, EARLY_NOW, False, [(600, 660)]) | overlap | False | AC4 | False | False |
| 4 | test_request_inside_existing_is_rejected | (620, 640, EARLY_NOW, False, [(600, 660)]) | request inside existing | False | AC4 | False | False |
| 5 | test_existing_inside_request_is_rejected | (600, 700, EARLY_NOW, False, [(620, 660)]) | existing inside the request | False | AC4 | False | False |
| 6 | test_blocked_is_rejected | (660, 720, EARLY_NOW, True, []) | blocked=true | False | AC5 | False | False |
| 7 | test_exactly_two_hours_is_allowed | (720, 840, EARLY_NOW, False, []) | booking exactly 2 hours | True | AC3 | True | True |
| 8 | test_over_two_hours_is_rejected | (720, 841, EARLY_NOW, False, []) | over two hours booking | False | AC3 | False | False |
| 9 | test_starts_now_is_rejected | (540, 570, 540, False, []) | booking starts now | False | AC1 | False | False |
| 10 | test_starts_in_past_is_rejected | (500, 560, 540, False, []) | start in the past | False | AC1 | False | False |
| 11 | test_zero_length_is_rejected | (600, 600, EARLY_NOW, False, []) | zero time booking | False | AC2 | False | False |
| 12 | test_reversed_times_are_rejected |(700, 600, EARLY_NOW, False, []) | reversed time | False | AC2 | False | False |
| 13 | test_empty_existing_allows_booking | (600, 660, EARLY_NOW, False, []) | empty existing | True | AC5 | True | True |
| 14 | test_fits_between_several_bookings_is_allowed | (660, 720, EARLY_NOW, False, existing) | fits between bookings | True | AC2 | True | True |
| 15 | test_overlaps_one_of_several_bookings_is_rejected | (700, 760, EARLY_NOW, False, existing) | overlap | False | AC2 | False | False |
| 16 | test_existing_list_is_not_mutated_on_allow | (660, 720, EARLY_NOW, False, existing) | no changes to input | True | not in AC | True | True |
| 17 | test_existing_list_is_not_mutated_on_reject | (630, 690, EARLY_NOW, False, existing) | no changes to existing list | False | not in AC | False | False |

---

## 5. Task 4 — debugging with evidence

One row per defect you found — in v1, in a later version, or in your own tests. If v1 passed
everything, the row is the **new edge case you added**, with expected and actual equal, and the
cause column says why no change was needed.

| # | Input (the full call) | Expected | Actual | Cause (quote the line) | Fix | Who proposed the fix |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | new edge case you added | input and output change after the function is done | to be sure there is no alteration and we can use it later | | | |

**The debug prompt I sent, and the assistant's answer** (leave the block empty if you did not use it):

```text
```

---

## 6. Task 5 — the critique

**The assistant's critique, pasted unedited:**

```text
There are **no concrete issues** with this implementation when reviewed strictly against the supplied contract and AC1–AC5.

1. **AC1 — satisfied**
   > `if not (0 <= start < end <= 1440 and start > now):`

   Correctly enforces `0 <= start < end <= 1440` and `start > now`.

2. **AC2 — satisfied**
   > `if end - start > 120:`

   Correctly rejects durations greater than 120 minutes while allowing exactly 120 minutes.

3. **AC3 — satisfied**
   > `if blocked:`

   Correctly rejects a booking when the room is blocked.

4. **AC4 — satisfied**
   > `if start < existing_end and end > existing_start:`

   Correctly detects actual overlap while allowing touching endpoints, as required by the interval rule.

5. **AC5 / contract — satisfied**
   > `return True`

   This is reached only when AC1–AC4 hold. The function only reads `existing` and does not modify it.

**Conclusion:** The implementation conforms to the supplied contract and acceptance criteria.
```

| # | Suggestion | accept / reject | Reason — cite the AC or the contract line | Suite after the change |
| --- | --- | --- | --- | --- |
| 1 | Add a new test to check the change of the existing list on the input | accept | AC5 | |
| 2 | Add a new test to check the booking when it ends > 1440 | accept | AC1 |  |

---

## 7. Change log — v1 to final

| # | What changed (the line, before → after) | Why | Evidence: the test or check that moved |
| --- | --- | --- | --- |
| 1 | nothing changed | the code itself is good, only changed the test_booking.py | it failed tests M2 and M10 |

---

## 8. Evidence — real output

### 8.1 My suite, final run

Paste the **complete** terminal output. For Python: everything `python -m unittest -v` printed.

```text
test_blocked_is_rejected (test_booking.BookingTests.test_blocked_is_rejected) ... ok
test_empty_existing_allows_booking (test_booking.BookingTests.test_empty_existing_allows_booking) ... ok
test_exactly_two_hours_is_allowed (test_booking.BookingTests.test_exactly_two_hours_is_allowed) ... ok
test_existing_inside_request_is_rejected (test_booking.BookingTests.test_existing_inside_request_is_rejected) ... ok
test_existing_list_is_not_mutated_on_allow (test_booking.BookingTests.test_existing_list_is_not_mutated_on_allow) ... ok
test_existing_list_is_not_mutated_on_reject (test_booking.BookingTests.test_existing_list_is_not_mutated_on_reject) ... ok
test_fits_between_several_bookings_is_allowed (test_booking.BookingTests.test_fits_between_several_bookings_is_allowed) ... ok
test_over_two_hours_is_rejected (test_booking.BookingTests.test_over_two_hours_is_rejected) ... ok
test_overlap_is_rejected (test_booking.BookingTests.test_overlap_is_rejected) ... ok
test_overlaps_one_of_several_bookings_is_rejected (test_booking.BookingTests.test_overlaps_one_of_several_bookings_is_rejected) ... ok
test_request_inside_existing_is_rejected (test_booking.BookingTests.test_request_inside_existing_is_rejected) ... ok
test_reversed_times_are_rejected (test_booking.BookingTests.test_reversed_times_are_rejected) ... ok
test_starts_in_past_is_rejected (test_booking.BookingTests.test_starts_in_past_is_rejected) ... ok
test_starts_now_is_rejected (test_booking.BookingTests.test_starts_now_is_rejected) ... ok
test_touching_end_is_allowed (test_booking.BookingTests.test_touching_end_is_allowed) ... ok
test_touching_start_is_allowed (test_booking.BookingTests.test_touching_start_is_allowed) ... ok
test_zero_length_is_rejected (test_booking.BookingTests.test_zero_length_is_rejected) ... ok

----------------------------------------------------------------------
Ran 17 tests in 0.000s

OK
```

### 8.2 The checker, final run

Paste the **complete** output of `python tests/check_booking.py`. Paste it **last**: if you edit
this file afterwards, run the checker again and paste again.

```text
Week 05 - can_book: the function, your tests, the evidence   (Path A)

PASS   F1   the six cases from the task table           6 of 6 cases
PASS   F2   AC1 time order and day bounds               5 of 5 cases
PASS   F3   AC1 the start is in the future              5 of 5 cases
PASS   F4   AC2 at most 120 minutes                     3 of 3 cases
PASS   F5   AC3 a blocked room accepts nothing          2 of 2 cases
PASS   F6   AC4 every kind of overlap is rejected       5 of 5 cases
PASS   F7   AC4 touching endpoints are allowed          3 of 3 cases
PASS   F8   AC4 every existing booking is checked       4 of 4 cases
PASS   F9   AC5 the result is a real Boolean            3 of 3 cases
PASS   F10  AC5 the inputs are left unchanged           2 of 2 cases
PASS   O1   the assistant's first version is kept       v1 kept (20 lines)
PASS   S1   your suite has at least 11 tests            18 tests
PASS   S2   your suite is green on your own code        18 tests, OK
PASS   M1   your tests catch a fault in AC1             caught by test_starts_now_is_rejected
PASS   M2   your tests catch a fault in AC1             caught by test_ending_after_day_limit_is_rejected
PASS   M3   your tests catch a fault in AC1             caught by test_zero_length_is_rejected
PASS   M4   your tests catch a fault in AC2             caught by test_exactly_two_hours_is_allowed
PASS   M5   your tests catch a fault in AC3             caught by test_blocked_is_rejected
PASS   M6   your tests catch a fault in AC4             caught by test_fits_between_several_bookings_is_allowed, test_touching_end_is_allowed, test_touching_start_is_allowed
PASS   M7   your tests catch a fault in AC4             caught by test_overlaps_one_of_several_bookings_is_rejected
PASS   M8   your tests catch a fault in AC4             caught by test_existing_inside_request_is_rejected
PASS   M9   your tests catch a fault in AC5             caught by test_existing_list_is_not_mutated_on_allow
PASS   M10  your tests catch a fault in AC5             caught by test_existing_list_is_not_mutated_on_allow
PASS   L1   report 1: tool, model and language          tool, model and language recorded
PASS   L2   report 2: the plan, and what you corrected  plan pasted, 1 row(s) on what you corrected or verified
PASS   L3   report 3: v1 mapped to AC1-AC4              4 conditions mapped, AC1-AC4 all present
PASS   L4   report 4: at least 11 of your tests listed  17 tests listed
PASS   L5   report 5: debugging evidence                1 row(s) of input / expected / actual
PASS   L6   report 6: the critique, each point judged   critique pasted, 2 points judged
PASS   L7   report 7: change log                        1 change-log row(s)
PASS   L8   report 8.1: real output of your suite       suite output pasted
PASS   L9   report 10: conclusion of 120-180 words      145 words
------------------------------------------------------------------------------
v1 (code/original/booking_v1.py): passes F1 F2 F3 F4 F5 F6 F7 F8 F9 F10 - fails nothing - identical to your final: yes
SUMMARY pass=32 fail=0 error=0   (32 checks)
Behaviour and shape are clean. This says nothing about the quality of your review.
Z1@MacBoo
```

### 8.3 Path B only — three faults I planted myself

Break your own function on purpose, one line at a time, run your suite, restore the line.

| # | Line I changed (before → after) | AC it breaks | Test that failed |
| --- | --- | --- | --- |
| 1 | | | |
| 2 | | | |
| 3 | | | |

The three failing runs (Path A students leave this block empty):

```text
```

---

## 9. What still fails, and what the contract does not say

### 9.1 Checks I am keeping as FAIL or ERROR

The same IDs as `known_fails` in `submission.yml`. Write `none` if the run is clean.

| Check | Why it stays |
| --- | --- |
| Everything is good, no fails | The only fail is the last one in report and I am gonna write it last. |

### 9.2 Outside the contract

The contract says times are integers. It does not say what `can_book` does when one is not —
`600.5`, or the string `"600"`. What does **your** function do, and why is that the right call?

My function handles the float values normally, going through the same checks as the integer values. However it fails on string inputs, because there are no str to int input handling.

-

### 9.3 A bound that never decides

One of the bounds written in AC1 can never be the *only* reason a request is rejected. Which one,
and why?

I think it is either start > 0 or start > now, because if the start > 0 fails, the other one fails automatically, if we assume now time is right.

-

---

## 10. Conclusion (120–180 words)

<!-- Answer all three, in your own words, without the assistant:
     (a) Explain the overlap condition in your final code — why those two comparisons, and why
         they let touching bookings through.
     (b) Which fault did your tests miss the longest, and what did the missing test have in common
         with the ones you already had?
     (c) What did you have to decide that neither the contract nor the assistant decided for you?
     Worthless: "the AI made a mistake and I fixed it."
     Worth everything: "F7 failed on can_book(570, 600, ...): v1 compared with <= on the start
     side, so a booking that ends exactly when another begins was rejected." -->

<!-- Write your conclusion below this line -->

When checking for overlap, or AC4 there are two conditions we use. They are start < existing_end and end > existing_start. Here we use > < so there is no hard condition like >= or <=. While checking that if the end and start touch, it immediately goes out of the condition and returns True. 
I had troubles with FAIL's number M2 and M10. I had to proofread the check_booking file and see the problem. First of all, i forgot to add unit test to check the end value has max 1440. The second problem was that the input was sorted before sending, so i added a temp value to hold initial bookings and compared them in the end.
No Fails for F1-F10 occured, so the assistant did a good job on th code. I did not have to change the final version of the booking_v1.py
