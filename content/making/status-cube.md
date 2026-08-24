---
title: Status Cube
summary: A cube you roll onto one face to set your Slack status. Built for myself, and still being built.
year: 2026
draft: false
featured: false
categories:
  - making
tags:
  - raspberry-pi-pico
  - micropython
  - slack
  - 3d-printing
  - sensors
tools:
  - Raspberry Pi Pico W
  - MPU-9250
  - MicroPython
  - 3D printing
  - Slack API
links:
  - label: Source on GitHub
    url: https://github.com/jrobinson-uk/Status_cube
hero:
  src: status-cube-enclosure.jpg
  alt: A matte green 3D-printed cube on a white desk next to a keyboard, its faces labelled by hand in black marker — "online" on the top face, "Focus" and "Lunch" on the two visible sides. Print layer lines run across every surface.
---

## The question

Setting your status is a menu, four clicks deep, and so nobody does it. Could it be a
physical act instead — something you do with your hand, on the desk, in the moment you
actually change what you are doing?

## What I made

A cube with a Raspberry Pi Pico W and a nine-axis sensor inside, running MicroPython.
Roll it so a face is up and it sets your Slack status: the words, the emoji, whether you
appear online or away, and whether notifications are snoozed.

Six faces, six states. Available, Do Not Disturb, In a Meeting, Lunch, Focusing, Away.
Which face is up is worked out from gravity — whichever axis of the accelerometer reads
close to 1g is pointing down — and a face has to be held for two seconds before anything
happens, so putting the cube down carelessly doesn't announce that you're at lunch.

The part I like best is the setup. There is no button. To get the cube onto your WiFi you
**shake it**, which opens a small web page for entering credentials, and shake it again to
close it. That is not a flourish: it is a consequence of the enclosure being 3D printed
and sealed. ==A button means a hole, a hole means an opening, and it turned out to be less
work to teach the thing to recognise being shaken than to design a way in.==

The shake detector is deliberately dull about it. A resting cube reads about 1g and even a
brisk roll stays near that, so the threshold sits well above normal handling: three
separate spikes past 1.8g inside two seconds. A single shake is one long spike across many
samples rather than one reading, so there's a refractory period to stop one gesture
counting as three. It compares squared magnitudes to avoid computing a square root on
every sample.

## How it was tested

Not tested, in the sense that would matter. It is still in prototyping, and here is how far
it has got.

The basic mechanism first, proved on a breadboard — read the accelerometer, work out which
face is down, call Slack, watch the status change. Then a mount designed to sit inside a
3D-printed wireframe cube, so the electronics could be positioned and the whole thing
handled while still being visible. Then a full enclosure printed. Most recently, connection
insets tested for a pogo pin cable, so the cube can sit on a dock to charge and talk to a
computer.

![A Raspberry Pi Pico W on a tall black header sitting in a green 3D-printed mount, with a small blue charging board tucked underneath it, the whole assembly resting in a shallow printed tray.](assets/img/status-cube-mount.jpg)

![Two green 3D-printed pogo pin insets on a white desk. The left one shows four gold pogo pins flanked by two metal magnets; the right one has a matching connector with a four-core cable running from it, its red, white, yellow and black wires stripped bare at the far end.](assets/img/status-cube-pogo-insets.jpg)

The pogo pins are the same argument as the shake gesture. A socket is a hole, and I wanted
the case sealed. Contacts on the outside keep it that way, and the cube gets picked up and
put back down rather than plugged in — ==which is what you want from something that lives on a
desk and is meant to be handled.==

## What I learned

==So far, mostly that the physical constraints arrive first and the software bends around
them.== The sealed case produced the shake gesture. The sensor turned out to be unreliable
on this board at 400 kHz and to read cleanly at 100 kHz, which is now a comment in the
config file rather than something I will rediscover in a year.

It isn't finished. The status light is still the Pico's onboard LED blinking twice to
acknowledge a roll, with a note in the code to replace it once the RGB indicator is
wired in.

The [source is on GitHub](https://github.com/jrobinson-uk/Status_cube). Every threshold
described above is a named constant in `config.example.py` rather than a number buried in
the logic, which is the same instinct as the comment about the I²C clock: the next person
to pick this up shouldn't have to rediscover what I already found out.
