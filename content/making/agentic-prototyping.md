---
title: Prototyping with agentic AI
summary: Raising the ceiling on what I can build myself, and staying the one who decides.
year: "2025–present"
draft: false
featured: true
categories:
  - making
tags:
  - ai
  - agentic-tools
  - python
  - git
  - google-apps-script
tools:
  - Agentic coding tools
  - Git and GitHub
  - Python
  - Google Apps Script
links:
  - label: Literature search tool (GitHub)
    url: https://github.com/jrobinson-uk/Literature-Search
  - label: CEFR vocabulary analyser (GitHub)
    url: https://github.com/jrobinson-uk/CEFR_script
---

## The question

I program, but as an amateur. I know what is technically possible, I can work with an API
and I can read a codebase. What I have not had is the throughput to get my own ideas to a
state where somebody else can react to them — for years the pattern was that I knew what
I wanted built and handed the building to someone else.

Could agentic tooling close that gap? Not to do the thinking, but to raise the ceiling on
what I can reach on my own.

## What I made

Mostly prototypes whose job is to make an idea real enough to judge. Some get picked up
and rebuilt properly by people who do this for a living. Some stay rough, because they
point inward and rough is fine when the value is in the doing.

Two of them are public.

A **literature search tool** that runs inside Google Sheets. Give it terms and it
searches, then chases citations outward — snowball sampling — assembling what it finds
into a spreadsheet you can actually work in. The Apps Script behind it was agent-written.

A **CEFR vocabulary analyser** that reads definition text and flags any word above a
target language level, so glossary entries can be checked against a readability standard
rather than against a hunch. It reports the proportion of words within level, the ones
that breached it, and the highest level found.

The second is worth a note, because it makes the distinction I care about. The analyser
contains no AI at all: it wraps a reference dataset and returns the same answer every
time. The agent built the tool; the tool is deterministic. For something whose job is to
judge whether learning material is readable, "the same input gives the same answer" is a
requirement rather than a nicety, and that was a decision, not an accident.

The rest isn't mine to show — small tools that sit alongside software a team already uses,
prototypes exploring how these models might work inside products, and an authoring
pipeline that replaces a manual InDesign process with a text-based one: typesetting as
source, history in Git, several tools in a single workflow.

## What I learned

The method matters more than the speed.

Pairing the agent with Git and GitHub is what made it work. The agent sees the whole
codebase rather than the fragment I remembered to paste, which removes most of its bad
decisions at a stroke. And the changes arrive staged and stepped, so each one can be read,
kept or thrown away. That is what heads off the regressions and the quiet
misunderstandings that vibe coding is famous for.

The rest is knowing where I sit. I stay the designer and the decision maker, and the
judgement that actually matters is when to let the agent run and decide things for itself,
against when to make it stop and check. Get that wrong one way and you are typing
everything yourself. Get it wrong the other way and you are reviewing a large amount of
confident, plausible work that nobody asked for.

Moving fast with these tools is not the skill. Moving fast and catching the failures is
the skill.
