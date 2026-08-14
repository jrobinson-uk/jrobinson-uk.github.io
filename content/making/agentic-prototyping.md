---
title: Prototyping with agentic AI
summary: Closing the gap between knowing what's technically possible and having a testable version of it.
draft: false
featured: true
categories:
  - making
tags:
  - ai
  - agentic-tools
  - python
  - git
tools:
  - Agentic coding tools
  - Git
  - Python
  - LaTeX and Overleaf
---

## The question

I had spent years knowing what was technically possible and handing the
implementation to someone else. Could agentic tooling close that gap far enough that
my own ideas reach a testable state?

## What I made

An agentic tool built to embody a specific programming pedagogy, produced through
design sprints as part of an AI working group iterating on the Code Editor.

A browser-side Python learning assistant, supporting learners who are working
alongside an AI tool.

An internal knowledge-base site, workspace plugins for team workflow, and a LaTeX and
Overleaf template reproducing an internal publication design — built to a standard
where it could be proposed as the default.

## What I learned

The method matters more than the speed.

I work in version control, so the agent's changes can be rolled back and
cherry-picked rather than accepted wholesale. I give it full-context access to the
codebase instead of pasting fragments, because most of its bad decisions come from
not being able to see the thing it's editing. And I build in explicit checks and
validation points, because what it produces needs verifying and I know what to
verify.

Moving fast with these tools is not the skill. Moving fast and catching the failures
is the skill.
