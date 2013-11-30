Retro Joystick
=====================

  A traditional joystick for web apps

Check It Out
=====================
  View a demo <a href="http://deshawnbw.github.io/retro-joystick/">online</a>

Status
=====================

* Finished stable version for modern browsers, solidifying API for a 1.0

Usage
=====================

  View index.html

API
=====================

  Instanciate RetroJoyStick

    var retroJoyStick = new RetroJoyStick();

  You are able to view when joystick position changes

    retroJoyStick.on('change', function () {
      // do something here
    });

  You are able to access the following properties

    retroJoyStick.angle

    retroJoyStick.distance

  You are able to access the following methods:

    retroJoyStick.getPositionAdjustment

  The following options are optional via the constructor:

    retroJoyStick = new RetroJoyStick({
      snapping: true, // false
      snappingPixels: 8, // pixels away from snapping point
      speedAdjustment: 0.08, // 1 = 1:1 pixels from maxDistanceFromCenter, when adjusting pixels.
      maxDistanceFromCenter: 100 // how many pxiels away from the center of the joystick?
    });

Authors
=====================
* DeShawn Williams <deshawn.b.williams@gmail.com>

License
=====================

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details at
  http://www.gnu.org/copyleft/gpl.html or LICENSE.md

Target environments
=====================

  This is for modern web browsers, targeted at the latest chrome/firefox at the moment. @TODO: crossbrowserness.

TODO
=====================
* Test touch devices
* Adjustable dimensions for joystick

