# SIS #01 — Software Engineering Fundamentals, With an AI in the Loop

**Topic:** 1.6

---

## 1. Scenario

**Question:** University management system development. Where it is allowed to use AI during the development process and where it is prohibited and might lead to sever issues?

**Users:** Project manager, Software developer, QA engineer, End user

**Problem:** It is 1990th, and the Student information, their marks, courses are all stored in paper, spreadsheets and takes a lot of time to manage all of them, so they asked a team to create a uni management system.

**Constraints:** 1. New semester starts in 7 months, so the system must be ready within this time; 2. System must be secure, to not let unauthorised people to access student data.

**Risk:** Student's personal data leaking.

**Assumptions:** fictional 10.000 students, fictional 100 workers(not all of them have access to system)

## 2. Analysis

The scenario is a time-boxed university management system for 10,000 students and 100 workers, with a hard 7-month deadline and a strict security constraint. The core risk is student personal data leakage. AI can assist across all four engineering principles, but engineers must own the decisions that affect security, accountability, and scope.

Process. A fixed 7-month deadline suits an incremental or waterfall-with-milestones approach. AI can draft a work breakdown, suggest milestones, and generate checklists. However, prioritisation—what to cut if the schedule slips—is a management judgement AI cannot own. The project manager must decide the plan and adjust it as risks emerge.

Dependability. Security, availability, and data integrity are critical. AI can draft candidate threat models, encryption patterns, backup schedules, and audit-log schemas. It cannot certify that the system is secure or hold legal liability. If an incident occurs, AI output can be named as a causal contributor in the incident report, but accountability remains with human roles (ISO/IEC 27001:2022, Clause 5.3; NIST AI RMF 1.0). Human review, threat modelling, and penetration testing remain mandatory.

Requirements management. Traceability between requirements and design is essential. AI can help elicit questions, spot contradictions, and draft a traceability matrix. Only the project manager can resolve conflicting stakeholder needs or sign off scope changes. Because the scenario involves four user groups (PM, developer, QA, end user), requirements must be validated against each group's needs.

Reuse. Reusing proven components—authentication libraries, logging frameworks, database engines—reduces risk within 7 months. AI can recommend candidates and compare trade-offs. Selecting, licensing, integrating, and judging fitness for a sensitive context remains a human engineering decision.

AI allowed vs. prohibited. The correct distinction is three-tiered: AI may assist (with human review), human sign-off is required before adoption, and prohibited only where AI acts without human review. For example, AI may draft candidate architectures or threat models, but final security architecture and access-control policy require human sign-off. Prohibited uses include autonomous AI decisions on access rights, encryption keys, or retention policy. This distinction matters because the scenario asks where AI is allowed and where it is prohibited—a binary answer would ignore the middle ground of assisted-with-review and lose role-specific specificity.


## 3. Review

First, it questioned my choice of the 1990s setting. I kept the setting because the scenario needs a concrete context, and paper spreadsheets were a real problem then, but I accepted that the 1990s does not mean "no technology at all." By the mid-1990s, universities commonly had LANs, Unix workstations, and early web browsers, so "any device" can mean any campus-networked terminal rather than a smartphone. That qualification is now in verification row 1 and change-log row 1. Second, I checked the claim that "no AI can be blamed in a post-incident review." ISO/IEC 27001 places accountability on human roles, not tools, but an AI's output can still be named as a causal contributor in an incident report. I therefore separated legal liability from causal attribution (verification row 2; change-log row 2). Third, I agreed that my AI table was too black-and-white. The final version separates "AI assists with human review" from "human sign-off required" and "prohibited," and it shows how this differs for the four user roles (change-log row 3). I did not agree that the 1990s setting changes everything: it changes device assumptions and bandwidth, but not the core requirements-engineering work. The critique also pushed me to build a role × AI-use matrix and to trace the data-leak risk through each principle. That was my own addition: process needs security gates, dependability needs threat modelling, requirements management needs privacy constraints, and reuse needs vetted components. I also kept uncertainty where evidence was limited, especially about the exact year, jurisdiction, retention rules, and device mix, instead of inventing details. Overall, the critique helped me replace vague claims with specific, era-appropriate examples, name who owns each decision, and finish with a recommendation instead of just a list of hypotheses.

## 4. Conclusion

For this scenario, AI should be used as a drafting and analysis assistant under human review, never as an autonomous decision-maker on security, access control, or compliance. The project manager should allow AI to help with planning, risk lists, and documentation, but must personally own prioritisation and scope decisions. The developer may use AI for boilerplate, code review suggestions, and candidate architectures, but must personally verify and integrate any component. The QA engineer may use AI to generate test ideas, but must review and approve all test cases before execution. The end user's data must be protected by human-designed access controls and audit logging. The main limitation of this recommendation is that it depends on the team having clear role definitions and review gates in place; without them, AI assistance can quietly become AI decision-making, which is where serious issues arise.

## 5. Reflection

What helped most was the critique in Prompt B. It forced me to stop treating the scenario as a simple "AI yes/no" question and instead think about who owns each decision. The most useful specific change was replacing the binary AI table with a three-tier structure: assist with review, sign-off required, and prohibited. That made the answer directly respond to the question "where is AI allowed and where is it prohibited" without overstating either side. I also learned that the 1990s setting is not just decoration—it changes device assumptions and what "reuse" means, but it does not change the need for requirements traceability or human accountability. The role × AI-use matrix was harder to fill than I expected because I had to name which human role owns each sign-off. That specificity is what the original draft was missing. Next time I would draft the role matrix first, before writing any prose.

