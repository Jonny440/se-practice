# Week 09 — Lab Report: canBook as a Tool

Fill in every section. Do not delete or renumber the headings: the README and the checker point at
them. Replace every `<!-- comment -->` with your own text (comments are ignored by the checker).

**Name:** Zhanibek Batyrbekov
**Student ID:** 24B031689
**GitHub:** Jonny440

---

## 1. Setup

| | |
| --- | --- |
| Assistant (frozen for the whole lab) | DeepSeek |
| Exact model (or "not displayed") | DeepSeek V4.1 Flash |
| Three fresh chats for R1, R2, R3? (yes / no) | yes |
| Python version (`python --version`) | Python 3.9.6 |

## 2. Your tool definition — a reason for every constraint

Paste your final `tool/check_room.json`, then fill the table: one row per constraint you wrote.

```json
{
  "name": "check_room",
  "description": "Checks whether one meeting room is free for a single requested time window on one day, and answers Available or Unavailable. Every time is a whole number of minutes since midnight, so 10:00 is 600 and 24:00 is 1440, and every time must lie between 0 and 1440. The tool only checks the request: it does not save, create, change or cancel a booking and it writes nothing, so calling it has no side effects. Pass the requested start and end, the current time, whether the room is blocked today, and the list of bookings that already exist that day.",
  "inputSchema": {
    "type": "object",
    "properties": {
      "start": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested start time as whole minutes since midnight (10:00 = 600)."
      },
      "end": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Requested end time as whole minutes since midnight (11:00 = 660, 24:00 = 1440)."
      },
      "now": {
        "type": "integer",
        "minimum": 0,
        "maximum": 1440,
        "description": "Current time as whole minutes since midnight (9:00 = 540)."
      },
      "blocked": {
        "type": "boolean",
        "description": "True if the room is blocked today, for example for maintenance."
      },
      "bookings": {
        "type": "array",
        "description": "Existing bookings for that day as objects with start and end minutes; use [] when there are none.",
        "items": {
          "type": "object",
          "properties": {
            "start": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            },
            "end": {
              "type": "integer",
              "minimum": 0,
              "maximum": 1440
            }
          },
          "required": ["start", "end"],
          "additionalProperties": false
        }
      }
    },
    "required": ["start", "end", "now", "blocked", "bookings"],
    "additionalProperties": false
  }
}
```

| Field | Constraint (e.g. `"type": "integer"`, `"maximum": 1440`) | What goes wrong without it |
| --- | --- | --- |
| start | `"type": "integer"` | the model sends `"10:00"` or `600.5` and `canBook` compares a string to a number, which is never what I mean (S03, S10) |
| start, end, now | `"minimum": 0`, `"maximum": 1440` | negative minutes or 1500 get through and land outside the single day the function reasons about (S06, S07) |
| end | `"maximum": 1440` kept as allowed | 24:00 is a real end time in AC1, so making it `exclusiveMaximum` would refuse a valid call (S11) |
| now | required, like every field | a model that leaves `now` out forces `canBook` to guess the time of day, and AC1 is "start after now" (S04) |
| blocked | `"type": "boolean"` | a model writing `"false"` (a string) or `1` would make AC3 read a truthy string as "blocked" (S09) |
| bookings | `"type": "array"` with `"items"` object | the model invents its own shape, e.g. a pair `[660, 720]`, and the overlap loop in AC4 breaks (S12) |
| bookings[].start, bookings[].end | both in `"required"` | a booking without an `end` makes AC4 compare against `undefined` (S08) |
| the whole object | `"additionalProperties": false` | the model adds `"room": "204"`, a field `canBook` never reads, and the call looks more specific than it is (S05) |
| the whole object | `"required"` lists all five fields | a missing field is silently `undefined` inside the function instead of being refused by the client |
| description | says minutes, 0–1440, and "does not save" | the model converts 10:00 to `"10:00"`, guesses seconds, or believes the call books the room |

## 3. The twelve calls — first run and final run

Your **first** run's S verdicts (before any fix), and your final ones. For every case that changed,
say what you changed.

| Case | First run | Final run | What you changed |
| --- | --- | --- | --- |
| S01 | PASS | PASS | |
| S02 | PASS | PASS | |
| S03 | PASS | PASS | |
| S04 | PASS | PASS | |
| S05 | FAIL | PASS | added `"additionalProperties": false` at the top level, so an invented `room` field is refused instead of ignored |
| S06 | PASS | PASS | |
| S07 | PASS | PASS | |
| S08 | PASS | PASS | |
| S09 | PASS | PASS | |
| S10 | PASS | PASS | |
| S11 | PASS | PASS | |
| S12 | PASS | PASS | |

