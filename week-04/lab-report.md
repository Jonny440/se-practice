# Week 04 — Lab report: Modeling the System with UML

> The single worksheet for this lab. Fill in every section. **Do not delete, rename or renumber
> the headings** — the checker and the grader find your work by them. Replace every `<...>`
> placeholder; a row that still contains `<...>` counts as empty.

---

## 1. Setup

| Field | Value |
| --- | --- |
| Name | Zhanibek Batyrbekov |
| Group | <your group> |
| AI assistant | ChatGPT |
| Exact model | GPT-5.6 Sol |
| Renderer | PlantUML web server |
| Behaviour diagram | <sequence / activity / both> |
| Stories used | the reference set from README §3 |

---

## 2. Prompts as sent

Paste every prompt **exactly as you sent it**, in the order you sent it, one code block each. The
AI's first replies are saved as files in `models/original/` — do not paste them here.

### 2.1 Task 1 — use-case prompt

```text
\# Approved stories — Smart Campus study room booking

\> \*\***Replace this file's stories with your own Week 03 stories, as revised after review**\*\*
\> (\`week-03/requirements/user-stories.md\`), keeping their IDs. If you did not complete Week 03, or
\> your set was rejected in review, keep the reference set below and say so in \`lab-report.md\` §1.
\> Either way, the IDs here are the ones your consistency table (§7) must use.

\*\***Source of this set:**\*\* the reference set

\## Scenario (from the Lesson 04 practice deck, slide 7)

Students view room availability, book a room, and cancel their own bookings. Administrators block
or unblock rooms and review usage.

\- \*\***R1**\*\* Future start, with duration greater than 0 and at most 2 hours.
\- \*\***R2**\*\* Active bookings for the same room cannot overlap.
\- \*\***R3**\*\* A blocked room cannot accept a new booking.
\- \*\***R4**\*\* A successful booking produces a confirmation.

\## Reference set

\| ID | Story | Rules |
\| --- | --- | --- |
\| US-01 | As a student, I want to book a free study room for a time slot, so that I have a place to work, and I get a confirmation when the booking succeeds. | R1, R2, R3, R4 |
\| US-02 | As a student, I want to see which rooms are free at a given time, so that I can choose one before booking. | — |
\| US-03 | As a student, I want to cancel one of my own bookings, so that the room is released for others. | R2 |
\| US-04 | As an administrator, I want to block a room, so that no new bookings can be made for it. | R3 |
\| US-05 | As an administrator, I want to unblock a room, so that students can book it again. | R3 |
\| US-06 | As an administrator, I want to review how rooms are used, so that I can plan capacity. | — |

\*\***Out of scope**\*\* (do not model): payments, equipment in rooms, recurring bookings, waiting lists,
notifications other than the booking confirmation, user registration.


Using the supplied scenario and approved stories, generate PlantUML for a use-case diagram. Include Student and Administrator outside a named system boundary. Model their goals, show justified associations, and list assumptions. Use include or extend only with a clear reason.
```

### 2.2 Task 2 — class prompt

```text
Create a UML domain class diagram in PlantUML for Smart Campus. Start with Student, Room, and Booking. Add attributes, appropriate operations, and association multiplicities. Add other classes only when requirements justify them. Explain each relationship and list assumptions. Avoid unjustified inheritance or composition.
```

### 2.3 Task 3 — behaviour prompt (3A sequence or 3B activity)

```text
Generate a UML activity diagram in PlantUML for Book room. Show the initial node, actions, guarded decisions, and final nodes. Check the time range, blocked-room status, and overlapping bookings. Show confirmation after success and rejection after failure. Use branches rather than parallel paths unless concurrency is required.
```

### 2.4 Focused correction prompts (if you sent any)

```text
There should be only three decisions according to rules: R1, R3, R2. fix only that
```

### 2.5 Critique prompt

```text
Compare my diagrams with the requirements. Identify missing rules, inconsistent names, and unjustified elements. Cite each issue and propose a specific correction.

```

---

## 3. Task 1 — use-case review

