# Lab report — Practice #03, Requirements Engineering with AI

Fill in every section. **Do not delete or renumber the headings** — the README points at them and a
missing heading reads as a missing section.

Name: Zhanibek Batyrbekov
Student ID: 24B031689
GitHub username: Jonny440

---

## 1. Setup

| | |
| --- | --- |
| AI assistant (tool) | | Claude
| Exact model name and version | | Sonnet 5 Medium
| Date of the session | | 28.09.2026
| Diagram renderer used | | PlantUML

One tool and one model for all three prompts. If you switched, say why here — it changes what your
findings mean.

---

## 2. Original AI output — user stories (Part 1)

Paste the **unedited** response to Prompt 1. Do not tidy it. If it is long, paste all of it anyway;
this is the baseline everything else is measured against.

```
# Smart Campus — Study Room Booking: Goals and User Stories

## 1. Actor Goals

**Student goals**
- G-S1: Know which study rooms are free at a given time before making a commitment.
- G-S2: Secure a room for a specific time slot for individual or group study.
- G-S3: Release a room they no longer need so they are not held to it.
- G-S4: Receive confirmation that a booking or cancellation actually took effect.

**Administrator goals**
- G-A1: Take a room out of service and restore it, so unusable rooms are not booked.
- G-A2: Understand how rooms are being used over a period, to make informed staffing and capacity decisions.

---

## 2. User Stories

**US-01 — View availability**
- **As a** Student, **I want** to view which study rooms are free and when, **so that** I can pick a room and time slot that actually works for me.
- **Priority:** High
- **Assumption:** Availability reflects current bookings and blocked rooms at the moment the student views it.

**US-02 — Book a room**
- **As a** Student, **I want** to book a free room for a time slot, **so that** I have a guaranteed place to study.
- **Priority:** High
- **Assumption:** The student may hold only bookings that satisfy R1–R4; the system rejects any request that violates them.

**US-03 — Booking boundary and duration rules**
- **As a** Student, **I want** the system to accept a booking that ends exactly when another begins and one that lasts exactly two hours, **so that** I can use the full allowed slot without being wrongly rejected.
- **Priority:** Medium
- **Assumption:** Per the settled interpretation, back-to-back bookings are not an overlap under R3, and exactly two hours is allowed under R2.

**US-04 — Cancel a booking**
- **As a** Student, **I want** to cancel a reservation I made, **so that** the room is released for others and I am no longer committed to it.
- **Priority:** High
- **Assumption:** A student can cancel only a booking they themselves made.

**US-05 — Receive confirmation**
- **As a** Student, **I want** to receive a confirmation when I book or cancel, **so that** I know the action succeeded and can rely on it.
- **Priority:** Medium
- **Assumption:** Confirmation is limited to booking and cancellation outcomes (UC-06); no reminders or other notifications are sent.

**US-06 — Block a room**
- **As an** Administrator, **I want** to block a room from booking, **so that** it is not reserved while it is out of service.
- **Priority:** High
- **Assumption:** Blocking takes effect immediately, and any attempt to book a blocked room is rejected under R4.

**US-07 — Unblock a room**
- **As an** Administrator, **I want** to unblock a room, **so that** students can book it again once it is back in service.
- **Priority:** High
- **Assumption:** Unblocking does not alter or restore any bookings that were cancelled or prevented while the room was blocked.

**US-08 — Review usage**
- **As an** Administrator, **I want** to review how rooms have been used over a period, **so that** I can see demand patterns and decide how rooms should be managed.
- **Priority:** Medium
- **Assumption:** Usage review is based on recorded bookings and blocked periods within the selected period; it does not include check-in or attendance data.

---

## 3. Coverage Check

| Function | Covered by |
| --- | --- |
| UC-01 View availability | US-01 |
| UC-02 Book room | US-02, US-03 |
| UC-03 Cancel booking | US-04 |
| UC-04 Block or unblock room | US-06, US-07 |
| UC-05 Review usage | US-08 |
| UC-06 Send confirmation | US-05 |

All six functions are covered, both actors have goals, and every story stays inside the supplied scope.
```

---

## 3. Story review (Part 2)