The only first-run failure was S05: the schema accepted a call carrying an extra `"room": "204"`
argument. That is the gap `additionalProperties` closes, and it is the one thing a schema can say
about a field nobody defined. Nothing else moved between the two runs.

## 4. Function calling — what the model wrote

For each request, paste the model's reply exactly, then judge it against the request.

### R1

```text
{"name":"check_room","arguments":{"start":600,"end":660,"now":540,"blocked":false,"bookings":[{"start":660,"end":720}]}}
```

Match. 9:00 → `now = 540`, 10:00 → `start = 600`, 11:00 → `end = 660`, the room is not blocked, and
the one existing booking 11:00–12:00 → `{"start": 660, "end": 720}`. F1–F3 all pass; the 10:00–11:00
window only touches the booking at 660, which AC4 allows, so `canBook` would answer Available.

### R2

```text
{"name":"check_room","arguments":{"start":840,"end":990,"now":810,"blocked":true,"bookings":[]}}
```

Match. 13:30 → `now = 810`, 14:00 → `start = 840`, 16:30 → `end = 990` (16 × 60 + 30, not 16 × 60),
`blocked = true` because of the maintenance, and `bookings = []`. F4–F6 pass. The important part is
that the model **made the call**: the answer will be Unavailable (blocked, and 150 minutes also
breaks the 120-minute rule of AC2), but deciding that is `canBook`'s job, not the schema's, so a
call here is the correct behaviour.

### R3

```text
What start time tomorrow afternoon would you prefer?
```

