# Evals

An eval here does not check the text of a response. It checks whether the response **followed the rules** —
because with an LLM the same question produces different responses, and several of them can be correct.

## Two kinds, in this order

1. **Static, without running the agent** — checks the form of the harness files (frontmatter, sections,
   allowlist, links). Zero cost, runs in CI on every PR that touches the harness. That is
   [`check-structure.mjs`](check-structure.mjs).
2. **Offline, over real executions** — reads the transcripts the harness already recorded and applies
   deterministic graders: is the contract block in the right format? did a read-only agent change files? did a
   `confidence: HIGH` come without executed validation? does an evidence line cite a file that does not exist?

Only after those two, and only when the problem is not decidable by regex, does the **LLM judge** come in — with
a versioned rubric and calibrated against human labels before it becomes a gate.

## The principle that keeps the eval honest

**An eval only enforces rules that are already written.** Every violation cites the document the rule comes from.
This way the eval does not become a second source of norms, competing with the conventions. A new rule is born in
the document; the eval comes after.

## Run

```bash
node evals/check-structure.mjs
```

Passes clean against this repository's examples. Inject an error into an agent in `examples/agents/` to see it fail.
