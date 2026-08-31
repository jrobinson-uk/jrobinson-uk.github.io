---
title: A micro:bit escape room
summary: A room full of puzzles built by different people, wired together so that solving all of them opens one real box.
# year is deliberately absent until James confirms it, see the note in the README about
# never guessing a fact. `order` keeps it visible in the archive meanwhile.
order: 3
draft: false
featured: false
categories:
  - making
tags:
  - microbit
  - radio
  - escape-room
  - game-design
  - educators
tools:
  - micro:bit
  - micro:bit radio
  - Lockbox
hero:
  src: escape-room-vault.gif
  alt: A cardboard "vault", secured with a microbit and servo.
---

## The question

An escape room is a set of puzzles that has to behave as one system. Each puzzle can be
authored by a different person, but the room only works if they agree on what a solved puzzle means and what happens next.

Could a group of people each build their own puzzle in a single session, and have the result be one room rather than several unrelated toys?

## What I made

One of several activities, in a session on the maker module of my MSc. Each group built theirs independently.

The shared project is what makes the activity an escape room. Solving a puzzle gives you information, a number, a code sequence, which you then enter into that puzzle's micro:bit. The micro:bit checks it and, if it is right, transmits an unlock code over radio to a central micro:bit. The central one is counting: when it has heard from every puzzle, it releases a lockbox.

That structure is the interesting part, and it is not really about micro:bits. Each group only had to agree on the code they would send and when. Everything else, what the puzzle is, how you solve it, how hard it is, belonged to whoever built it. 

The lockbox matters too. The last link in the chain is a physical thing opening, not a message on a screen, so the payoff is a physical output and real "unlocking".

## How it was tested

By the people who built it, in the session, we switched around and tried each others puzzles

It was developed with and tested on educators rather than learners, and that is a limit here. Educators are a good audience for whether the mechanism holds together and a poor one for whether the puzzles are the right difficulty, because they are reading the design at the same time as playing it. It has not been in front of children.