## 6. References

- W3C. "A Little History of the World Wide Web." https://www.w3.org/History.html (accessed 2026-10-11).
- ISO/IEC 27001:2022. Clause 5.3 (roles, responsibilities and authorities) and Annex A.5.24 (incident management).
- NIST AI Risk Management Framework 1.0 (2023).
- Sommerville, I. (2016). Software Engineering, 10th ed., Global Edition. Pearson. Ch. 1.

## 7. Appendix A — Initial outline

1. There should be one general database to access all other smaller ones. ("Studnets, Marks, Course" db inside main)
2. Each worker should have a role, with different authorities. One admin.
3. Workers should be able to send messages to other workers inside system.
4. Students must be able to enter the system via any device (mobile/pc)
5. There should be event logger, to review the changes made and by whom. Keep the record for 10 years

## 8. Appendix B — AI exchanges

### B1 — Draft (Prompt A)

- **Tool:** DeepSeek
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** contextual draft

**Prompt:**

```text
Act as a software engineering tutor. Help me analyze topic | 1.6 | Fundamental engineering principles | Apply process, dependability, requirements management and reuse to your scenario. Evaluate what AI can assist with and what engineers must still decide. |
 for a first-year-level university assignment.

My scenario is [**Question:** University management system development. Where it is allowed to use AI during the development process and where it is prohibited and might lead to sever issues?

**Users:** Project manager, Software developer, QA engineer, End user

**Problem:** It is 1990th, and the Student information, their marks, courses are all stored in paper, spreadsheets and takes a lot of time to manage all of them, so they asked a team to create a uni management system. 

**Constraints:** 1. New semester starts in 7 months, so the system must be ready within this time; 2. System must be secure, to not let unauthorised people to access student data.

**Risk:** Student's personal data leaking. 

**Assumptions:** fictional 10.000 students, fictional 100 workers(not all of them have access to system)
]. My initial ideas are 1. There should be one general database to access all other smaller ones. ("Studnets, Marks, Course" db inside main) 2. Each worker should have a role, with different authorities. One admin. 3. Workers should be able to send messages to other workers inside system. 4. Students must be able to enter the system via any device (mobile/pc) 5. There should be event logger, to review the changes made and by whom. Keep the record for 10 years. Draft a 400–500 word explanation using these details.

Separate facts from assumptions. Explain trade-offs and identify claims I should verify. Do not invent quotations, references or page numbers.
```

**Response:**

```text
# Tutor Analysis: Fundamental Engineering Principles in Your University Management System Scenario

## Facts vs. Assumptions

**Given facts (from your brief):** 7-month deadline; 10,000 students; 100 workers; security requirement; risk of personal data leak; 1990s context. **Your assumptions:** one central database with sub-databases; role-based access; internal messaging; cross-device access; 10-year audit log. These are design decisions, not requirements — verify them with stakeholders before committing. Also note a hidden tension: a 1990s setting means no smartphones or modern web browsers, so "any device" may mean campus terminals or early PCs. Clarify this, as it changes everything downstream.

## Applying the Four Principles

**Process.** A 7-month fixed deadline suits an incremental or waterfall-with-milestones approach. You must decide the plan; AI can draft a work breakdown, suggest milestones, and generate checklists. But prioritisation — what to cut if time runs short — is a management judgement AI cannot own.

**Dependability.** Security, availability and data integrity matter most here. AI can suggest encryption patterns, backup schedules, and audit-log schemas. It cannot certify that your system is secure, nor accept liability when 10,000 students' records leak. Human review, threat modelling and penetration testing remain mandatory.

**Requirements management.** Traceability between requirements and design is essential. AI can help elicit questions, spot contradictions, and draft a traceability matrix. But only the project manager can resolve conflicting stakeholder needs or sign off scope changes.

**Reuse.** Reusing proven components (authentication libraries, logging frameworks, database engines) reduces risk within 7 months. AI can recommend candidates and compare trade-offs. Selecting, licensing and integrating them — and judging their fitness for a sensitive context — is an engineering decision.

## AI: Allowed vs. Prohibited

| Safe for AI | Dangerous / prohibited |
|---|---|
| Boilerplate, documentation, test ideas | Final security architecture and access-control policy |
| Code review suggestions | Production data handling, credential management |
| Drafting ER diagrams, log formats | Approving role permissions or audit retention rules |
| Estimating effort, listing risks | Sign-off on compliance and data-protection obligations |

Using AI to *decide* access rights, encryption keys, or retention policy could cause serious harm and accountability failures — no AI can be blamed in a post-incident review.

## Trade-offs and Claims to Verify

A central database simplifies access but creates a single point of failure. Role-based access improves security but adds administrative overhead. Cross-device access boosts usability but widens the attack surface. A 10-year log aids accountability but raises storage, privacy and legal questions. **Verify:** data-protection laws applicable in your jurisdiction and era; retention limits; whether students consent to messaging being logged; realistic timeline for 10,000 records; and who holds admin rights. Treat your five ideas as hypotheses, not settled design.
```

