---
title: LEGO Face
summary: A robot face built from LEGO that recognises objects with a Raspberry Pi camera and answers with an expression.
year: 2020
order: 1   # pinned to the top of /work
draft: false
featured: true
categories:
  - making
  - publications
tags:
  - raspberry-pi
  - build-hat
  - lego
  - machine-learning
  - ldraw
  - 3d-printing
tools:
  - Raspberry Pi
  - Build HAT
  - Raspberry Pi Camera Module
  - LEGO Technic motors
  - Adafruit LED matrices
  - TensorFlow Lite
  - LDraw
  - Python
hero:
  src: robot_face.gif
  alt: The completed robot face, with 8×8 LED matrix eyes and a flexible grey hose curved into a smile.
links:
  - label: LEGO® robot face on the Raspberry Pi projects site
    url: https://projects.raspberrypi.org/en/projects/lego-robot-face
  - label: Project source on GitHub
    url: https://github.com/raspberrypilearning/lego-robot-face
  - label: The model on Sketchfab
    url: https://skfb.ly/oqs8t
---

## The question

Could the Build HAT support a project where physical LEGO responds expressively to the real world and could a child build it from instructions?

There was a second question underneath it: what does machine learning look like when a nine-year-old can see it working, on a table, without a cloud account?

## What I made

A minifig like face, built on two LEGO Technic baseplates. The eyes are a pair of off-the-shelf 8×8 LED matrices, cheap and simple to solder and assemble. The mouth is a flexible hose with a large LEGO Technic motor at one end, so it can be pulled into a smile or pushed into a frown. Two smaller motors move the eyebrows. A Raspberry Pi Camera Module sits above the face to capture and recognise images of objects placed in it's view.

![The robot face animating: the LED matrix eyes change pattern while the tube mouth moves between a smile and a frown.](assets/img/robot_face.gif)

Getting to the finished product took a number of prototypes and iterations, especially as the Build-Hat product and APIs were undergoing parallel development

![An early prototype: two 8×8 LED matrices showing round lit eyes behind a cream Technic panel, with a flexible grey tube curved below them as a mouth. No camera yet.](assets/img/lego-face-prototype-cream.jpg) ![An early prototype of the face standing on a desk, with LED matrix eyes, a pink 3D-printed camera bracket on top and a flexible tube mouth.](assets/img/lego-face-early.jpg) ![The back of the model, showing the Raspberry Pi mounted on a blue LEGO base with white ribbon cables running up to the camera, and two legs holding the whole thing upright.](assets/img/lego-face-back.jpg)

The recognition runs on the Pi itself, a pre-trained TensorFlow Lite model and a labels file, no network call and no account. The camera classifies whatever is held up to it, and the program maps the label it gets back to an expression.

Expression is the whole point of the mechanism. The same hose reads as neutral or miserable depending on a few degrees of motor rotation, which is a cheap way to buy a lot of emotional range.

![The face with its tube mouth held almost straight, giving a flat, neutral expression.](assets/img/lego-face-expr-neutral.jpg) ![The same face with the tube mouth pulled downwards into a frown.](assets/img/lego-face-expr-frown.jpg)

## What I did myself

First prototype through to final design: the mechanism, the program, the 3D model, the build instructions and the project instructions.

![A rendered build illustration of the finished face beside a cartoon spider, showing the LED matrix eyes, the motors, the flexible tube mouth and the camera in its bracket.](assets/img/lego-face-ldraw-render.jpg)

The build instructions are rendered from a digital model of the whole assembly, and the existing LDraw part library couldn't represent non Lego components. So I went deep into LDraw to author unofficial parts using LDU measurements, which is how the Pi, it's camera, ribbon cable and LED matrices come to be in the drawings at all.

![A Raspberry Pi Camera Module held in a pink 3D-printed bracket, its ribbon cable trailing away to one side.](assets/img/lego-face-camera-mount.jpg)

Two LEGO experts reviewed the build and made suggestions, replacing the original 3D printed camera mount with articulate, all Lego, design. They also suggested the eyebrow mechanism which added further expression. I then handed the prototype to a colleague, who turned it into the published project.

## How it was tested

The two LEGO experts saw it first, and their feedback was specific: the camera mount, and the way I had attached the eyes. The bracket that holds the LED matrices was their suggestion. The eyebrows were theirs outright the model gained a whole axis of expression through that feedback

After that, limited testing with colleagues and a couple of children. There was one kit, which caps how much testing you can do. It did not go through anything rigorous.

## What I learned

Building against a product that had not shipped yet was the other lesson. The Build HAT and its Python API were still being developed while the project was being written, so the ground moved underneath it. Frustrating rather than fatal, but it is a different kind of work from building on something finished.

The machine learning was the part I expected to be fragile, and it was the part that behaved. A relatively simple pre-trained model, a few thousand objects it could recognise, and it held up in front of children. What made it teachable was not the accuracy though, it was the uncertainty. The activity talks about confidence thresholds and probability, so what lands is that this is a system which guesses, and can be wrong.

## Where it went

Published as **LEGO® robot face** on the Raspberry Pi projects site: twelve steps, from testing the machine learning model through building the face to programming emotional responses to objects. The build is given as guidance and inspiration rather than instruction, learners are encouraged to use whatever LEGO they have.

It has since been translated into German, Spanish, Japanese, Korean and Chinese, and it is still maintained: the repository was last updated in July 2025, five years after the project was written.

The physical model was displayed in the Raspberry Pi flagship store in Cambridge. 