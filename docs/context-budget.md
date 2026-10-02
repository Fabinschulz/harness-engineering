# Context budget

A large window is not a license to fill it. What flows between steps is the **Working Context**, not the entire
conversation: the executor receives this and the request, not the history of the investigation that produced it.

```text
TASK                  # one sentence: what is being done
GOAL                  # the observable result that closes the task
CONSTRAINTS           # architecture, closed stack, authorization, YAGNI
ACCEPTANCE_CRITERIA   # from the spec when one exists; otherwise derived and confirmed with the human
FACTS                 # each with its reference
EVIDENCE              # commands run and results
DECISIONS             # what has been decided and is not reopened without a new reason
ASSUMPTIONS           # explicit, never promoted to fact
OPEN_QUESTIONS        # what still blocks
RISKS                 # what could go wrong and the signal that reveals it
RELEVANT_FILES        # paths — never pasted content
```

## Rules

- **Nothing enters without justifying its presence.** If removing the line changes no decision for the executor, the line goes.
- **Paths, not content.** The agent can read; pasting a file into context pays twice for the same information.
- **It does not grow monotonically.** At each synthesis, what was superseded leaves: an answered `OPEN_QUESTION`
  becomes a `FACT` or `DECISION`; a `RISK` that did not materialize disappears.

## Budget per role

| Step | Receives | Never receives |
| --- | --- | --- |
| **Planning** | The request + the prior Working Context | The entire session |
| **Retrieval** | One bounded question | The context of the execution that motivated it |
| **Execution** | Task Brief + Working Context + paths + its skill | Raw reports from previous agents |
| **Synthesis** | Only the report from the step that just ran | Already-synthesized reports |
| **Verification** | Diff/result + Working Context + acceptance criteria | The investigation that led to the result |

## Context decay

| Layer | What it is |
| --- | --- |
| **HOT** | Directly tied to the current task — paid on every task, so only what is always true |
| **WARM** | Relevant to the domain, loaded on entering it |
| **COLD** | Retrievable on demand, never automatic |
| **ARCHIVED** | Only by explicit search |
