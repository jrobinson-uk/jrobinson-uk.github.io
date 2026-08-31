---
title: Prototyping with agentic AI
summary: Raising the ceiling on what I can build myself, and staying the one who decides.
year: "2025–present"
draft: false
featured: false
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
and I can read a codebase. What I have not had is the capacity / capability to get my own ideas to a state where somebody else can react to them, for years the pattern was that I knew what
I wanted built but have been dependant on others to build it.

Could agentic tooling close that gap? Not to do the thinking, but to raise the ceiling on
what I can reach on my own.

## What I've made

Mostly prototypes whose job is to make an idea real enough to judge. Some get picked up
and rebuilt properly by people who do this for a living. Some stay rough, because they
point inward and rough is fine when the value is in the doing.

Two of them are shareable here:

### A **literature search tool** 

Runs inside Google Sheets. Give it terms and it searches, then chases citations outward,  snowball sampling, assembling what it finds into a spreadsheet you can actually work in. The Apps Script behind it was agent-written under my direction 

![The literature search tool running as a sidebar in Google Sheets. On the left, a results sheet with columns for Depth, Crawled, Year, Title, Authors and Type, filled with published papers on generative AI in computing education. On the right, a panel headed Citation Crawl sets out the pipeline — a venue sweep, then a keyword pass, then backward and forward citation passes, then a final sweep to retry missing abstracts — each stage writing to its own sheet. Below that, two hand-picked seed papers and a field for pasting a resume code.](assets/img/agentic-literature-search.png)

### CEFR vocabulary analyser

Present in a few projects, it reads definition / explanatory text and flags any word above a
target language level, so entries can be checked against a readability standard rather than against a hunch. It reports the proportion of words within level, the ones that breached it, and the highest level found.

The second is worth a note, because it makes the distinction I care about. The analyser
contains no AI at all: it wraps a reference dataset and returns the same answer every
time. The agent built the tool; the tool is deterministic. For something whose job is to
judge whether learning material is readable, "the same input gives the same answer" is a
requirement rather than a nicety, and that was a decision, not an accident.

The rest isn't mine to show, small tools that sit alongside software a team already uses,
prototypes exploring how these models might work inside products, and an authoring
pipeline that replaces a manual InDesign process with a text-based one: typesetting as
source, history in Git, several tools in a single workflow.

## What I learned

The method matters more than the speed.

Pairing the agent with Git and GitHub is what made it work. The agent sees the whole codebase rather than the fragment I remembered to paste, which removes most of its bad decisions at a stroke. And the changes arrive staged and stepped, so each one can be read, kept or thrown away. That is what heads off the regressions and the quiet misunderstandings that vibe coding is famous for.

The rest is knowing where I sit. I stay the designer and the decision maker, and the
judgement that actually matters is when to let the agent run and decide things for itself,
against when to make it stop and check. Get that wrong one way and you are manually coding everything yourself. Get it wrong the other way and you leaving decisions to a confident but often wrong agent.

The failure I hit most often is the agent hallucinating success. It reports that the build
works, that the thing is done, with complete confidence and no basis for it. Telling it
that it is wrong achieves very little it will apologise and then repeat itself.

What works is evidence. A screenshot of what the screen actually shows, the data it claims
to have produced, the error it insists isn't there. Put the artefact in front of it and it
corrects course.

That is the real argument for working in stages. Being able to roll a change back matters,
but the bigger thing is being able to see what actually happened at each step — because
once I can see it, I can show it.

Moving fast with these tools is not the skill. Moving fast and catching the failures is
the skill.