**Assumptions the AI listed:**
  1. "Book a free study room" includes checking that the requested slot satisfies R1-R3.
  2. A booking confirmation is produced only after a booking succeeds.
  3. Students may cancel only their own bookings.
  4. Room usage review is an administrator-only goal.
  5. No separate use cases are modeled for payments, equipment, recurring bookings, waiting lists, extra notifications, or registration.
At least **two** findings. A finding names the element, the problem and the rule or story that
proves it is a problem.

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Student → Book a free room → include: Send confirmation | send confirmation is not a user goal, he can not call for it. It is more of a system responce. | R4 | Deleted send confirmation use case, add it to rule notes |
| 2 | include: Send confirmation | Even if send confirmation was an user goal, then include only adds unnecessary complexity. | R4 | Delete it |

---

## 4. Task 2 — class diagram review

### 4.1 Relationships, read both ways

One row per association in your **revised** class diagram.

| Association | Read left → right | Read right → left | Multiplicities |
| --- | --- | --- | --- |
| Student — Booking | one student makes 0..* bookings | each booking belongs to exactly 1 student | 1 / 0..> |
| Room — Booking | one room has 0..* bookings over its lifetime | Each booking is for exactly 1 room | 1 / 0..> |
| Administrator - Room | One administrator manages 0..* rooms | Each room is managed by exactly 1 administrator. | 1 / 0..> |


### 4.2 Constraints the multiplicities cannot show

- R2: Does not have a note, but it uses a method on a class Booking: +overlaps(other: Booking):Boolean
- R1: Does not have a note, not mentioned in the diagram
- R3: Does not have a note, but it uses a blocked parameter (-blocked: Boolean)
- R4: Does not have a note, not mentioned in the diagram

### 4.3 Assumptions

- A1: what happens to existing bookings when a room is blockede
- A2: what happens if a Student tries to cancel someone else's booking
- A3: where the data is stored

### 4.4 Findings

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | Room.blocked | The diagram does not specify what happens with existing bookings when a room is blocked | R2 | Add a note that all new bookings are blockes, while the existing will go as planned |
| 2 | Student.cancelBooking() | The diagram does not specidy what happens when user tries to cancel someone's booking | US-03 | Add a note, that blocking someones booking will end in failure |

---

## 5. Task 3 — behaviour diagram review

**Option chosen and why:** 3B activity — no reason, just blind choosing

**Design components added beyond the domain model:** none
what it does in one line; write "none" for an activity diagram>

| # | Element | Problem | Rule or story | Fix |
| --- | --- | --- | --- | --- |
| 1 | <element> | <problem> | <rule or story> | <fix> |

---

## 6. AI critique

Run the critique prompt once, on all your revised diagrams together. At least **three** rows. A
critique is another claim to evaluate, not a verdict: reject what is wrong and say why.

| # | Issue the AI raised | Element it cited | Verdict | Why |
| --- | --- | --- | --- | --- |
| 1 | R1 is not explicitly checking “future start.” | activity.puml | accept | Truly, i did not check if the user has enetered a valid time range from 0-2 hours. |
| 2 | The confirmation wording is slightly too implementation-specific. | activity.puml | reject | An AI is just confused with wording. |
| 3 | Missing US-02 concept: room availability | class.puml | accept | I treated the blocked and available terms as one, and missed room availability |
| 4 | Missing US-06 concept: review usage | class.puml | accept | administrator class does not have a method to review usage |

---

## 7. Consistency table

One row for each of **R1–R4**, then one row for **every use case in your revised use-case
diagram**, spelled exactly as in the diagram, with the story ID it traces to.

| Requirement / story | Use case | Classes | Behaviour element |
| --- | --- | --- | --- |
| R1 | book a free study room | booking, student | guard: start is in the future and duration is up to 2 hours |
| R2 | book a free study room | booking, room | decision: no active bookings overlap |
| R3 | book a free study room | room, booking | guard: room is not blocked |
| R4 | book a free study room | booking | action: produce booking confirmation |
| US-01 | book room | student, booking, room | action: create booking |
| US-02 | view room availability | student, room, booking | action: show available rooms |
| US-03 | cancel own booking | student, booking | action: cancel booking |
| US-04 | block a room | administrator, room | action: block room |
| US-05 | unblock a room | administrator, room | action: unblock room |
| US-06 | review room usage | administrator, room, booking | action: review room usage |

