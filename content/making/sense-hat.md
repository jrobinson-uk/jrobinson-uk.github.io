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
hero:
  src: sense-hat-arrow.jpg
  alt: A cardboard "vault", secured with a microbit and servo.
---

## The question

Shortly after joining the Raspberry Pi Foundation the Sense Hat was released for the Astro Pi mission. A board with eight sensors on it and lots of potential. An accelerometer, a
gyroscope, a magnetometer, temperature, humidity, pressure, an 8×8 LED display and a
joystick. We got to work exploring it's practical application in the classroom

Rather than specify an answer, could we generate candidateprojects cheaply enough to see
which ones held up?

An early test, which never quite made it into a project was **the polystyrene drop.** I wrapped a Sense HAT in a polystyrene shell, threw it out of the office window, and derived the height of the building from the acceleration under gravity.

## What I made

**Puzzle box.** A program that hides something behind a series of locks, each opened by
a different sensor rather than a password. A temperature lock that waits until the board
is warmed or cooled to a target. A humidity lock. A combination lock that converts the
board's orientation into an angle, so you dial it by physically turning the thing. And a
location lock, it takes an optional USB GPS reciever and stays shut until you carry it to the right place.

Puzzle boxes are centuries old and people still make them for the pleasure of it. That context provided a counterpoint to classic data science projects, the sensors become the mechanism of a game. It led to a nineteen step project, and it ends by asking the learner to invent locks of their own.

## What I learned

The cheapest way to find out what a new capability is for is to make several small things
with it and see which ones people want to copy. A specification written first would have
taken longer and been less convincing.

The locks also taught me something about divergent thinking. A temperature sensor is a component typically used for tracking and logging data, rethinking of it a conditional barrier, a
lock, led to this project.

## Where it went

The puzzle box was published on the Raspberry Pi site and is still there, with the source
still being maintained, the repository was last updated in November 2024, nine years
after it was written.