One row per change you made. "Kept unchanged" is a valid row and needs a reason too.

| Story (as generated) | What I did | Why | Final ID |
| --- | --- | --- | --- |
| US-01 — View availability | Kept unchanged | the role, reason, outcome are all valid, testable | US-01|
| US-02 - Book a room | Kept unchanged | role, outcome, reason are valid and testable | US-02 |
| US-03 — Booking boundary and duration rules | Removed | it sounds more of an acceptacne criteria, rather than user story | US-02 |
| US-04 - Cancel a booking| Kept unchanged | clear role, reason, outcome, can be tested | US-03 |
| US-05 - Recieve confirmation | Ketp unchanged | clear role, reason, outcome and testable | US-04 |
| US-06 - Block a room| Merged with US-07 | all the goals in two stories are same, only one action is different and can be described in one user story | US-05 |
| US-07 - Unblock a room| Merged with US-06 | all the goals in two stories are same, only one action is different and can be described in one user story  | US-05 |
| US-08 - Review usage| Kept unchanged | it has clear administrator role, outcome and reason | US-06 |

**Did the assistant invent anything outside the scenario?** Name it against the out-of-scope list in
README section 1, or write "no, and here is how I checked".
nothigg was invented outside the scenario.

**How many stories did you end with, and why that number?**
6 stories. All of the outcome stores were made shorter, merged together to avoid duplicates and describe them without any unneccesary information.
---

## 4. Original AI output — acceptance criteria (Part 3)

```
# Acceptance Criteria

## Assumptions

- **A1 (R1):** A booking is "in the future" if its start time is later than the current system time. Bookings starting now or earlier are rejected.
- **A2 (R2):** The maximum duration is 2 hours. A booking of exactly 2 hours is valid, and the end time must be after the start time.
- **A3 (R3):** Two bookings for the same room overlap if their time ranges intersect. Back-to-back bookings (one ends when the next starts) do not overlap. Cancelled bookings do not count.
- **A4 (R4):** A blocked room cannot be booked during its blocked period. Blocks are set by staff outside these stories.
- **A5:** Students are authenticated, and all times use one campus time zone.
- **A6:** Only bookings that have not yet started can be cancelled.
- **A7:** The system checks validity again at submission time, not only when the student views availability.

---

## US-01: View free rooms and times

1. **Successful view**
   **Given** I am logged in and some rooms have existing bookings,
   **When** I choose a date and time range,
   **Then** the system lists only the rooms that are free for the entire range.

2. **Blocked rooms**
   **Given** a room is blocked during the time range I selected,
   **When** I view availability,
   **Then** that room is not shown as available for that period.

3. **Validation: past times**
   **Given** I select a date or time range that has already started or passed,
   **When** I request availability,
   **Then** no bookable slots are offered and I see a message that only future times can be booked.

4. **Alternative: nothing free**
   **Given** every room is booked or blocked for my selected range,
   **When** I view availability,
   **Then** I see a "no rooms available" message and can adjust the date or time.

5. **Current data**
   **Given** another student has just booked or cancelled a room,
   **When** I refresh or reload availability,
   **Then** the list reflects that change.

---

## US-02: Book a free room

1. **Successful booking**
   **Given** a room is free and not blocked for a future slot of 2 hours or less,
   **When** I submit the booking,
   **Then** the booking is confirmed, appears in my bookings, and the room shows as unavailable for that slot.

2. **Validation: future only (R1)**
   **Given** the requested start time is now or in the past,
   **When** I submit the booking,
   **Then** it is rejected with a message that bookings must be in the future, and nothing is created.

3. **Validation: maximum duration (R2)**
   **Given** the requested duration is more than 2 hours, or the end time is not after the start time,
   **When** I submit the booking,
   **Then** it is rejected with a message stating the 2-hour limit, and nothing is created. A booking of exactly 2 hours is accepted.

4. **Error: overlap (R3)**
   **Given** the room already has an active booking that overlaps my requested slot, including one made a moment earlier by another student,
   **When** I submit the booking,
   **Then** it is rejected with a message that the slot is no longer available, and only one of the competing bookings exists.

5. **Error: blocked room (R4)**
   **Given** the room is blocked during my requested slot,
   **When** I submit the booking,
   **Then** it is rejected with a message that the room is unavailable, and nothing is created.

---

## US-03: Cancel a reservation

1. **Successful cancellation**
   **Given** I made a booking that has not yet started,
   **When** I cancel it and confirm,
   **Then** the booking is marked cancelled, removed from my active bookings, and the slot shows as free in availability.

2. **Validation: ownership**
   **Given** a booking was made by another student,
   **When** I try to cancel it, for example by using its ID directly,
   **Then** the request is rejected with a "not permitted" message and the booking is unchanged.

3. **Validation: already started or ended**
   **Given** my booking has already started or ended,
   **When** I try to cancel it,
   **Then** the request is rejected with a message that only upcoming bookings can be cancelled.

4. **Alternative: already cancelled**
   **Given** my booking was already cancelled, for example from a second tab or a repeated click,
   **When** I try to cancel it again,
   **Then** I see a message that it is already cancelled, and no other bookings are affected.

5. **Alternative: change of mind**
   **Given** I select cancel on my booking and a confirmation prompt appears,
   **When** I decline the prompt,
   **Then** the booking stays active and unchanged.
```

