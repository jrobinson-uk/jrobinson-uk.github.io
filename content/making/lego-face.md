---
title: LEGO Face
summary: A robot face built from LEGO that recognises objects with a Raspberry Pi camera and answers with an expression.
year: 2020
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
  src: lego-face-hero.jpg
  alt: The completed robot face — two hinged yellow LEGO baseplates with 8×8 LED matrix eyes and a flexible grey tube curved into a smile.
links:
  - label: LEGO® robot face on the Raspberry Pi projects site
    url: https://projects.raspberrypi.org/en/projects/lego-robot-face
  - label: Project source on GitHub
    url: https://github.com/raspberrypilearning/lego-robot-face
  - label: The model on Sketchfab
    url: https://skfb.ly/oqs8t
---

## The question

Could the Build HAT support a project where physical LEGO responds expressively to the
real world — and could a child build it from instructions?

It was one of five projects built for the Build HAT's launch, and the one asked to carry
machine learning. So there was a second question underneath: what does machine learning
look like when a nine-year-old can see it working, on a table, without a cloud account?

## What I made

A face on two hinged LEGO Technic baseplates. The eyes are a pair of off-the-shelf 8×8
LED matrices — cheap, and honest about their cost: they need soldering to assemble and
modify before they will go anywhere near a LEGO model. The mouth is a flexible tube with
a large LEGO Technic motor at one end, so it can be pulled into a smile or pushed into a
frown. Two smaller motors move the eyebrows. A Raspberry Pi Camera Module sits above the
face on a thirty-centimetre ribbon cable, in a bracket I printed for it.

![An early prototype of the face standing on a desk, with LED matrix eyes, a pink 3D-printed camera bracket on top and a flexible tube mouth.](assets/img/lego-face-early.jpg) ![The back of the model, showing the Raspberry Pi mounted on a blue LEGO base with white ribbon cables running up to the camera, and two legs holding the whole thing upright.](assets/img/lego-face-back.jpg)

The recognition runs on the Pi itself — a pre-trained TensorFlow Lite model and a labels
file, no network call and no account. The camera classifies whatever is held up to it,
and the program maps the label it gets back to an expression.

Expression is the whole point of the mechanism. The same tube reads as neutral or
miserable depending on a few degrees of motor rotation, which is a cheap way to buy a lot
of emotional range.

![The face with its tube mouth held almost straight, giving a flat, neutral expression.](assets/img/lego-face-expr-neutral.jpg) ![The same face with the tube mouth pulled downwards into a frown.](assets/img/lego-face-expr-frown.jpg)

Still photographs undersell it, so here it is moving — the eyes redrawing themselves on
the matrices while the mouth travels between expressions.

![The robot face animating: the LED matrix eyes change pattern while the tube mouth moves between a smile and a frown.](assets/img/robot_face.gif)

## What I did myself

First prototype through to final design: the mechanism, the program, the 3D model, the
build instructions and the project instructions.

![A rendered build illustration of the finished face beside a cartoon spider, showing the LED matrix eyes, the motors, the flexible tube mouth and the camera in its bracket.](assets/img/lego-face-ldraw-render.jpg)

The build instructions are rendered from a digital model of the whole assembly, and the
existing LDraw part library couldn't express what this one needed. So I went deep enough
into LDraw to author unofficial parts using LDU measurements — which is how the Pi camera
and its thirty-centimetre ribbon cable come to be in the drawings at all, in the right
place and the right size.

![A Raspberry Pi Camera Module held in a pink 3D-printed bracket, its ribbon cable trailing away to one side.](assets/img/lego-face-camera-mount.jpg)

Learning designers at the Raspberry Pi Foundation then turned the prototype into the
published project. LEGO Education designers reviewed it and suggested refinements to the
mechanisms holding the non-LEGO components.

## Where it went

Published as **LEGO® robot face** on the Raspberry Pi projects site: twelve steps, from
testing the machine learning model through building the face to programming emotional
responses to objects. The build is given as guidance rather than instruction — you are
told to use whatever LEGO you have.

It has since been translated into German, Spanish, Japanese, Korean and Chinese, and it
is still maintained: the repository was last updated in July 2025, five years after the
project was written.

The physical model was displayed in the Raspberry Pi flagship store in Cambridge.
