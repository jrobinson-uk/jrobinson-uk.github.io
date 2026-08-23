---
title: "Sense HAT: finding out what a new product is for"
summary: A new sensor board arrived with no established use. Several cheap prototypes to find out what it was good for.
year: 2015
draft: false
featured: true
categories:
  - making
  - publications
tags:
  - raspberry-pi
  - sense-hat
  - python
  - sensors
tools:
  - Sense HAT
  - Raspberry Pi
  - Python
links:
  - label: Sense HAT puzzle box on the Raspberry Pi projects site
    url: https://projects.raspberrypi.org/en/projects/sense-hat-puzzle-box
  - label: Project source on GitHub
    url: https://github.com/raspberrypilearning/sense-hat-puzzle-box
---

## The question

A board arrived with eight sensors on it and no established use. An accelerometer, a
gyroscope, a magnetometer, temperature, humidity, pressure, an 8×8 LED display and a
joystick — all of it real, none of it obviously _for_ anything in a classroom.

Rather than specify an answer, could I generate candidate answers cheaply enough to see
which ones held up?

## What I made

**Puzzle box.** A program that hides something behind a series of locks, each opened by
a different sensor rather than a password. A temperature lock that waits until the board
is warmed or cooled to a target. A humidity lock. A combination lock that converts the
board's orientation into an angle, so you dial it by physically turning the thing. And a
location lock, which is the one that leaves the board entirely — it takes an optional USB
GPS device and stays shut until you carry it to the right place.

Puzzle boxes are centuries old and people still make them for the pleasure of it. ==That
was the borrowed frame: the sensors stop being a datasheet and become the mechanism of a
game.== Nineteen steps, and it ends by asking the learner to invent locks of their own.

**The polystyrene drop.** I wrapped a Sense HAT in polystyrene balls, threw it out of the
office window, and derived the height of the building from the acceleration under gravity.

## What I learned

The cheapest way to find out what a new capability is for is to make several small things
with it and see which ones people want to copy. A specification written first would have
taken longer and been less convincing.

==The locks also taught me something about framing. A temperature sensor is a component; a
lock that opens when you cup your hands around it is a reason to care what a temperature
sensor does.==

## Where it went

The puzzle box was published on the Raspberry Pi site and is still there, with the source
still being maintained — the repository was last updated in November 2024, nine years
after it was written.