---

## 8. Change log

At least **three** rows, and at least one for each required diagram (use case, class, your
behaviour diagram). "Before" is what the AI produced; "After" is what you submitted.

| # | Diagram | Before (AI's original) | After (your revision) | Reason |
| --- | --- | --- | --- | --- |
| 1 | Class diagram | not fullfilling all user stories | added new methods | US-06 |
| 2 | Activity diagram | Did not check the time range | first decision made longer | R1 |
| 3 | Use case diagram | Too much text in notes | Deleted all unnecessary  | Personal vision |

---

## 9. Checker output

Paste the complete output of `python tests/check_models.py`, then explain **every FAIL you are
keeping**. The same IDs go in `submission.yml` under `checker.kept_fails`. A FAIL you report and explain costs you nothing. One you hide costs the whole criterion.

```text
Week 04 structural check - shape only, never quality

UC1  PASS  Student and Administrator declared
UC2  PASS  named system boundary: "Smart Campus Study Room Booking System"
UC3  PASS  all actors declared outside the boundary
UC4  PASS  all scenario goals present (6 use cases)
UC5  PASS  no actor is associated with a confirmation use case
UC6  PASS  actor responsibilities match the scenario
UC7  PASS  use cases are goals, not screens or components
UC8  PASS  every include / extend / generalization carries a ' why: comment (or there are none)
UC9  PASS  revised diagram differs from the AI's original
CL1  PASS  Student, Room and Booking present
CL2  PASS  Booking is associated with Student and with Room
CL3  PASS  every association has multiplicities at both ends
CL4  PASS  1 student / 1 room per booking, 0..* bookings per student and per room
CL5  PASS  every inheritance / composition / aggregation carries a ' why: comment (or there are none)
CL6  PASS  only domain concepts in the class diagram
CL7  PASS  attributes needed by R1-R3 are present
CL8  PASS  a note states R2 (no overlapping active bookings)
AC1  PASS  initial and final nodes present
AC2  PASS  separate decisions check R1, R3 and R2 (3 decisions)
AC3  PASS  every branch has a labelled guard
AC4  PASS  no parallel paths
AC5  PASS  confirmation on success, rejection on failure
AC6  PASS  creation comes after all rule checks
FI1  PASS  the AI's original output is kept for every diagram
FI2  PASS  a rendered image for every diagram
LR1  FAIL  §1 not filled: behaviour diagram
LR2  PASS  5 prompts pasted in §2
LR3  PASS  2 use-case findings in §3
LR4  PASS  §4 relationships read both ways, 3 assumption(s) declared
LR5  FAIL  §5 needs at least 1 filled finding
LR6  PASS  4 critique issues with a verdict
LR7  PASS  3 change-log rows covering all three diagrams
CS1  PASS  6 approved stories
CS2  PASS  §7 has no filled row for: R1, R2, R3, R4
CS3  FAIL  use case(s) with no §7 row tracing to an approved story: Block a room, Book a free study room, Cancel own booking, Review room usage, Unblock a room, View room availability

SUMMARY pass=31 fail=4 error=0
```

**FAILs I am keeping, and why:** 
LR1 - did not choose beahivoural diagram, only activity.
LR5 - did not choose behavioural diagram, only activity.
CS3 - did not understand the problem

---

## 10. Conclusion (120–180 words)

The AI got the class diagram wrong the most. It had problems with multiplicatives (it assigned 1..* between Administrator and Room, meaning other administrators can not unblock other administrators room), methods to assign (Room's is available methods, did not have review usage method on administrator), properties. If nobody had watched the class.puml it had, it would have resulted in a handicapped mvp project. Critique prompt found that class diagram had problems: first is no review usage method, second no parameters inside bookaRoom method, i added bookARoom(start:end). 
