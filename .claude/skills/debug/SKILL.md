---
name: debug
description: 5-round systematic debugging — reproduce, root-cause, compare, fix, verify. Triggers on any error, build failure, or test failure. MUST follow all 5 rounds in order.
---

# Systematic Debugging (5 Rounds)

Execute ALL 5 rounds in order. No skipping. No shortcuts.

## Round 1: Reproduce & Context

**Goal**: Capture the exact error with full surrounding context.

### Actions
1. Re-run the failing command with full output
2. Capture: command, exit code, error message, stack trace, file paths, line numbers
3. Note the environment: OS, shell, Node version, working directory
4. Save raw log to `.claude/debug/$(date +%Y%m%d-%H%M%S).log`

### Output
```
ERROR: <brief description>
Command: <exact command>
Exit: <code>
File: <path>:<line>
Environment: <os> <shell> <node-version>
Log: .claude/debug/<timestamp>.log
```

---

## Round 2: Root Cause Analysis

**Goal**: Trace the error to its origin. Draw a causal chain.

### Actions
1. Start from the error message, trace backward through: stack trace → function call → input source
2. For each link in the chain ask: "What caused this to fail?"
3. Draw the chain as:
   ```
   [Symptom] ← [Direct Cause] ← [Underlying Cause] ← [Root Cause]
   ```
4. Check if this pattern matches any known issue in `.claude/skills/diagnose/SKILL.md`

### Output
```
Root Cause: <one sentence>
Causal Chain: A ← B ← C ← D
Known Pattern: <yes/no, match name>
```

---

## Round 3: Solution Comparison

**Goal**: Generate 3 distinct solutions, rank by effectiveness.

### Actions
For each solution, evaluate:
- **Effectiveness**: Does it fix the root cause or just the symptom?
- **Risk**: What could break? Blast radius?
- **Effort**: Time to implement, lines changed, files touched
- **Reversibility**: Easy to undo?

### Output (Table)
```
| # | Solution | Fixes Root? | Risk | Effort | Reversible |
|---|----------|-------------|------|--------|------------|
| 1 | <best>   | YES         | Low  | Small  | YES        |
| 2 | <alt>    | Partial     | Med  | Medium | YES        |
| 3 | <alt>    | Symptom     | High | Large  | NO         |

Verdict: #1 recommended because <reason>
```

---

## Round 4: Minimal Fix

**Goal**: Apply the smallest possible change that fixes the root cause.

### Actions
1. Target only the files identified in Round 2
2. Make the minimal change — one file, fewest lines possible
3. No refactoring, no cleanup of unrelated code, no "while I'm here"
4. Document what changed and why

### Output
```
Patch: <file> line <N>
- <old>
+ <new>
Reason: <why this fixes root cause>
```

---

## Round 5: Verify

**Goal**: Prove the fix works and nothing else broke.

### Actions
1. Reproduce original error → should NOT occur
2. Run full test suite → all pass
3. Run build → succeeds
4. Run linter → 0 new warnings
5. Run typecheck → 0 new errors

### Output
```
| Check | Before | After |
|-------|--------|-------|
| Error reproduces? | YES | NO |
| Tests pass? | 42/43 | 43/43 |
| Build OK? | FAIL | PASS |
| Lint OK? | 3 err | 0 err |
| Typecheck? | 1 err | 0 err |

VERDICT: FIXED / NEEDS MORE WORK
```

---

## Rule: Never Skip Rounds

If user says "just fix it" or "skip to the fix":
- Respond: "Round 1 complete. Moving to Round 2 for root cause."
- Never jump to fix without understanding why.

## Round 0: Pre-check (NEW)

Before Round 1, always run path safety check:
```bash
/diagnose  # auto-runs path-check + error pattern match
```