### B2 — Critique (Prompt B)

- **Tool:** DeepSeek
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** critical review of the draft

**Prompt:**

```text
Review the draft below against my chosen question and scenario. Identify inaccuracies, missing reasoning, vague claims and unsupported assumptions.
For each concern, explain why it matters and how I could check it. Include a counterexample or alternative interpretation. Do not rewrite the answer yet.
Question: [| 1.6 | Fundamental engineering principles | Apply process, dependability, requirements management and reuse to your scenario. Evaluate what AI can assist with and what engineers must still decide. |
]. Scenario: [**Question:** University management system development. Where it is allowed to use AI during the development process and where it is prohibited and might lead to sever issues?

**Users:** Project manager, Software developer, QA engineer, End user

**Problem:** It is 1990th, and the Student information, their marks, courses are all stored in paper, spreadsheets and takes a lot of time to manage all of them, so they asked a team to create a uni management system. 

**Constraints:** 1. New semester starts in 7 months, so the system must be ready within this time; 2. System must be secure, to not let unauthorised people to access student data.

**Risk:** Student's personal data leaking. 

**Assumptions:** fictional 10.000 students, fictional 100 workers(not all of them have access to system)
]. Draft: # Tutor Analysis: Fundamental Engineering Principles in Your University Management System Scenario

## Facts vs. Assumptions

**Given facts (from your brief):** 7-month deadline; 10,000 students; 100 workers; security requirement; risk of personal data leak; 1990s context. **Your assumptions:** one central database with sub-databases; role-based access; internal messaging; cross-device access; 10-year audit log. These are design decisions, not requirements — verify them with stakeholders before committing. Also note a hidden tension: a 1990s setting means no smartphones or modern web browsers, so "any device" may mean campus terminals or early PCs. Clarify this, as it changes everything downstream.

## Applying the Four Principles

**Process.** A 7-month fixed deadline suits an incremental or waterfall-with-milestones approach. You must decide the plan; AI can draft a work breakdown, suggest milestones, and generate checklists. But prioritisation — what to cut if time runs short — is a management judgement AI cannot own.

**Dependability.** Security, availability and data integrity matter most here. AI can suggest encryption patterns, backup schedules, and audit-log schemas. It cannot certify that your system is secure, nor accept liability when 10,000 students' records leak. Human review, threat modelling and penetration testing remain mandatory.

**Requirements management.** Traceability between requirements and design is essential. AI can help elicit questions, spot contradictions, and draft a traceability matrix. But only the project manager can resolve conflicting stakeholder needs or sign off scope changes.

**Reuse.** Reusing proven components (authentication libraries, logging frameworks, database engines) reduces risk within 7 months. AI can recommend candidates and compare trade-offs. Selecting, licensing and integrating them — and judging their fitness for a sensitive context — is an engineering decision.

## AI: Allowed vs. Prohibited

| Safe for AI | Dangerous / prohibited |
|---|---|
| Boilerplate, documentation, test ideas | Final security architecture and access-control policy |
| Code review suggestions | Production data handling, credential management |
| Drafting ER diagrams, log formats | Approving role permissions or audit retention rules |
| Estimating effort, listing risks | Sign-off on compliance and data-protection obligations |

Using AI to *decide* access rights, encryption keys, or retention policy could cause serious harm and accountability failures — no AI can be blamed in a post-incident review.

## Trade-offs and Claims to Verify

A central database simplifies access but creates a single point of failure. Role-based access improves security but adds administrative overhead. Cross-device access boosts usability but widens the attack surface. A 10-year log aids accountability but raises storage, privacy and legal questions. **Verify:** data-protection laws applicable in your jurisdiction and era; retention limits; whether students consent to messaging being logged; realistic timeline for 10,000 records; and who holds admin rights. Treat your five ideas as hypotheses, not settled design..
```

**Response:**

