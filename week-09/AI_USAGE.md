# AI Usage Disclosure — Week 09

Required by the course academic policy (Generative AI use level **D — AI-integrated**).
You are responsible for the accuracy, testing and integrity of everything you submit,
including anything an AI tool produced.

| Tool | Exact model / plan | Used for | Which files it touched |
| --- | --- | --- | --- |
| DeepSeek | DeepSeek V4.1 Flash | Part 2 — writing the calls for R1, R2, R3 | calls/ (saved by me, unedited) |
| DeepSeek | DeepSeek V4.1 Flash | Reviewing the JSON Schema keywords and the S01–S12 results, and checking that the report's numbers match real runs | tool/check_room.json (reviewed, not written by it), lab-report.md |

**I wrote `tool/check_room.json` myself:** yes
<!-- If an AI wrote or revised any of it, say which part, and how you checked it. -->

**I used an AI to explain a JSON Schema keyword or a check:** yes
<!-- If "yes": which one, and for what. -->
Yes. It explained what `additionalProperties: false` does to the S05 case (an extra `"room"` field)
and why `items` with a `required` list is what refuses S08 and S12. I typed the definition myself
and re-ran `tests/check_tool.py` after every change.

**Every reply in `calls/` and in lab-report.md section 4 is exactly what the model returned:** yes

**Every terminal output in lab-report.md was pasted from a real run, unedited:** yes

**Anything I accepted from the AI without fully understanding it:**
Nothing is copied without understanding. The one judgement I took from the assistant and then
checked myself is R3: the reply asks a question instead of calling, and I verified by hand that four
of the five required arguments (start, end, now, blocked) are genuinely absent from the request
before writing that into section 4.

Signed: Zhanibek Batyrbekov
Date: 14 November 2026
