---
name: harness-contract
description: Cross-cutting contract — source-of-truth hierarchy, claim classification, confidence scale, structured output block, Working Context, and context budget. Read by the orchestrator and by every agent. One definition, many readers.
---

# Harness contract (reference example)

Rules for **how work flows between agents**: what counts as truth, what counts as evidence, how much context
each step receives, and what gets discarded.

It exists for a concrete reason: without a single source, each agent would reinvent its own confidence scale and
its own ordering of sources, and the orchestrator would have to reconcile different vocabularies at each step.

This contract's content is spread across this repository's documents:

- Source-of-truth hierarchy → [`docs/source-of-truth.md`](../../docs/source-of-truth.md)
- Claim classification, confidence scale, output block → [`docs/output-contract.md`](../../docs/output-contract.md)
- Working Context and per-step budget → [`docs/context-budget.md`](../../docs/context-budget.md)

In a real implementation, this is a single file the harness loads automatically when the situation fits, and that
each agent reads on startup.