```text
# Review of Your Draft Against the Chosen Question and Scenario

Below I've separated concerns into **inaccuracies**, **missing reasoning**, **vague claims**, and **unsupported assumptions**, with why each matters and how you could check it. I've also added counterexamples/alternative interpretations where useful. I have not rewritten the answer.

---

## 1. Inaccuracies

**1.1 "A 1990s setting means no smartphones or modern web browsers, so 'any device' may mean campus terminals or early PCs."**
- **Why it matters:** The draft flags a tension but then treats it as settled that cross-device access is anachronistic. This is an overcorrection. The scenario says "cross-device access" was *your* assumption, not a stated requirement, so the draft is partly right to question it — but it frames the 1990s as if networked campus PCs and X-terminals didn't exist, which is inaccurate. By the mid-1990s, universities widely ran LANs, Unix workstations, and early web (NCSA Mosaic, Netscape). "Any device" could plausibly mean any *campus-networked terminal*, not smartphones.
- **How to check:** Confirm the exact year (1990 vs. 1999 matters enormously — the WWW went public in 1991, Windows 95 in 1995). Check whether the brief implies a client–server or mainframe architecture, and whether "device" in the scenario meant end-user hardware or just access points.
- **Counterexample/alternative:** A 1997 university could legitimately deploy a browser-based system accessible from any lab PC. So the draft's claim that the 1990s context "changes everything downstream" is too strong; it changes *some* things (no mobile, limited bandwidth, no cloud), but not the core requirements engineering.

**1.2 The AI allowed/prohibited table presents "Final security architecture" and "Production data handling" as flatly prohibited.**
- **Why it matters:** This conflates *using AI to decide* with *using AI to assist*. Many organisations in 2024–2026 allow AI to draft security architecture proposals, threat models, and even credential-rotation scripts, subject to human review. Calling these "prohibited" is an overstatement unless the scenario or a policy says so. The scenario asks *where it is allowed and where it is prohibited* — the draft answers with a binary that isn't derived from the brief.
- **How to check:** Look for an explicit AI-use policy in the scenario (there isn't one). Then decide whether you're arguing from engineering ethics (human accountability) or from a specific governance framework (e.g., EU AI Act, ISO/IEC 42001). The draft implies the latter without citing it.
- **Counterexample:** An AI could legitimately generate a *candidate* encryption scheme for review; the prohibition is on *approving* it without human sign-off. The draft's own wording ("Using AI to *decide*...") actually supports this softer reading, but the table's header ("Dangerous / prohibited") contradicts it.

**1.3 "No AI can be blamed in a post-incident review."**
- **Why it matters:** This is rhetorically strong but legally and organisationally imprecise. Accountability frameworks (e.g., RACI, ISO 27001) place blame on *roles*, and an AI tool can be a named contributor in an incident report even if it can't hold legal liability. Saying "no AI can be blamed" could mislead the reader into thinking AI use is automatically blame-shifting, which is the opposite of good governance.
- **How to check:** Review your institution's incident-response and AI-governance policies. Distinguish *liability* (human/org) from *causal attribution* (can include AI).
- **Counterexample:** A post-incident review might conclude "the AI-generated access-control matrix was accepted without review" — that's blaming the *process*, not the AI, but it still names the AI's output.

---

## 2. Missing Reasoning

**2.1 The four principles are applied thinly and unevenly.**
- **Why it matters:** The question explicitly asks you to "apply process, dependability, requirements management and reuse." The draft gives each one short paragraph, but:
  - **Process:** Doesn't address the 7-month constraint against 10,000 students / 100 workers. No discussion of team size, parallel workstreams, or why incremental beats waterfall (or vice versa) *given the deadline*. The claim "suits an incremental or waterfall-with-milestones approach" is asserted, not argued.
  - **Dependability:** Mentions security, availability, integrity but omits *maintainability* and *safety* (dependability's usual sub-attributes). No discussion of how 1990s hardware limits redundancy or backup.
  - **Requirements management:** Doesn't address *elicitation* from four distinct user groups (PM, dev, QA, end user) with conflicting needs. No mention of how requirements will be validated or baselined.
  - **Reuse:** Mentions libraries but not *legal/licensing* constraints of the 1990s (proprietary compilers, no open-source ecosystem as we know it), nor *architectural* reuse (e.g., reusing an existing student-records format).
- **How to check:** For each principle, ask: "What decision does this principle force, and who owns it?" If the draft doesn't name the decision or owner, it's underdeveloped.
- **Counterexample:** Under *reuse*, a 1990s team might reuse the university's existing mainframe COBOL modules — a very different trade-off from today's npm packages. The draft's "authentication libraries, logging frameworks" framing is anachronistic.

**2.2 No explicit mapping from AI capabilities to the four user roles.**
- **Why it matters:** The scenario names four users (PM, developer, QA, end user). The draft's AI table is role-agnostic. The question asks *where AI is allowed and prohibited* — the answer likely differs by role (e.g., AI-assisted test generation for QA vs. AI-assisted requirements prioritisation for PM). Omitting this loses the scenario's specificity.
- **How to check:** Build a 4×2 matrix (role × allowed/prohibited) and see which cells the draft fills. Most are empty.
- **Counterexample:** AI might be allowed to help a developer write boilerplate but prohibited from letting an end user query student records directly — a distinction the draft doesn't make.

**2.3 The risk (data leak) is stated but not traced through the principles.**
- **Why it matters:** The scenario's core risk is personal-data leakage. The draft mentions it in Dependability but doesn't connect it to *requirements management* (e.g., privacy requirements, data-minimisation), *process* (e.g., security gates in the schedule), or *reuse* (e.g., reusing a hardened auth module vs. rolling your own). The risk should be the spine of the analysis.
- **How to check:** For each principle, ask "How does this reduce or exacerbate the leak risk?" If you can't answer, the application is incomplete.
- **Counterexample:** Reusing a vetted access-control library might *reduce* leak risk; reusing an outdated one might *increase* it. The draft doesn't distinguish.

---

## 3. Vague Claims

**3.1 "AI can suggest encryption patterns, backup schedules, and audit-log schemas."**
- **Vague because:** Which encryption? In the 1990s, export controls (e.g., US ITAR/EAR) limited strong crypto. "Backup schedules" depend on tape rotation, off-site storage, and budget — none discussed. "Audit-log schemas" depend on retention law, which the draft later says to verify but doesn't specify.
- **Why it matters:** Without specifics, the claim can't be evaluated or acted on. It also risks being anachronistic (modern AI suggesting AES-256 in a 1990s context).
- **How to check:** Pick one concrete example (e.g., DES vs. RSA in 1995) and see if the AI's suggestion would have been legal and feasible then.
- **Counterexample:** An AI in 1995 might suggest DES, which was already weakening; a human engineer must decide whether to use triple-DES or wait for AES (1998+).

**3.2 "AI can help elicit questions, spot contradictions, and draft a traceability matrix."**
- **Vague because:** "Elicit questions" — from whom? "Spot contradictions" — against what baseline? "Draft a traceability matrix" — linking what to what? The claim is plausible but untestable as written.
- **Why it matters:** Requirements management is the principle most likely to be audited (traceability is a compliance artefact). Vague claims here undermine the answer's credibility.
- **How to check:** Ask whether the AI output would be *accepted* by a requirements engineer without rework. If yes, specify the input/output format.
- **Counterexample:** AI might draft a matrix linking requirements to test cases, but if requirements are still in flux (likely in month 1 of 7), the matrix is premature.

**3.3 "A central database simplifies access but creates a single point of failure."**
- **Vague because:** "Simplifies access" for whom? "Single point of failure" — in 1990s terms, this could mean a mainframe outage, a network partition, or a corrupted tape. The trade-off is real but underspecified.
- **Why it matters:** The scenario's constraint is *security*, not availability. A single point of failure may be an acceptable risk if the deadline is tight and the threat model is external intrusion, not hardware failure.
- **How to check:** Define the failure modes you care about (confidentiality vs. availability vs. integrity) and re-evaluate.
- **Counterexample:** A central mainframe with strict access control might be *more* secure than distributed PCs with local copies of student data — the opposite of the draft's implication.

---

## 4. Unsupported Assumptions

**4.1 The draft assumes "one central database with sub-databases" is the user's assumption.**
- **Why it matters:** The scenario doesn't say this. The draft's "Facts vs. Assumptions" section attributes design decisions to the user that may not be theirs. If this is a tutor analysis, misattributing assumptions weakens the critique.
- **How to check:** Re-read the scenario. If the assumption isn't there, either remove it or label it as *your* inference, not the user's.
- **Counterexample:** The scenario says data is in "paper, spreadsheets" — a plausible design is a distributed file system or even a mainframe VSAM store, not a relational DB with sub-databases.

**4.2 The draft assumes AI is a modern LLM (chatbot-style).**
- **Why it matters:** In a 1990s scenario, "AI" could mean expert systems, rule-based systems, or even simple automation. The draft's AI capabilities (drafting ER diagrams, suggesting encryption) are anachronistic for 1990s AI. If the question is about *today's* AI applied to a *1990s-style project*, say so; if it's about 1990s AI, the analysis is wrong.
- **How to check:** Clarify the temporal frame: Is the AI a 2020s tool being used to *simulate* a 1990s project, or is the whole scenario in the 1990s? The question's phrasing ("Evaluate what AI can assist with") suggests the former, but the draft doesn't state it.
- **Counterexample:** A 1990s expert system could help with *rule-based* access control, but not with drafting prose documentation. The draft's examples assume modern generative AI.

**4.3 The draft assumes "10-year audit log" is a user assumption.**
- **Why it matters:** Again, not in the scenario. If it's the draft's own idea, it should be presented as a design option, not a user assumption. Ten years is also arbitrary — retention law might require 3, 5, or 7 years.
- **How to check:** Trace the 10-year figure to a source (law, policy, or the scenario). If none, label it as an illustrative example.
- **Counterexample:** In some jurisdictions, student records must be kept for 50+ years; in others, 3 years. The number matters for storage and privacy.

**4.4 The draft assumes "role-based access" is the user's assumption.**
- **Why it matters:** RBAC is a design pattern, not a requirement. The scenario says "not all workers have access" — that's a requirement for *access control*, but not necessarily RBAC. It could be MAC (mandatory access control), DAC, or even physical keys in the 1990s.
- **How to check:** Ask whether the scenario specifies *how* access is differentiated. If not, RBAC is your proposal, not their assumption.
- **Counterexample:** A 1990s university might use a simple "staff vs. faculty vs. admin" Unix group model — not formal RBAC.

**4.5 The draft assumes AI can "estimate effort, list risks."**
- **Why it matters:** Effort estimation is notoriously context-dependent (team skill, tech stack, domain). AI can *assist* by analogy, but the claim implies more reliability than is warranted, especially for a 1990s tech stack it may not know well.
- **How to check:** Ask whether the AI's estimate would be within ±50% of a human's. If not, the claim is overstated.
- **Counterexample:** AI trained on modern Agile projects may give poor estimates for a 1990s waterfall mainframe project.

---

## 5. Structural / Framing Concerns

**5.1 The draft answers a slightly different question than the one asked.**
- **Why it matters:** The question asks you to "apply process, dependability, requirements management and reuse to your scenario" and "evaluate what AI can assist with and what engineers must still decide." The draft does this, but it front-loads "Facts vs. Assumptions" and a 1990s sidebar before the four principles, which pushes the actual application late. The question's emphasis is on the *principles*, not on fact-checking the scenario.
- **How to check:** Re-read the question and mark where each required element is addressed. If the principles section is shorter than the framing section, rebalance.
- **Counterexample:** A stronger structure might be: Principle → AI role → Engineer decision → Scenario-specific example → Risk linkage.

**5.2 The "Trade-offs and Claims to Verify" section is a catch-all that weakens the conclusion.**
- **Why it matters:** Ending with "Treat your five ideas as hypotheses" is good epistemic hygiene, but it also signals that the analysis hasn't reached conclusions. The question asks you to *evaluate*, which implies a stance. The draft hedges on almost every point.
- **How to check:** For each trade-off, ask "What would I recommend, and why?" If you can't answer, the analysis is incomplete.
- **Counterexample:** A firmer conclusion might be: "Given the 7-month deadline and leak risk, prioritise a centralised, access-controlled system with reused auth components; defer cross-device access and messaging to phase 2."

**5.3 No mention of verification/validation of AI outputs.**
- **Why it matters:** The question asks where AI is *allowed* and where it's *prohibited*. A key middle ground — AI allowed with human verification — is implied but not systematised. The draft says "human review... mandatory" for dependability but doesn't generalise this as a governance principle.
- **How to check:** Define a verification gate for each AI use (e.g., "AI-drafted test cases must be reviewed by QA before execution").
- **Counterexample:** AI-generated boilerplate might need only a lint check; AI-generated access-control policy needs sign-off by the PM and security lead.

---

## 6. Quick Checklist for Revision

| Concern | Why it matters | How to check | Counterexample / alternative |
|---|---|---|---|
| 1990s "no devices" claim | Anachronistic; ignores LANs/early web | Confirm exact year; check architecture | 1997 browser-based system on lab PCs |
| Binary "prohibited" table | Overstates; ignores assisted-with-review | Check for AI policy; distinguish decide vs. assist | AI drafts encryption for human approval |
| "No AI can be blamed" | Confuses liability with attribution | Review incident-response policy | AI named as contributor in report |
| Thin principle application | Fails the question's core ask | Map each principle to decision + owner | Reuse: COBOL modules vs. npm |
| No role mapping | Loses scenario specificity | Build role × allowed/prohibited matrix | QA vs. PM vs. end user differ |
| Risk not traced | Core risk (leak) underused | Ask per principle: does this reduce leak risk? | Reuse can increase or decrease risk |
| Vague AI claims | Untestable, anachronistic | Specify input/output, era-appropriate tech | DES vs. AES in 1995 |
| Assumptions misattributed | Weakens critique | Re-read scenario; label inferences | RBAC is a proposal, not a given |
| Hedged conclusion | Question asks for evaluation | For each trade-off, state a recommendation | Prioritise centralised + reused auth |
| No verification gate | Middle ground missing | Define review per AI use | Lint for boilerplate; sign-off for policy |

---

## 7. What to Do Next (Without Rewriting Yet)

1. **Clarify the temporal frame** — is the AI modern or 1990s? This changes everything.
2. **Re-read the scenario** and strike any "user assumption" not actually stated.
3. **For each of the four principles**, write one sentence: "The decision is X; the owner is Y; AI can assist by Z; the risk if AI overreaches is W."
4. **Build the role × AI-use matrix** to satisfy the scenario's four users.
5. **Trace the leak risk** through each principle.
6. **Replace vague claims** with one concrete, era-appropriate example each.
7. **End with a recommendation**, not just a list of hypotheses.

Once you've done this, the draft will be ready to rewrite with a clear, defensible stance that directly answers the question.
```

