---
title: LEGO Game Inputs
summary: Five ways to control a computer with a handful of LEGO, prototyped to find out which one a game could be built on.
year: 2020
order: 2
draft: false
featured: true
categories:
  - making
  - publications
tags:
  - build-hat
  - lego
tools:
  - LEGO Technic motors
links:
  - label: "The project it fed: LEGO® game controller"
    url: https://projects.raspberrypi.org/en/projects/lego-game-controller
  - label: Project source on GitHub
    url: https://github.com/raspberrypilearning/lego-game-controller
hero:
  src: lego-inputs-rotary-pair.jpg
  alt: A magenta LEGO Technic frame holding two rotating hubs side by side, one magenta and one black, each mounted on its own axle, with two white ribbon cables running away from the top.
ogImage: lego-inputs-lineup.jpg
---

## The question

This was groundwork for another project, that became a game of Pong you control with LEGO. The brief was to control a piece of software (game) with LEGO hardware, and in particular, how can LEGO be used to make novel game controllers

## What I made

Five candidates, built to showcase possibilites than finished.

A **throttle lever** that pushes back and forward, giving a linear scale rather than an on-or-off signal. A **two-button pad**, made from LEGO buttons and "biscuit" elements. A **cradle with a colour sensor** in it, so that dropping a different coloured brick in triggers a different action, and a dial built from the LEGO **rotary encoders in the motors**.

![Six LEGO game inputs on a wooden desk. A magenta frame carrying two rotating hubs. A teal motor with a black spoked wheel on its hub. A black frame holding a colour sensor, with green, yellow, blue and red bricks laid out beside it. A teal motor labelled FLIPPER, driving a black toothed rack with a white lever on the end. A motor turning a grey gear against a long toothed rack. And a motor with a magenta lever arm ending in a white spiral-patterned roller.](assets/img/lego-inputs-lineup.jpg)

![A pair of small hands either side of the black frame, a red brick pushed into the slot in front of the colour sensor, with the green, yellow and blue bricks still waiting on the desk.](assets/img/lego-inputs-colour-reader-in-use.jpg)

![A hand pulling a long black toothed rack upwards out of a yellow and teal motor assembly, the white end-piece held between finger and thumb.](assets/img/lego-inputs-slider-in-use.jpg)

![Two black-and-white colour sensors mounted upright side by side on a magenta Technic beam, each facing forward, the beam standing on two short legs.](assets/img/lego-inputs-colour-sensors.jpg) ![A teal LEGO motor lying on its side with a black spoked wheel fitted to its rotating hub, a white ribbon cable trailing from the back.](assets/img/lego-inputs-dial.jpg)

## What I did myself

The prototyping. The brief and the eventual project were a team effort; going away and coming back with five mechanisms to argue over was the part that was mine.

I gave them to my daughter and let her handle them without instructions, which is the cheapest useful test there is.

## Where it went

The rotary encoder became the main controller featured in the live [LEGO® game controller](https://projects.raspberrypi.org/en/projects/lego-game-controller) project, it reads the degrees of rotation from two motors and moves the paddles in a game of Pong drawn with Python's Turtle library.


