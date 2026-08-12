---
title: LEGO Face
summary: An articulated LEGO face that reads objects with a Raspberry Pi camera and responds with expressions.
order: 1
draft: false
featured: true
tools:
  - Raspberry Pi
  - Build HAT
  - Raspberry Pi Camera
  - LEGO motors and angle sensors
  - LED matrix
  - LDraw
hero:
  src: lego-face-hero.jpg
  alt: An articulated face built from LEGO, with LED matrix eyes and a Raspberry Pi camera mounted at its centre.
links: []
---

## The question

Could the Build HAT support a project where physical LEGO responds expressively to
the real world — and could a child build it from instructions?

## What I made

An articulated LEGO face using official LEGO motors and angle sensors,
off-the-shelf LED matrices, and a flexible tube mounted on axles for the
articulation. A Raspberry Pi camera runs a pre-built recognition model locally on
the Pi, rather than calling out to a cloud service. It reads objects presented to
it and animates expressions — joy, sadness and others.

## What I did myself

First prototype through to final design: the mechanism, the program, the 3D model,
the build instructions and the project instructions.

The existing LDraw part library couldn't express what the assembly needed, so I
went deep enough into LDraw to author unofficial parts using LDU measurements,
letting the Pi camera and its cable be modelled correctly inside the build.

Learning designers at the Raspberry Pi Foundation then turned the prototype into
the published project. LEGO Education designers reviewed it and suggested
refinements to the mechanisms holding the non-LEGO components.

## Where it went

Published as a project on the Raspberry Pi website, and still working. The physical
model was displayed in the Raspberry Pi flagship store in Cambridge.
