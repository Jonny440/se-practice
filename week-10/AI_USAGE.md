# AI Usage Disclosure — Week 10

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| DeepSeek web chat (chat.deepseek.com) | DeepSeek V4.1 Flash — frozen for the whole lab, recorded in `lab-report.md` §1 | read-only risk review (Task 2) | none — ran on pasted files under "WITHOUT editing files" |
| DeepSeek web chat (chat.deepseek.com) | DeepSeek V4.1 Flash | AGENTS.md review and patch draft (Task 6) | `app/AGENTS.md`, only after my approval in §6.2 |
| DeepSeek web chat (chat.deepseek.com) | DeepSeek V4.1 Flash | minimal patches for two risks (Task 8) | `app/AGENTS.md`, `app/src/lib/time.ts`, `app/src/lib/decision.ts`, `app/src/lib/availability.ts` |
| DeepSeek web chat (chat.deepseek.com) | DeepSeek V4.1 Flash | review of the R1 regression test's assertions (Task 7) | `app/src/lib/booking.test.ts`; the test body is mine, the assistant only commented on the expected values |
| me, no assistant | — | proofreading of `lab-report.md` §10 (the release decision) | `lab-report.md` |

**The review in Task 2 ran in a mode where the assistant could not edit, and `git status` showed no
change afterwards:** yes
<!-- If it edited anything, say what and how you undid it. -->
Nothing under `app/` changed during the review: the chat had no file access, only pasted text, and
`git status` after the answer showed only my own later edits.

**I labelled every claim in lab-report.md §3.2 after opening the cited file myself:** yes

**Every change to `app/` was reviewed by me as a diff before I accepted it:** yes
<!-- Name anything you rejected in §8; name here anything you accepted without reading. -->
I rejected the assistant's "add a `test:unit` script" alternative and its "edit only `src/`" rewrite
(§6.2 rows 9–10), and in §8.2 its unrelated parameter rename and its duplicate reason branch. I did
not accept any file I had not read line by line.

**I used another assistant as well (to explain a risk, to draft text in lab-report.md, …):** no
<!-- If "yes": which one, the exact model, and for which section. -->

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**I can explain every score in my register, and why my release decision follows from it, without
the assistant:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing. The one part I changed after reading it was the refusal to touch `canBook` itself: the
refactor prompt says "keeping the existing function inputs, outputs, and UI behavior", so `canBook`
and its 20 tests stayed as they were.

Signed: Zhanibek Batyrbekov
Date: 22 November 2026