---

## 5. Criteria review (Part 3)

| Criterion (as generated) | Problem | What I changed it to | Final ID |
| --- | --- | --- | --- |
| US-01 AC-01 — Successful view | Kept, but simplified the wording to avoid unnecessary login/authentication details. Authentication is outside the supplied scope. | Given rooms have existing bookings or blocked periods, when the Student views availability for a future time range, then only rooms free and not blocked for the entire range are shown. | AC-01 |
| US-01 AC-02 — Blocked rooms | Kept unchanged in substance because it correctly covers R4 during availability viewing. | Given a room is blocked during the selected time range, when the Student views availability, then that room is not shown as available. | AC-02 |
| US-01 AC-03 — Past times | Removed from the final set. It is useful validation, but three criteria were sufficient for US-01 and the case is primarily relevant when creating a booking under R1. | Covered by the booking validation criterion for future start times. | — |
| US-01 AC-04 — Nothing free | Kept, with minor wording simplification. | Given all rooms are booked or blocked for the selected range, when the Student views availability, then the system indicates that no rooms are available. | AC-03 |
| US-01 AC-05 — Current data | Removed because refreshing/reloading is an implementation-oriented detail and was not required by the supplied scenario. | — | — |
| US-02 AC-01 — Successful booking | Kept and simplified. | Given a room is free and not blocked for a future slot of two hours or less, when the Student submits the booking, then the booking is created and the room becomes unavailable for that slot. | AC-04 |
| US-02 AC-02 — Future only | Kept as a validation case for R1. | Given the requested booking starts now or in the past, when the Student submits it, then the booking is rejected and no booking is created. | AC-05 |
| US-02 AC-03 — Maximum duration | Merged with the future-start validation to keep the number of criteria within the required range. | Given the requested booking starts now or in the past, or lasts longer than two hours, when the Student submits it, then the booking is rejected and no booking is created. | AC-05 |
| US-02 AC-04 — Overlap | Kept and combined with the blocked-room validation because both are booking rejection cases. | Given another active booking overlaps the requested slot, or the room is blocked during that slot, when the Student submits the booking, then the booking is rejected and no booking is created. | AC-06 |
| US-02 AC-05 — Blocked room | Combined with the overlap case for the same reason as above. | Covered together with the R3 overlap validation in AC-06. | AC-06 |
| US-03 AC-01 — Successful cancellation | Kept with minor simplification. | Given the Student has a booking that has not yet started, when the Student cancels it, then the booking is cancelled and the room becomes available. | AC-07 |
| US-03 AC-02 — Ownership | Kept because it provides an important validation case for cancellation. | Given a booking was made by another Student, when the Student attempts to cancel it, then the cancellation is rejected and the booking remains unchanged. | AC-08 |
| US-03 AC-03 — Already started or ended | Kept because it provides an important boundary case for cancellation. | Given the Student's booking has already started or ended, when the Student attempts to cancel it, then the cancellation is rejected and the booking remains unchanged. | AC-09 |
| US-03 AC-04 — Already cancelled | Removed because it was not required by the supplied scenario and would add another edge case beyond the required set. | — | — |
| US-03 AC-05 — Declining cancellation | Removed because it describes a confirmation prompt, which introduces a UI detail not specified by the scenario. | — | — |

