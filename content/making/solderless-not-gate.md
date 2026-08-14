---
title: Solderless NOT gate
summary: A logic gate rebuilt with a transistor and copper tape instead of relays and solder, so it could be made in any classroom or club.
year: 2025
order: 2
draft: false
featured: true
tools:
  - Transistor
  - Resistors
  - Copper tape
  - TinkerCAD
  - 3D printing
  - Minecraft
hero:
  src: not-gate-final.jpg
  alt: The final 3D-printed NOT gate, shaped like the logic gate symbol, with copper tape in moulded channels, two resistors, a transistor and a green LED in place.
---

## The question

The original activity built a NOT gate out of relays and applied it to a flood warning
system. It worked, and it needed a soldering iron and a hot glue gun. Any setting
without those tools would struggle with it.

Could the same logic, and the same learning, come down to cheaper components and fewer
specialist tools?

## What I made

I started in Minecraft, with my son. The game's redstone signals are a working circuit
medium, and building the gate there meant thinking carefully about how to detect a
flood risk and communicate it. We ended up with a system that raises and lowers a red
or a green block to show danger or safety.

Then the physical version. A transistor in place of the relay — cheaper, same logic —
with resistors, and copper tape in place of solder, applied by hand. The whole circuit
sits in a 3D-printed template shaped like the NOT gate symbol itself, so the artefact
and the notation are the same object.

I am comfortable building circuits but not experienced at designing them, so this began
with research into how few components a NOT gate could need, and a diagram worked out on
whatever was to hand.

![A circuit diagram drawn by hand in biro on a green sticky note, labelled GND along the top, IN on the left, +ve at the bottom and OUT on the right, with a transistor and a resistor sketched between them.](assets/img/not-gate-00-diagram.jpg)

![The first working circuit: bare wires, alligator clips and copper tape spread across a carpet next to a breadboard and a hand-drawn circuit diagram, with a green LED lit.](assets/img/not-gate-01-bare-wires.jpg) ![A copper tape circuit taped to a sheet of lined paper, labelled IN and OUT by hand, with two resistors, a transistor and a green LED lit brightly.](assets/img/not-gate-02-paper.jpg) ![A 3D-printed yellow triangular template with square copper tape pads, two blue resistors and a black transistor pushed into moulded holes.](assets/img/not-gate-03-template.jpg) ![The final template printed at 3mm thick and bare, with channels moulded to guide the copper tape.](assets/img/not-gate-04-final-print.jpg)

The route there: bare wires and copper tape on the carpet, then a copper tape circuit on
paper to prove the concept, then the printed template, then a refined version of it.

## What I did myself

The original relay build was a group activity and a collaborative one. Everything after
it was independent making — the research, the circuit design, the 3D design, the printed
template, the build instructions.

My son built the Minecraft version with me and was the first person other than me to
build the physical one. A conversation with a college tutor is what sent me back to
basics when the first prototype kept failing.

## How it was tested

My son, who is ten, tested it first. The build was straightforward: he understood where
to place the tracks and components with very little direction from me. We hit a couple
of connection issues and debugged them together, then put the gate into a flood
detection model so he could see the logic doing something.

Then a small group at the Code Club I lead. I prepared resources for eight; six
learners took part, aged between five and fourteen. The session ran in four steps:
build the circuit from step-by-step pictures, test it, debug it if needed, then use it
in a flood defence model.

![A seven-step illustrated assembly guide. Apply copper tape to the grooves; wrap the tape over to the top side; insert the resistors into the marked locations; prepare the transistor by spreading its legs; insert the resistors and transistor; fold the component legs onto the tracks; apply a second layer of tape to secure everything.](assets/img/not-gate-assembly-guide.jpg)

Three things went wrong, all usefully. A small pad of copper tape in the centre of the
circuit turned out to be fiddly to place. Some learners still finished with loose
connections between the tape and the components — at 6mm thick, the print left the
transistor legs too little length to fold down and make a good contact. And one learner
bridged the power supply and the middle pad, which bypassed the protective resistor and
burnt out the transistor. Replacing it took them five to ten minutes.

## What I learned

The honest doubt first: I am not certain I didn't swap one challenge for another. The
soldering iron posed problems, and so does copper tape.

The failures were all about contact, not logic. The first prototype blew its transistor
because I applied too much current, and the fix was as much protective as it was
electrical — a second resistor on the transistor input.

![A 3D-printed gate with "V2 dead" written across it in marker pen, a single resistor, a transistor and a green LED still fitted, lying on a wooden table.](assets/img/not-gate-v2-dead.jpg) After that, every problem was a
person's ability to press tape onto a surface that gave them no help. So the changes
went into the housing: the print dropped from 6mm to 3mm so component legs could reach,
the copper tracks were rearranged simpler and longer, and I built a baseplate that both
shields the middle pad from being bridged and presses the tracks down with raised humps.

The best fix wasn't mine. My son picked the circuit up, noticed that pressing it changed
its behaviour, and suggested using a blunt pencil to run along the copper tape and seat
it properly. Handling the object located the fault faster than reasoning about it did.

The paper version taught me something too. Being able to trace the pathways with a
finger made the circuit legible in a way the 3D-printed one wasn't.

## Where it went

Not published yet. I intend to share the designs and to work out equivalents for the
other logic gates.

The 3D design is also exported as a flat SVG, printable at the right scale, so the same
circuit can be built on paper. That drops the resource requirement again — no printer,
no filament, just tape and three components.