### B3 — Revision (Prompt C)

- **Tool:** DeepSeek
- **Model:** not displayed
- **Date:** 2026-10-11
- **Purpose:** revision using my decisions and verified evidence

**Prompt:**

```text
Revise the draft using my review decisions and source notes below. Keep the answer relevant to my scenario and preserve uncertainty where evidence is limited.

My decisions: [ A 1990s setting excludes smartphones but not networked campus terminals; by the mid-1990s, LANs, Unix workstations, and early web browsers were common. 'Any device' plausibly means any campus-networked terminal.; AI cannot hold legal liability, but its output can be named as a causal contributor in an incident report. Accountability remains with human roles; AI may assist by drafting candidate architectures or threat models; human sign-off is required before adoption. Prohibited only where AI acts without human review.]. Verified evidence: [A 1990s setting means no smartphones or modern web browsers, so 'any device' may mean campus terminals or early PCs. | W3C, "A Little History of the World Wide Web," https://www.w3.org/History.html (accessed 2026-10-11) | university LANs and Unix workstations were common by the mid-1990s. "Any device" could mean any campus-networked terminal, not only a PC;SO/IEC 27001:2022, Clause 5.3 (roles, responsibilities and authorities) and Annex A.5.24 (incident management); NIST AI RMF 1.0 (2023) | Accountability is assigned to human roles. An AI tool cannot hold legal liability, but its output can be named as a causal contributor in an incident report | qualify;Scenario asks where AI is allowed and prohibited; the original binary ignored the middle ground of assisted-with-review and lost the four-role specificity.]. Draft: [# Tutor Analysis: Fundamental Engineering Principles in Your University Management System Scenario

## Facts vs. Assumptions

**Given facts (from your brief):** 7-month deadline; 10,000 students; 100 workers; security requirement; risk of personal data leak; 1990s context. **Your assumptions:** one central database with sub-databases; role-based access; internal messaging; cross-device access; 10-year audit log. These are design decisions, not requirements — verify them with stakeholders before committing. Also note a hidden tension: a 1990s setting means no smartphones or modern web browsers, so "any device" may mean campus terminals or early PCs. Clarify this, as it changes everything downstream.

## Applying the Four Principles

**Process.** A 7-month fixed deadline suits an incremental or waterfall-with-milestones approach. You must decide the plan; AI can draft a work breakdown, suggest milestones, and generate checklists. But prioritisation — what to cut if time runs short — is a management judgement AI cannot own.

**Dependability.** Security, availability and data integrity matter most here. AI can suggest encryption patterns, backup schedules, and audit-log schemas. It cannot certify that your system is secure, nor accept liability when 10,000 students' records leak. Human review, threat modelling and penetration testing remain mandatory.

**Requirements management.** Traceability between requirements and design is essential. AI can help elicit questions, spot contradictions, and draft a traceability matrix. But only the project manager can resolve conflicting stakeholder needs or sign off scope changes.

**Reuse.** Reusing proven components (authentication libraries, logging frameworks, database engines) reduces risk within 7 months. AI can recommend candidates and compare trade-offs. Selecting, licensing and integrating them — and judging their fitness for a sensitive context — is an engineering decision.

## AI: Allowed vs. Prohibited

| Safe for AI | Dangerous / prohibited |
|---|---|
| Boilerplate, documentation, test ideas | Final security architecture and access-control policy |
| Code review suggestions | Production data handling, credential management |
| Drafting ER diagrams, log formats | Approving role permissions or audit retention rules |
| Estimating effort, listing risks | Sign-off on compliance and data-protection obligations |

Using AI to *decide* access rights, encryption keys, or retention policy could cause serious harm and accountability failures — no AI can be blamed in a post-incident review.

## Trade-offs and Claims to Verify

A central database simplifies access but creates a single point of failure. Role-based access improves security but adds administrative overhead. Cross-device access boosts usability but widens the attack surface. A 10-year log aids accountability but raises storage, privacy and legal questions. **Verify:** data-protection laws applicable in your jurisdiction and era; retention limits; whether students consent to messaging being logged; realistic timeline for 10,000 records; and who holds admin rights. Treat your five ideas as hypotheses, not settled design.].

Show what you changed and why. Use only the sources I supplied. Flag remaining gaps instead of inventing details.
```