It asked, and `calls/r3.txt` holds the reply. The request has no date (is "tomorrow" even one day in
the units `canBook` works in?), no start, no end, no `now`, no `blocked` and no `bookings`. Four of
the five required arguments are missing, and the two present ones are vague ("afternoon", "a couple
of hours" is 120 minutes only if you decide it is). The model invented nothing: no `now = 720`, no
`start = 780`, no guessed `blocked = false`. That is what the prompt asked for, so this is a pass
for the model and a genuinely untestable case for the tool.

## 5. What the schema cannot check

The schema can enforce **only the outer half of AC1**: `"minimum": 0` and `"maximum": 1440` on
`start`, `end` and `now` keep S06 (−30) and S07 (1500) out, and `"type": "integer"` keeps S03 and
S10 out. It cannot enforce `start < end`, because the allowed keywords describe one value at a time
and never compare two properties, so `{"start": 600, "end": 600}` is a perfect call.

- **AC1, the ordering and "start after now" part** — needs `start < end` and `start > now`, a
  comparison between two fields that no allowed keyword can express.
- **AC2, at most 120 minutes** — needs `end - start <= 120`, again arithmetic across two fields.
  R2 is exactly this case: 840 → 990 is 150 minutes, and the schema has no complaint.
- **AC3, not when blocked** — `"type": "boolean"` makes the value yes/no, but only `canBook` knows
  that `true` means Unavailable.
- **AC4, no overlap, touching allowed** — needs every existing booking compared with the requested
  window; `"items"` only checks that each booking has the right shape (S08, S12).
- **AC5, nothing is saved** — a schema describes arguments, not effects, so "does not save" can only
  live in the description.
- **AC6, the page's feedback** — a return value the schema never sees.

## 6. Permissions — allow, ask or block

| # | Action | Decision (allow / ask / block) | Reason (the risk, in one sentence or more) |
| --- | --- | --- | --- |
| A1 | call `check_room` with the times the user just typed | allow | The tool only reads its arguments and answers Available or Unavailable; AC5 says it saves nothing, so a wrong call costs one extra message and no state. |
| A2 | Read `week-08/app/src/booking.ts` | allow | Reading source code changes nothing and is the cheapest way for the agent to see how `canBook` really enforces AC1–AC4. |
| A3 | Edit `booking.ts` to raise the 120-minute limit to 180, because a user asked for 3 hours | block | That rewrites AC2, which is a requirement of the course spec, not a bug; the honest answer to a 3-hour request is Unavailable, and a silent limit change would make the tests and the report lies. |
| A4 | Run `npm test` in `week-08/app` | allow | The test suite is the project's own verification step, it does not modify source, and a failing run is information rather than damage. |
| A5 | Run `git reset --hard` to undo its own last three edits | ask | Hard reset discards committed work and every uncommitted change in the tree, including edits the user made and the agent cannot tell apart from its own, so the user has to confirm and name the target commit. |
| A6 | Commit its change on the `week-09` branch | ask | A commit is local and recoverable, but it freezes a change the user may not have reviewed and it is the thing the PR will show, so approval comes first. |
| A7 | Push to `main` | block | Pushing to `main` publishes unreviewed work on the shared branch and skips the PR flow the course requires, so it must never happen from an agent holding a tool and a terminal. |
| A8 | Send the contents of `.env` to an MCP server it found online, "to configure it" | block | `.env` holds API keys and credentials, and sending them to a server nobody vetted leaks secrets that cannot be un-leaked by deleting the message. |

Important distinction:

- Allow: Safe action within the user's request.
- Ask: Potentially legitimate action requiring confirmation.
- Block: Unsafe action or action that violates established requirements.

## 7. Checkpoint

The checkpoint is the commit that still holds the given files and none of my Part 1–3 work:
`524ca4e` — *week-09: project setup and check room json*. Before letting an agent that holds
`check_room`, a terminal and this repository edit anything, I would note that SHA and have it work
on a scratch branch from there.

The exact command that takes me back:

```bash
git reset --hard 524ca4e
```

That throws away every commit made after `524ca4e` on `week-09` — the tightened tool definition, the
three `calls/` files, the filled report — and every staged or unstaged change in the working tree,
reverting tracked files to their state at that commit. Untracked files survive a `--hard` reset, so
a file the agent created without adding it would still sit there; `git clean -fd` is what removes
those, and it is a second destructive step I would confirm separately.

## 8. Checker output

Paste the **whole** output of your last `python tests/check_tool.py`, unedited.

```text
PASS  D1    tool/check_room.json exists and is valid JSON
PASS  D2    has name, description and inputSchema
PASS  D3    name is exactly "check_room"
PASS  D4    description: 25+ words, says minutes, 1440, and that it does not save
PASS  D5    inputSchema: an object with exactly the five fields, all required
PASS  D6    inputSchema uses only the keywords listed in README section 5
PASS  S01   the R1 call, valid -> accept
PASS  S02   no existing bookings: bookings = [] -> accept
PASS  S03   end as a string: "11:00" -> refuse
PASS  S04   now missing -> refuse
PASS  S05   an extra field: "room": "204" -> refuse
PASS  S06   start below the day: -30 -> refuse
PASS  S07   end beyond the day: 1500 -> refuse
PASS  S08   a booking with no end: {start: 660} -> refuse
PASS  S09   blocked as a string: "false" -> refuse
PASS  S10   start not a whole minute: 600.5 -> refuse
PASS  S11   end at the end of the day: 1440 -> accept
PASS  S12   a booking as a pair: [660, 720] -> refuse
PASS  F1    calls/r1.json: a call to check_room
PASS  F2    calls/r1.json: arguments valid against your schema
PASS  F3    calls/r1.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F4    calls/r2.json: a call to check_room
PASS  F5    calls/r2.json: arguments valid against your schema
PASS  F6    calls/r2.json: arguments equal the expected ones (README section 5, Part 2)
PASS  F7    calls/r3: exactly one of r3.json (it called) or r3.txt (it asked), not empty
PASS  L1    section 5 names at least two acceptance criteria (AC1-AC6) the schema cannot check
PASS  L2    section 6: A1-A8 each have allow / ask / block and a reason of 5+ words
PASS  L3    section 7 names the checkpoint commit (a SHA)
PASS  L4    section 10: a conclusion of 80-150 words
PASS  L5    AI_USAGE.md filled in (a tool row, and signed)

SUMMARY: 30 PASS · 0 FAIL · 0 ERROR  (of 30 checks)
Paste this whole output into lab-report.md section 8, and these three numbers into submission.yml.
```

## 9. What still fails

None: the final run reports 30 PASS, 0 FAIL, 0 ERROR, so `checker.known_fails` in `submission.yml`
is empty. Two things were failing before I finished and are worth recording: L3 failed because
section 7 was empty, and L4 failed because section 10 had no conclusion yet — both were missing
text in this worksheet, not a problem with the tool, the calls or the schema.

## 10. Conclusion (80–150 words)

Three layers fail in three different ways, and the lab separates them cleanly. My schema refuses
S05, an invented `room` field, only because I set `additionalProperties` to false. But shape is not
meaning: no allowed keyword can say `start < end` or `end - start <= 120`, so AC1 and AC2 stay
inside `canBook`, and S11 shows `end = 1440` is legal even though `start = 660, end = 600` would be
equally legal. R2 surprised me: the model still made the call with `blocked = true` and read 16:30
as 990, because deciding Unavailable belongs to the function. R3 was the honest limit: with no
date, times or `blocked` value the model asked instead of inventing `now`, exactly as the prompt
required. A8 is the action that can never be allowed.
