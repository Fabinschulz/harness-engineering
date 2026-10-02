# Explicit source of truth

The most common origin of a confident wrong conclusion is confusing **two different questions** that have
different truth hierarchies.

## Axis A — "what does the system do today?"

For debugging, QA, diagnosis, and behavior review:

1. Observed execution — command output, log, real HTTP response, navigated screen
2. Current code
3. Tests that pass today
4. Documentation — describes intent, does not guarantee behavior

## Axis B — "what should the system do?"

For implementation, design, and conformance review:

1. Recorded structural decisions (ADRs)
2. Spec/design of the active feature
3. Project conventions (skills)
4. Governance documents
5. Memory from previous sessions — historical context, not norm
6. The agent's own inference — always last, always labeled

## The rule that matters

**When the axes diverge** — the code does X, the decision called for Y — this is **not** merged or resolved
silently. It is a finding. Report it as a divergence, say which axis you are following and why, and hand the
decision back to the human when the fix is not obvious.

**Age rule:** a fact from memory or an old document describes what was true when it was written. Before acting
on it, confirm against Axis A. A fact that has aged misleads with confidence.
