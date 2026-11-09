# AI Usage Disclosure — Week 08

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| ChatGPT| GPT-6 Luna | Task 4 — diagnosis without the skill (§5); answer pasted verbatim | none — "Do not edit code" |
| ChatGPT | GPT-6 Luna | Task 5 — diagnosis with `SKILL.md` pasted as the first message, prompt-only simulation (§6); answer pasted verbatim | none — "Do not edit code" |


**`skills/bug-detector/SKILL.md` was typed by me from the deck's text, not generated:** yes
<!-- The seven steps and the frontmatter are the deck's own text, copied verbatim. -->

**I applied the patches myself, one minimal change per bug, after reviewing what the assistant
proposed:** yes

**I used another assistant as well (to explain a failure, to draft text in lab-report.md, …):** no

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

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
