# AI Usage Disclosure — SIS #04

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Date | Used for | Which files it touched |
| --- | --- | --- | --- | --- |
| DeepSeek (chat.deepseek.com) | DeepSeek V4.1 Flash | 20.11.2026 | codebase analysis (Task 1) | `report.md` 3.1 (not accepted unverified; every risk re-read in `src/lib/*`) |
| DeepSeek (chat.deepseek.com) | DeepSeek V4.1 Flash | 20.11.2026 | improvement plan | `report.md` 3.2 and 3.3; no code |
| DeepSeek (chat.deepseek.com) | DeepSeek V4.1 Flash | 21.11.2026 | feature extension (Task 2) | `app/src/filter.ts`, `checkRoom` in `app/src/booking.ts` (first draft corrected: `.some()` → `.every()`) |
| DeepSeek (chat.deepseek.com) | DeepSeek V4.1 Flash | 21.11.2026 | refactoring (Task 3) | the `app/src/components/` split and `app/src/time.ts`; `src/lib/` deleted |
| DeepSeek (chat.deepseek.com) | DeepSeek V4.1 Flash | 21.11.2026 | tests (Task 4) | `app/src/booking.test.ts`, `app/src/filter.test.ts`; every expected value re-derived from AC1–AC5 and F1–F5 |

<!-- Delete rows you did not use the assistant for; add rows for anything else. The optional
     extension (an existing skill or a read-only MCP server) goes here too, with its permissions. -->

**The assistant wrote, or helped write, tests in `app/`:** yes
<!-- Either answer is allowed. If "yes": which tests, and how you checked that their EXPECTED values
     come from AC1–AC5 and F1–F5, not from what the code happens to return. -->

The assistant drafted the test skeletons for `booking.test.ts` and `filter.test.ts`. I rewrote the
expected values from the rules, not from the output: B1 is 120 minutes because AC2 says 120 is the
limit, B2 is 121 because it is one more, B5 uses a 20-seat room for 20 attendees because F1 says
greater than or equal, B6 uses 21 because that is one above. The assistant's first capacity filter
used `.some()` for equipment and its first `checkRoom` returned `true` for an unknown id; both drafts
were wrong and the F2 and unknown-id tests I had already written rejected them.

**Every run pasted in report.md was produced by my code on my machine (or Codespace), unedited:** yes

**Every number in report.md section 7 was measured the way its row says:** yes

**I shared no credentials, keys or private data with any tool:** yes

**Everything I submitted, I can explain and defend in class — including filterRooms, checkRoom and
why each module exists:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing. The two suggestions I did not fully agree with — `equipment.some()` in `filterRooms` and a
`canBook` that returns a problem object — were changed or rejected, and both are recorded in
`report.md` 3.3 and 8.3.

Signed: Zhanibek Batyrbekov
Date: 22.11.2026
