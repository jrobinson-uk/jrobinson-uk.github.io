---
title: Solderless NOT gate
summary: A logic gate rebuilt with a transistor and copper tape instead of relays and solder, so it could be made in any classroom or club.
year: 2025
draft: false
featured: true
categories:
  - making
  - research
tags:
  - electronics
  - logic-gates
  - copper-tape
  - 3d-printing
  - minecraft
  - code-club
tools:
  - Transistor
  - Resistors
  - Copper tape
  - TinkerCAD
  - 3D printing
  - Minecraft
links:
  - label: "3D print files: the gate (STL)"
    url: /assets/files/not-gate.stl
  - label: "3D print files: the baseplate (STL)"
    url: /assets/files/not-gate-baseplate.stl
  - label: "Editable source: the gate (OBJ)"
    url: /assets/files/not-gate-obj.zip
  - label: "Editable source: the baseplate (OBJ)"
    url: /assets/files/not-gate-baseplate-obj.zip
# The hero is a portrait close-up, which crops badly to a share card and only exists at
# 480px wide. The line-up is 2528x1256 — near enough the 1.91:1 platforms want — and it
# is the more persuasive image anyway.
ogImage: not-gate-lineup.jpg
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

![Seven photographs of the same logic gate at different stages, numbered one to seven. One: a circuit diagram in biro on a green sticky note, labelled GND, IN, OUT and +ve. Two: bare wires and alligator clips spread across a carpet with a green LED lit. Three: a copper tape circuit taped to lined paper, hand-labelled OUT, with the LED lit brightly. Four: a 3D-printed yellow gate with "V2 dead" written across it in marker pen. Five: a printed template with copper pads, two blue resistors and a transistor pushed into moulded holes. Six: the refined template printed at 3mm and bare, with channels moulded to guide the tape. Seven: the finished gate with copper tape, components and a lit green LED in place.](assets/img/not-gate-lineup.jpg)

Seven versions, in order: the diagram on a sticky note; bare wires and alligator clips on
the carpet; copper tape on lined paper to prove the concept; the print whose transistor I
blew, labelled accordingly; the template that replaced it; that template refined and
printed bare at 3mm; and the finished gate.

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

==The failures were all about contact, not logic.== The first prototype blew its transistor
because I applied too much current, and the fix was as much protective as it was
electrical — a second resistor on the transistor input.

After that, every problem was a
person's ability to press tape onto a surface that gave them no help. So the changes
went into the housing: the print dropped from 6mm to 3mm so component legs could reach,
the copper tracks were rearranged simpler and longer, and I built a baseplate that both
shields the middle pad from being bridged and presses the tracks down with raised humps.

The best fix wasn't mine. My son picked the circuit up, noticed that pressing it changed
its behaviour, and suggested using a blunt pencil to run along the copper tape and seat
it properly. ==Handling the object located the fault faster than reasoning about it did.==

The paper version taught me something too. ==Being able to trace the pathways with a
finger made the circuit legible in a way the 3D-printed one wasn't.==

## Where it went

The print files are here: the [gate](/assets/files/not-gate.stl) at 3mm, and the
[baseplate](/assets/files/not-gate-baseplate.stl) it clips into. Both are yours to print.

Both are also up as OBJ — [gate](/assets/files/not-gate-obj.zip),
[baseplate](/assets/files/not-gate-baseplate-obj.zip) — which is the format to take if you
want to change the model rather than print it. That matters more than the STLs do, because
I still intend to work out equivalents for the other logic gates and I would rather
somebody beat me to it than wait.

The 3D design is also exported as a flat SVG, printable at the right scale, so the same
circuit can be built on paper. That drops the resource requirement again — no printer,
no filament, just tape and three components.
