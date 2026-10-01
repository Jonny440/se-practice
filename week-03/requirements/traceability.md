# Traceability — use cases → stories → criteria

One row per use case. All six rows stay, even the ones with nothing behind them: an empty cell is a
finding you report, not a failure you hide. Use real IDs, comma-separated; write `none` where there
is nothing.

| Use case | Stories (US-nn) | Criteria (AC-nn) | Gap? |
| --- | --- | --- | --- |
| UC-01 View availability | US-01 | AC-01, AC-02, AC-03 | No |
| UC-02 Book room | US-02 | AC-04, AC-05, AC-06 | No |
| UC-03 Cancel booking | US-03 | AC-07, AC-08, AC-09 | No |
| UC-04 Block or unblock room | US-05 | none | Yes — no acceptance criteria selected for this story |
| UC-05 Review usage | US-06 | none | Yes — no acceptance criteria selected for this story |
| UC-06 Send confirmation | US-04 | none | Yes — no acceptance criteria selected for this story |

**Stories that belong to no use case:** none

**What the gaps tell you:**  
The three selected stories have complete traceability from use case to user story to acceptance criteria. UC-04, UC-05, and UC-06 are covered by user stories but currently have no acceptance criteria because the assignment required acceptance criteria for only three selected stories. These are documented traceability gaps rather than missing user stories.