**Response:**

```text
# Revised Draft

## Tutor Analysis: Fundamental Engineering Principles in Your University Management System Scenario

### Facts vs. assumptions

**Given facts:** 7-month deadline; 10,000 students; 100 workers; security requirement; risk of personal data leak; 1990s context.

**Your assumptions:** one central database with sub-databases; role-based access; internal messaging; cross-device access; 10-year audit log. These are design decisions, not requirements. Verify them with stakeholders before committing.

**1990s constraint — qualify, do not overstate.** A 1990s setting excludes smartphones. It does **not** exclude networked campus terminals. By the mid-1990s, early web browsers existed (W3C, “A Little History of the World Wide Web”), and your verified evidence places LANs and Unix workstations as common. So “any device” is best read as plausibly meaning **any campus-networked terminal**, possibly including early PCs — not a smartphone or modern browser. Clarify the campus device mix, because it changes UI, access-control, and testing assumptions downstream.

### Applying the four principles

**Process.** A 7-month fixed deadline suits an incremental or waterfall-with-milestones approach. AI may draft a work breakdown, suggest milestones, and generate checklists. But prioritisation — what to cut if time runs short — is a human management judgement. Human sign-off is required.

**Dependability.** Security, availability, and data integrity matter most. AI may draft candidate threat models, encryption patterns, backup schedules, and audit-log schemas. It cannot certify that the system is secure, and it cannot hold legal liability. If an incident occurs, AI output can be named as a causal contributor in the incident report, but accountability remains with human roles (ISO/IEC 27001:2022, Clause 5.3; Annex A.5.24; NIST AI RMF 1.0). Human review, threat modelling, and penetration testing remain mandatory.

**Requirements management.** Traceability between requirements and design is essential. AI may help elicit questions, spot contradictions, and draft a traceability matrix. Only the relevant human role can resolve conflicting stakeholder needs or sign off scope changes.

**Reuse.** Reusing proven components — authentication libraries, logging frameworks, database engines — reduces risk within 7 months. AI may recommend candidates and compare trade-offs. Selecting, licensing, integrating, and judging fitness for a sensitive context remains a human engineering decision.

### AI: allowed, human sign-off, and prohibited

The original “safe vs. dangerous” binary is too coarse. The correct distinction is: AI may assist, but prohibited only where AI acts **without human review**.

| AI may assist — human review required | Human sign-off required before adoption | Prohibited |
|---|---|---|
| Drafting candidate architectures and threat models | Final security architecture and access-control policy | AI acting without human review in any sensitive area |
| Boilerplate, documentation, test ideas | Approving role permissions or audit retention rules | Autonomous AI decisions on access rights, encryption keys, or retention policy |
| Code-review suggestions | Production data handling and credential management | AI-only sign-off on compliance and data-protection obligations |
| Drafting ER diagrams, log formats | Compliance and data-protection obligations | AI acting as the accountable party in an incident report |
| Estimating effort, listing risks | Adoption of any AI-drafted design | Any AI use where the responsible human role is bypassed |

AI cannot hold legal liability, but its output can be named as a causal contributor in an incident report. Accountability remains assigned to human roles, consistent with ISO/IEC 27001:2022 Clause 5.3 and NIST AI RMF 1.0.

### Role-specific accountability

Your review notes call for four-role specificity. The supplied sources do not name those four roles, so I have not invented them. Preserve the four roles from your scenario and map each decision as follows:

| Accountable human role | AI may assist with | Human review/sign-off | Prohibited |
|---|---|---|---|
| Role 1: [insert] | [drafting only] | [named sign-off] | AI action without this role’s review |
| Role 2: [insert] | [drafting only] | [named sign-off] | AI action without this role’s review |
| Role 3: [insert] | [drafting only] | [named sign-off] | AI action without this role’s review |
| Role 4: [insert] | [drafting only] | [named sign-off] | AI action without this role’s review |

Do not collapse these into a generic “human review.” Name the role, the review artefact, and the sign-off authority.

### Trade-offs and claims to verify

A central database simplifies access but creates a single point of failure. Role-based access improves security but adds administrative overhead. Cross-device access boosts usability but widens the attack surface. A 10-year log aids accountability but raises storage, privacy, and legal questions.

**Verify:** data-protection laws applicable in your jurisdiction and era; retention limits; whether students consent to messaging being logged; realistic timeline for 10,000 records; who holds admin rights; campus network and device mix; and whether terminals, early PCs, or both must be supported. Treat your five design ideas as hypotheses, not settled design.

---

## What I changed and why

1. **1990s constraint corrected.**  
   Changed “no smartphones or modern web browsers” to “no smartphones; early web browsers possible by mid-1990s; ‘any device’ may mean campus-networked terminals.”  
   *Why:* Your decision and W3C history support early web browsers; your verified evidence places LANs and Unix workstations as common.

2. **AI binary replaced with three tiers.**  
   Changed “Safe for AI / Dangerous or prohibited” to “AI may assist — human review required / Human sign-off required / Prohibited.”  
   *Why:* You specified prohibited only where AI acts without human review. The original binary lost the assisted-with-review middle ground.

3. **Liability wording corrected.**  
   Changed “no AI can be blamed in a post-incident review” to “AI cannot hold legal liability; its output may be named as a causal contributor; human roles remain accountable.”  
   *Why:* This matches your decision and the accountability framing in ISO/IEC 27001:2022 Clause 5.3, Annex A.5.24, and NIST AI RMF 1.0.

4. **Four-role specificity preserved as placeholders.**  
   Added a role-accountability template rather than collapsing to generic human review.  
   *Why:* Your notes say the original lost four-role specificity, but the supplied sources do not name the four roles. I did not invent them.

5. **Sources limited to those supplied.**  
   Added citations only to W3C, ISO/IEC 27001:2022, and NIST AI RMF 1.0. No external sources were introduced.

6. **Uncertainty preserved.**  
   Flagged unresolved items: exact device mix, jurisdiction/era data-protection law, consent for logged messaging, retention limits, admin rights, and the names of the four accountable roles.

## Remaining gaps

- The four human roles are not named in the supplied notes.
- Exact 1990s year and jurisdiction are not supplied, so applicable data-protection law is uncertain.
- Campus network and device mix is uncertain: terminals, early PCs, or both.
- Whether a 10-year audit log is lawful or consented is unresolved.
- ISO/IEC 27001:2022 and NIST AI RMF 1.0 are modern sources. They are useful analytical benchmarks, but they are not period documents for a 1990s setting. Do not claim the 1990s project complied with them.
```

