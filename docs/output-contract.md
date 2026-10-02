# Output contract

Every agent opens its output with a structured block, **before** the human-readable report. The report is still
the main deliverable for the human; the block exists so the orchestrator can synthesize without re-reading prose.

```yaml
confidence: HIGH | MEDIUM | LOW
evidence:
  - "src/handlers/create.ts:48 — validation read directly"
  - "npm test — 134 passed, 0 failed"
assumptions:
  - "none"             # or the assumption, with what would confirm it
open_questions:
  - "none"             # or the blocking question, addressed to whoever can answer it
blocked_by: null       # or the named cause, when the step could not complete
```

## Rules of the block

- It is **literal YAML**, with the keys and levels exactly as above — `confidence: HIGH`, never
  `**confidence:** high`. The orchestrator reads the level by machine; translation or bold text makes the gate
  fall into the "no confidence declared" case. *(This was a real defect, caught by audit: 6 of 38 responses came
  out off-format.)*
- `evidence` points to a **verifiable source** — path with symbol or line, command with result, navigated route.
  An opinion is not evidence.
- An empty `assumptions` means *no assumption was made*, not *I did not check*. When in doubt, write the assumption.
- `blocked_by` is what feeds replanning-with-cause — specific text, not "failed".

## Classifying claims

Every claim that supports a decision falls into one of these four categories:

| Label | Definition | Requires |
| --- | --- | --- |
| **FACT** | Verified directly in this execution | Reference: `file:symbol`, command + output, or a UI observation |
| **INFERENCE** | Deduced from facts, with an explicit logical step | Name the starting facts and the leap made |
| **ASSUMPTION** | Assumed from missing information | Stay explicit; never support an irreversible decision alone |
| **UNKNOWN** | Not known and not deducible | Name what is missing and how it would be obtained |

**Absolute prohibitions:** promoting an assumption to fact by repetition; presenting unknown as absence of a
problem ("I found nothing" ≠ "it does not exist"); describing a command as executed when it was not.

## Confidence scale

| Level | Criteria — all must hold |
| --- | --- |
| **HIGH** | Primary source read; validation executed with real output; every acceptance criterion verified; no contradiction between sources |
| **MEDIUM** | Partial evidence: inference from a neighboring pattern, validation that could not run, or one criterion without direct verification. The uncertainty is named |
| **LOW** | Insufficient information, sources in conflict, or an assumption supporting the main conclusion |

A single unverified acceptance criterion lowers confidence to MEDIUM. **Confidence is the weakest link, not the average.**