**The two open questions.**

| Question | My decision | Why |
| --- | --- | --- |
| A booking ending exactly when another begins — overlap under R3? | **Allowed / not an overlap** | Back-to-back bookings do not share an interval of time, so a booking ending exactly when another begins does not overlap the other booking. |
| Is exactly two hours allowed under R2? | **Allowed** | R2 says a booking lasts **at most two hours**, so exactly two hours is within the limit. |

**Which invalid or boundary case did the assistant leave out?**

The generated criteria did not explicitly test the **back-to-back booking boundary**: a booking ending exactly when another booking begins. Since this was one of the two open questions in the scenario, it should be recognized as a boundary case even though the final criteria do not need to add another criterion. The decision is documented in the assumptions above.

---

## 6. Original AI output — use-case diagram (Part 4)

```
@startuml
left to right direction
skinparam packageStyle rectangle

actor Student
actor Administrator

rectangle "Smart Campus Study Room Booking System" {
  usecase "View availability" as UC_View
  usecase "Book room" as UC_Book
  usecase "Cancel booking" as UC_Cancel
  usecase "Block or unblock room" as UC_Block
  usecase "Review usage" as UC_Usage
  usecase "Send confirmation" as UC_Confirm

  UC_Book .> UC_Confirm : <<include>>
}

Student -- UC_View
Student -- UC_Book
Student -- UC_Cancel

Administrator -- UC_Block
Administrator -- UC_Usage
@enduml
```

Rendered diagram (image, or a link):

---

## 7. Diagram review (Part 4)

| Element | Problem | What I changed |
| --- | --- | --- |
| UC_Confirm — Send confirmation | The diagram models Send confirmation as an included use case of Book room, but confirmation is a system consequence rather than an action independently triggered by the Student. Also, cancellation can result in a confirmation according to US-04, so connecting it only to Book room is incomplete. | Kept UC-06 as a use case required by the scenario, but removed the <<include>> relationship from UC-02 Book room. The final diagram does not assign an actor association to UC-06 because no actor directly triggers the sending of the confirmation. |

**Associations.** Which actor–use-case links did the assistant draw that a person does not actually
trigger? Name them.
The assistant did not draw a direct actor association to UC-06. However, it incorrectly modeled UC-06 Send confirmation as an <<include>> of UC-02 Book room. Sending the confirmation is a system consequence of the booking or cancellation rather than a separate action directly triggered by an actor.
**Did any screen, database or internal component appear as a use case or an actor?**
No. The diagram contains only the two specified actors, Student and Administrator, and the six specified use cases. No screen, database, API, server

---

## 8. Traceability (Part 5)

Summarise what the table in `requirements/traceability.md` shows:

- Use cases with **no story** behind them:
- Stories with **no use case** they belong to:
- Criteria that test **no rule** from section 1:

**What does the largest gap tell you about the generated requirements?**

---

## 9. Checker runs

Paste the **real terminal output** of both runs. A table with nothing behind it does not count.