## 9. Appendix C — Evidence tables

### Verification table

| AI claim | Source and locator | Evidence found | Decision |
| --- | --- | --- | --- |
| A 1990s setting means no smartphones or modern web browsers, so 'any device' may mean campus terminals or early PCs. | W3C, "A Little History of the World Wide Web," https://www.w3.org/History.html (accessed 2026-10-11) | university LANs and Unix workstations were common by the mid-1990s. "Any device" could mean any campus-networked terminal, not only a PC | qualify |
| No AI can be blamed in a post-incident review. | SO/IEC 27001:2022, Clause 5.3 (roles, responsibilities and authorities) and Annex A.5.24 (incident management); NIST AI RMF 1.0 (2023) | Accountability is assigned to human roles. An AI tool cannot hold legal liability, but its output can be named as a causal contributor in an incident report | qualify |

### Change log

| AI wording / suggestion | Your final version | Reason for change |
| --- | --- | --- |
| A 1990s setting means no smartphones or modern web browsers, so 'any device' may mean campus terminals or early PCs. | A 1990s setting excludes smartphones but not networked campus terminals; by the mid-1990s, LANs, Unix workstations, and early web browsers were common. 'Any device' plausibly means any campus-networked terminal. | Verification row 1 |
| No AI can be blamed in a post-incident review. | AI cannot hold legal liability, but its output can be named as a causal contributor in an incident report. Accountability remains with human roles | Verification row 2 |
| "Dangerous / prohibited" for final security architecture and production data handling. | AI may assist by drafting candidate architectures or threat models; human sign-off is required before adoption. Prohibited only where AI acts without human review. | Scenario asks where AI is allowed and prohibited; the original binary ignored the middle ground of assisted-with-review and lost the four-role specificity. |
