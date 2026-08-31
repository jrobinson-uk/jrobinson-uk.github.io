---
title: "Learning to Code with AI"
summary: An eight-lesson unit that teaches Python and the structured use of generative AI together, piloted in five Indian schools.
year: 2026
draft: true
featured: false
categories:
  - research
  - publications
tags:
  - ai
  - computing-education
  - python
  - pedagogy
---

> **Held as a draft.** The paper is under anonymous review at ACM COMPUTE 2026 and is not
> yet published, so by the rule the rest of this site follows, which is only what a reader can go
> and verify, it isn't live. Publishing the detail while the submission is anonymised could
> also undo the blinding. Flip `draft: false` once it's accepted.

## The question

Generative AI is already in students' hands, whether a curriculum acknowledges it or not. The reflex is to bolt an AI lesson onto the end of a programming unit, or to ban it.

How might students use AI to assist their programming in a way that supports learning to program, rather than substituting for it?

## What I made

An eight-lesson unit replacing an existing introductory Python unit, which teaches Python and the structured use of generative AI in parallel rather than treating AI as an addition.

It was rebuilt from the ground up rather than adapted, so that AI use is embedded throughout. It carries learners across the block-to-text transition, from Scratch to Python, and uses AI to mediate that move, situating Scratch blocks alongside their Python equivalents. The pedagogy draws on PRIMM, adapted to accommodate two simultaneous transitions: into text-based programming, and from not using AI to using it well.

The design decision I'd defend hardest is treating **LLM non-determinism as a teaching moment** rather than an inconvenience. Learners compare the outputs of multiple AI agents and critique them, so the lesson is that a model's output is something to be prompted, read and evaluated, not accepted.

It is also deliberately localised: Rupees, cricket as a context, local names, and materials bilingual in Telugu and English.

## How it was tested

Piloted across five schools in southern India with Grade 9 students, against a comparison group taught the original AI-free unit, supported by a three-day teacher professional development programme.

On a shared assessment the intervention group showed a small but statistically significant attainment advantage. There was evidence that learners developed structured prompting skills in step with their programming skills, and they reported greater confidence using AI for their work.

## What I learned

The honest framing of the result matters more than the result. The sample was small, non-representative and girls-only, and the work was exploratory, so the finding is encouraging and not conclusive, and the paper says so.

What I'd take from it is that "use AI well" turns out to be teachable as a skill in its own right, on the same timescale as learning the language, provided the activities are designed for it rather than the tool simply being made available. 