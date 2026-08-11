---
title: Solderless NOT gate
summary: A working logic gate rebuilt with copper tape instead of solder, so it could be made in any classroom or club.
order: 2
draft: false
featured: true
tools:
  - Transistors
  - Resistors
  - Copper tape
  - TinkerCAD
  - 3D printing
hero:
  src: not-gate-iterations.jpg
  alt: Several versions of the 3D-printed NOT gate housing lined up side by side, showing how the copper tape channels changed between revisions.
iterations:
  - src: not-gate-v1.jpg
    alt: The first version of the housing, with copper tape running across an open face.
  - src: not-gate-v3.jpg
    alt: A middle revision, with shallow channels guiding the tape into position.
  - src: not-gate-v6.jpg
    alt: A late revision, with recessed channels and a clamped contact point.
sections:
  question: |
    The original build used relays and a soldering iron. Could a working logic
    gate come down to materials and tools that any classroom or club actually
    has?
  made: |
    A two-transistor NOT gate with resistors, using copper tape in place of
    solder, inside a 3D-printed housing designed in TinkerCAD.

    Six or seven design revisions, driven by the real failure mode: tape
    placement was fragile. Each version made the placement easier to get right
    and the contact more secure. Two circuits blown along the way.
  tested: |
    A build activity at my Code Club. Printed instructions, worked through with
    each learner, capturing their comments, observations and reasoning as they
    went. Learners then applied the gate to a flood-detection sensor using
    inverted logic.
  learned: |
    Removing the soldering iron wasn't a simplification. It was a decision about
    where the artefact could live — a gate you can build with copper tape works
    in rooms where a soldering iron is not an option, which is most rooms.

    The revisions all came from the same place. Nothing was wrong with the
    circuit; what kept failing was a person's ability to place tape accurately
    on a surface that gave them no help. The fix was in the housing, not the
    electronics.
links: []
---

{% figureRow iterations, "Successive revisions of the housing. Each one moved the copper tape somewhere it was harder to get wrong." %}
