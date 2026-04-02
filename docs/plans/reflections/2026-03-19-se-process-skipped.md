---
date: 2026-03-19
sprint: N/A
category: ignored-instruction
---

## What Happened

The stakeholder asked to fix a bug (TA/student sync) and add a feature
(sortable table columns across the app). The agent implemented both changes
directly — editing files, writing code, and verifying TypeScript — without
initiating the CLASI SE process.

## What Should Have Happened

Per `CLAUDE.md` and `AGENTS.md`, the SE process is the default for any code
change. The agent should have:

1. Called `get_se_overview()` or invoked `/se` to enter the process
2. Created a sprint with requirements and tickets for both the bug fix and the
   feature request
3. Executed the tickets through the ticketing → implementation → review flow
4. Marked tickets done before delivering the work

The only exception is when the stakeholder explicitly says "out of process"
or "direct change" — which did not happen here.

## Root Cause

**Ignored instruction.** The rule is clear and prominent in both `CLAUDE.md`
and `AGENTS.md`. The agent prioritised responding quickly to a conversational
request and treated the changes as small/tactical, implicitly deciding the
process overhead wasn't worth it. That decision was not the agent's to make.

## Proposed Fix

Stronger internal trigger: any time the agent is about to edit source files
in response to a feature/bug request, it must first check whether the SE
process has been initiated for this work. If not, initiate it before writing
any code.

The instruction does not need rewording — it is already unambiguous. The fix
is behavioral: treat the SE process as a hard prerequisite to code changes,
not an optional wrapper.
