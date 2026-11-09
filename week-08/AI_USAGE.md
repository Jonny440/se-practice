# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| DuckDuckGo AI Chat (Duck.ai), anonymous web chat | GPT-6 Luna | Task 4 — diagnosis without the skill (§5); answer pasted verbatim | none — "Do not edit code" |
| DuckDuckGo AI Chat (Duck.ai), anonymous web chat | GPT-6 Luna | Task 5 — diagnosis with `SKILL.md` pasted as the first message, prompt-only simulation (§6); answer pasted verbatim | none — "Do not edit code" |
| Freebuff coding agent | not displayed | built `app/` from the Week 06 project, wrote the 19-test suite, ran Vitest and the checker, applied the two one-line fixes, drafted `lab-report.md` and this disclosure | `week-08/app/src/lib/booking.ts`, `week-08/app/src/lib/booking.test.ts`, `week-08/app/src/lib/availability.ts`, `week-08/app/package.json`, `week-08/lab-report.md`, `week-08/submission.yml`, `week-08/skills/` |

**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes
<!-- The seven steps and the frontmatter are the deck's own text, copied verbatim. -->

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** no — the Freebuff coding agent applied both one-line changes. The diffs are in
lab-report.md §8.1 and §8.2, and each change is committed separately so the runs show the tests
turning green in order. The no-skill answer's extra edit to `start > now` was rejected: it would
have broken T05.

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** yes
<!-- Duck.ai (GPT-6 Luna) for §5 and §6; the Freebuff agent for the code, the report draft and this file. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes
<!-- Captured with `tee` at 21:10–21:12 on 8 Nov 2026 and copied into §2 and §8 without editing. -->

**I can explain both bugs and both fixes — which line, why it was wrong, which test proves the
fix — without the assistant:** yes
<!-- BUG-A: `start <= b.end && end >= b.start` treats a shared endpoint as an overlap, proven by T01, T08, T14 and BUG-A.
     BUG-B: `bookings.push({ start, end })` writes to the caller's array, proven by AC5 and BUG-B. -->

**Anything I accepted from the AI without fully understanding it:**
The no-skill answer's claim that its patch "interprets in the past as `start < now`" was not
accepted. AC1 and T05 make a request starting exactly at the current time Unavailable, so the
change is recorded in §7 as an unsupported claim, not applied. Everything that was applied — the
strict overlap comparison and the removal of the `push` — is pinned by the tests in §8.

Signed: Zhanibek Batyrbekov
Date: 9 November 2026
