# Orchestration with a gate

Orchestration lives on the thread that holds the delegation tool — not inside a sub-agent, which could only
recommend, not delegate.

## The cycle

```text
PLAN → RETRIEVE → EXECUTE → SYNTHESIZE → VERIFY → DECIDE
          ↑                                        │
          └──────────── replan with cause ─────────┘
```

Steps with no work to do are skipped. The cycle is the order, not a quota of steps.

### Plan

Decompose into ordered steps, **one** primary specialist per step, and write a short **Task Brief** before delegating:

```text
GOAL           # the observable result that closes the task
SCOPE          # what is in and, explicitly, what is out
CONSTRAINTS    # architecture, closed stack, authorization, YAGNI
CRITERIA       # how you know it is done — verifiable
MISSING        # what needs an answer before executing
NOT NEEDED     # available information this step must not drag along
```

The **NOT NEEDED** line is not decoration: it is where you cut the context that would exist by inertia.

### Synthesize

After each step, **extract — do not concatenate**. From the agent's report comes the Working Context update:
promote to fact what has evidence, keep an assumption as an assumption, remove what was superseded, and
**discard the raw text**. Without this step, each following delegation inherits everything before it — which is
exactly how the window degrades.

### Verify — with independence

The verifier receives the artifact, the Working Context, and the acceptance criteria. It does **not** receive the
executor's reasoning. A verifier that reads the executor's narrative tends to validate the narrative instead of
the artifact, and the value of the second opinion disappears.

## Confidence gate

| Situation | Decision |
| --- | --- |
| `HIGH`, no blocker | Advance or finish |
| `MEDIUM` | Advance **naming** the uncertainty; if it touches an irreversible cost, treat as `LOW` |
| `LOW`, or verification failed, or `blocked_by` set | **Do not advance.** Retrieve the missing evidence → verify → replan |

## Replanning is not retrying

Resending the same prompt after a failure is forbidden: without an identified cause, the second attempt has the
same odds of failing as the first, and twice the context. Each new attempt fixes a **named cause**:

1. Extract the concrete cause from `blocked_by` or the verification finding.
2. Retrieve only what is missing.
3. Update the Task Brief with the fix — and return only the **delta** to the executor.
4. Re-execute only the affected step.

**A decision that is the human's stays the human's:** a conflict between sources with no obvious resolution, an
irreversible cost in a gray zone, or a `LOW` that persists after retrieving — stop and ask, do not insist.
