# Lab report — Practice #02: The Prompt Is an Engineering Input

**Name:** Zhanibek Batyrbekov
**Group:** Mon 16:00-19:00
**Date:** 15th September

> Fill in every section. **Do not delete or renumber the headings** — the grading pass reads them
> by number. If something did not happen, write "did not happen" and why; an empty section and a
> fabricated one are graded the same way.

---

## 1. The frozen experiment

| | |
| --- | --- |
| AI assistant | | ChatGPT
| Exact model name | | GPT-5.6 Sol
| Implementation language | | Python
| Date of the runs | | 15th of September

**Non-Python students only** — paste your substituted Prompt B text here, so the substitution can
be checked:

n/a — used Python

**Confirmations:**

- Each prompt was sent in a **fresh chat**: yes / no
- No follow-up questions were asked before Part 7: yes / no
- Every output was saved **before** any editing: yes / no

---

## 2. Prompt A — minimal

**Prompt sent** (should be exactly one sentence):

```
Write Python code to analyze student marks.
```

**Assumptions the AI made that I never gave it** — list them, one per line. A data format, a pass
threshold, a rounding rule, an input method, an invented feature all count.

1. Assumed the grading criteria
2. Assumed the results i want
3. Assumed the input method

**Questions it should have asked and did not:**

1. What to do with invalid input types?
2. What kind of format of the result i want to see?

**Is the function named `analyze_marks` with the required signature?** no — if no, what is it
called: there is no functions at all

**First impression before testing** (one sentence — you will compare this with section 6 later):

---

## 3. Prompt B — structured context

**Prompt sent** (paste it in full, including any substitutions):

```
You are a Python developer. Implement analyze_marks(marks, pass_mark=50).
Return average, highest, lowest, and pass_rate in a dictionary. Accept marks
from 0 to 100; raise ValueError for an empty list, non-numeric values, or
out-of-range values. Use no external libraries. Return code plus a short
explanation.
```

**What B fixed compared to A:**

1. Passing criteria
2. Wrapped code into a function
3. Checks if the inputs are valid

**What B still leaves open:**

1. Code does not handle interactive input
2. 

---

## 4. Prompt C — examples and tests

**What I appended to Prompt B:**

```
Example: analyze_marks([40, 60, 80], 50) → average 60, highest 80, lowest 40, pass_rate 66.67. Include tests for: one mark, decimals, custom pass_mark, empty list, text value, and marks below 0 or above 100. State any remaining assumptions before the code.
```

**Tests the AI wrote for itself** — how many, and which situations do they cover?

| Situation | Covered by the AI's tests? |
| --- | --- |
| one mark | | yes - test 2
| decimals | | yes - test 3
| custom pass_mark | | yes - test 4
| empty list | | yes - test 5
| text value | | yes - test 6
| below 0 / above 100 | | yes - tests 7 and 8

**Do the AI's own tests pass against the AI's own code?** yes

**Do they agree with the harness in section 6?** yes 

**Assumptions C stated explicitly before the code:**

---

## 5. Prompt D — my combined prompt

**The complete prompt I wrote** (one message, sent to a fresh chat):

```
you are a python developer. implement analyze_marks(marks, pass_mark=50). return a dictionary with exactly these keys: "average", "highest", "lowest", and "pass_rate".
here are you requirements:
marks must be a non-empty list; every mark must be numeric and between 0 and 100 inclusive; non-numeric values must raise valueError; marks below 0 or above 100 must raise valueError; an empty list must raise valueerror.; pass_mark must be numeric and between 0 and 100 inclusive; a mark passes when mark >= pass_mark; pass_rate is the percentage of marks that pass; round average and pass_rate to 2 decimal places; highest and lowest should preserve their numeric values; do not use external libraries; do not read input or print anything inside the function.
use this example to verify the expected behavior:
analyze_marks([40, 60, 80], 50)
return -> {"average": 60.0, "highest": 80, "lowest": 40, "pass_rate": 66.67}
include tests for all of these cases:
1. one mark
2. decimal marks
3. a custom pass_mark
4. an empty list
5. a non-numeric value such as "60"
6. a mark below 0
7. a mark above 100
for invalid cases, the expected behavior is valueerror.
before the code, briefly state any remaining assumptions you are making. then provide the implementation and tests.
```

**What I deliberately added that A, B and C did not have:**

1. Rounding criteria for pass rate and average
2. To not input or print anything insidde function
3. Asked him to state his assumptions, so i can clear them before the code

**The ambiguity I found in the specification, and how I resolved it inside Prompt D:**

--- There were no rules about rounding the pass rate and average float numbers.

## 6. Test results — the evidence

Six cases × four prompts. Verdicts are **PASS**, **FAIL** or **ERROR** only.

| # | Call | Required | A | B | C | D |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | `analyze_marks([40, 60, 80], 50)` | avg 60 · high 80 · low 40 · rate 66.67 | ERROR | | | |
| 2 | `analyze_marks([100], 50)` | avg 100 · high 100 · low 100 · rate 100 | ERROR | | | |
| 3 | `analyze_marks([49.5, 50], 50)` | avg 49.75 · high 50 · low 49.5 · rate 50 | ERROR | | | |
| 4 | `analyze_marks([], 50)` | raises ValueError | ERROR | | | |
| 5 | `analyze_marks([40, "60"], 50)` | raises ValueError | ERROR | | | |
| 6 | `analyze_marks([-1, 50, 101], 50)` | raises ValueError | ERROR | | | |
| | **Totals** | | 0/6 | /6 | /6 | /6 |

**For every FAIL and ERROR above, one line: what was returned or raised instead.**

| Prompt | Case | What actually happened |
| --- | --- | --- |
| | | |
| | | |
| | | |

### Pasted terminal output — all four runs

> This is the part that makes the table above count. Paste the **whole** output, unedited,
> including the header lines. A table with nothing behind it is not accepted.

**Prompt A**

```

```

**Prompt B**

```

```

**Prompt C**

```

```

**Prompt D**

```

```

---

## 7. Scoring

0–2 per criterion, using the rubric in `README.md` Part 7.

| Criterion | A | B | C | D |
| --- | --- | --- | --- | --- |
| Correctness (cases passed) | | | | |
| Requirement coverage | | | | |
| Verifiability (tests) | | | | |
| Assumptions stated | | | | |
| Noise (2 = none) | | | | |
| **Total / 10** | | | | |

**Prompt length, in words:** A ____ · B ____ · C ____ · D ____

**Words added per point gained** — B over A, C over B, D over C. One line on what that ratio says:

---

## 8. Conclusion — 150–200 words

Answer in this order: (1) which prompt scored best, and whether it is the one you would actually
use at work; (2) which single addition bought the most correctness, naming the exact case that
changed verdict; (3) what was pure noise; (4) the ambiguity and your resolution.

Name test cases and real returned values. "More detailed prompts work better" scores zero.

```
(150–200 words)



```

**Word count:**

---

## 9. Two questions for the debrief

Written before class, answered in class.

1.
2.