```
$ python tests/check_requirements.py
FAIL   US-1  user-stories.md         2 TODO placeholder(s) left in the file
PASS   US-2  user-stories.md         6 stories, IDs US-01…US-06
PASS   US-3  user-stories.md         every story has the required sentence shape
PASS   US-4  user-stories.md         every story has a priority
PASS   US-5  user-stories.md         every story declares an assumption
PASS   US-6  user-stories.md         only Student and Administrator appear as roles
FAIL   US-7  user-stories.md         out-of-scope vocabulary: attendance, check-in, reminder — either the assistant widened the scenario, or say why in lab-report.md
FAIL   AC-1  acceptance-criteria.md  5 TODO placeholder(s) left in the file
FAIL   AC-2  acceptance-criteria.md  0 story sections found, the task fixes this at 3
FAIL   AC-3  acceptance-criteria.md  no criteria found
PASS   AC-4  acceptance-criteria.md  all 9 criteria are complete Given/When/Then
FAIL   AC-5  acceptance-criteria.md  no story sections to check
PASS   AC-6  acceptance-criteria.md  30 assumptions listed before the criteria
PASS   AC-7  acceptance-criteria.md  both open questions are settled in the assumptions
FAIL   PU-1  use-cases.puml          2 TODO placeholder(s) left in the file
PASS   PU-2  use-cases.puml          exactly two actors: Student, Administrator
PASS   PU-3  use-cases.puml          all six use cases present
PASS   PU-4  use-cases.puml          system boundary present
PASS   PU-5  use-cases.puml          no screens, databases or internal components
PASS   PU-6  use-cases.puml          no unjustified actor associations found
PASS   TR-1  traceability.md         all six use cases have a row
PASS   TR-2  traceability.md         every ID in the table resolves
PASS   TR-3  traceability.md         every story appears in the table
------------------------------------------------------------------------
16 PASS · 7 FAIL · 0 ERROR   (23 checks)
Every FAIL goes in lab-report.md section 9 with what you decided about it.
A FAIL you report and explain costs you nothing. One you hide costs the criterion.
```

```
$ python tests/validate_submission.py
submission.yml — submission.yml
------------------------------------------------------------------------
PASS   schema                                    1
PASS   week                                      03
PASS   student.name                              Zhanibek Batyrbekov
PASS   student.student_id                        24B031689
PASS   student.github                            Jonny440
PASS   assistant.tool                            Claude
PASS   assistant.model                           Sonnet 5 Medium
PASS   counts.user_stories                       6
PASS   counts.acceptance_criteria_sets           3
PASS   checker                                   16 PASS · 7 FAIL · 0 ERROR
PASS   checker.commit                            9aa7f77
PASS   assumptions.overlap_touching_bookings     allowed
PASS   assumptions.exactly_two_hours             allowed
PASS   traceability.use_cases_not_covered        []
PASS   traceability.stories_not_traced           []
PASS   traceability                              US-03
PASS   review_findings                           3 findings
PASS   review_findings[1]                        US-03 was removed as a separate story because its boundary a…
PASS   review_findings[2]                        US-06 and US-07 were merged into US-05 because UC-04 is a si…
PASS   review_findings[3]                        UC-06 Send confirmation was incorrectly modeled as an <<incl…
PASS   honesty.can_explain_everything_submitted  yes
PASS   honesty.ai_usage_disclosed                yes
------------------------------------------------------------------------
22 PASS · 0 FAIL · 0 ERROR · 0 note
Shape is fine. This says nothing about whether the work is good.```

| | PASS | FAIL | ERROR |
| --- | --- | --- | --- |
| `check_requirements.py` | user-stories.md | FAIL | "todo" are present in task, that is why they fail. I dont want to delete them |
| `check_requirements.py` | user-stories.md | FAIL | I did not understand the fail requirement, dont know what is happening |
| `check_requirements.py` | acceptance-criteria.md | FAIL | todo" are present in task, that is why they fail. I dont want to delete them |
| `check_requirements.py` | acceptance-criteria.md | FAIL | 0 story sections found, the task fixes this at 3 |
| `check_requirements.py` | acceptance-criteria.md | FAIL | did not find criteria |
| `check_requirements.py` | acceptance-criteria.md | FAIL | no story sections to check |
| `check_requirements.py` | use-cases.puml  | FAIL | todo" are present in task, that is why they fail. I dont want to delete them |


Commit these numbers were produced at (`git rev-parse --short HEAD`):

**Every FAIL, one line each: what it is and what you decided to do about it.** A FAIL you report and
explain costs you nothing.

**Did you run the checks by hand instead of with Python?** No

---

## 10. Conclusion (150–200 words)

Answer all three:

1. Which part of the generated requirements was most wrong, and how would you have caught it without
   a checker?
2. What did the assistant get right that would have taken you noticeably longer by hand?
3. You are handing these requirements to someone who will implement them, and you will not be in the
   room. Which single one would you rewrite first, and why?

Be specific. "The AI was useful" is worth nothing; "UC-06 had no story behind it until I wrote
US-07, and the checker is what told me" is worth everything.
