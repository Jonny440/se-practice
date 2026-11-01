# AI Usage Disclosure — SIS #03

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched | Reused from |
| --- | --- | --- | --- | --- |
| ChatGPT | ChatGPT-5.6 Sol | the plan (stage A) | none — chat text only, pasted into `report.md` §11 B1 | week-05 |
| ChatGPT | ChatGPT-5.6 Sol | Python v1 (stage B) | `code/original/booking_v1.py` | week-05 |
| Bolt.new | not displayed | web prototype v1 (stage B) | `web/original/` | week-06 |
| ChatGPT | ChatGPT-5.6 Sol | critique (stage C) | none — review text, recorded in `report.md` §8 and §11 B3 | this SIS |
| ChatGPT | ChatGPT-5.6 Sol | repair prompts (stage D) | `web/final/project/src/` (argument order, blocked room, time fields, dependency) | this SIS |
| Codebuff coding agent (workspace) | not displayed | applied the repair edits, started the page, ran the checker and the browser cases, and drafted the tests and the report text under my review | `code/booking.py`, `code/test_booking.py`, `web/final/`, `evidence/`, `report.md`, `AI_USAGE.md` | this SIS |

**The assistant wrote, or helped write, my tests in `code/`:** yes
Every expected value in `code/test_booking.py` comes from AC1–AC5, not from what `can_book`
returns: T1–T12 use the brief's table, and the extra tests were written from the rules
(`start == now` → False, exactly 120 → True, reversed → False, an unsorted `existing` list must
come back unchanged → AC5). I checked that the tests can fail by running them against the ten
faulty `can_book` versions the checker supplies, one broken AC each — all ten were caught.

**`code/original/` and `web/original/` hold the AI's first versions exactly as returned:** yes

**Every result in report.md section 5 was actually run or seen, not assumed:** yes
The Python columns come from the checker's run of both files; the page columns come from the
running page in the browser at 375 px and at desktop width, room by room.

**Everything I submitted, I can explain and defend in class — including the overlap condition
and what the agent did in section 9:** yes

**Anything I accepted from the AI without fully understanding it:**
None. Where a suggestion did not match the acceptance criteria — sorting `existing` before the
overlap loop (it mutates the caller's list, AC5), a cleaning buffer, a 90-minute cap — I rejected
or modified it, and `report.md` §8 records why.

Signed: Zhanibek Batyrbekov
Date: 2026-11-01
