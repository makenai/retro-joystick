/*
   @TODO:

     [ ] increase resistance of pulling when at 75 +

     [ ] distance setter changes knob position

     [ ] angle setter changes knob position
*/

var MAX_DISTANCE = 100;

function RetroJoyStick(options) {

  options = options || {};

  var self = this;

  // options
  self.snapping = options.snapping || true;

  var doc = $(document);
  var ball = $('#retrostick-ball');
  var stick = $('#retrostick-stick');
  var stickWrap = $('#retrostick-stick-wrap');
  var base = $('#retrostick-base');

  // private variables used in public methods
  this._ball = ball;
  this._stick = stick;

  // Scoped to the constructor, mostly for sharing in between mouse events
  var ballOffset,
      currentPos,
      clickOffset,
      point,
      lastPointX,
      lastPointY,
      lastDistance,
      lastAngle;

  // stuff
  var ballWidth = ball.width();
  var ballHeight = ball.height();
  var baseWidth = base.width();
  var baseHeight = base.height();
  var ballRadius = ballWidth / 2;

  // couldn't live without it
  var centerPoint = {x: baseWidth / 2, y: baseHeight / 2};

  function handleRetroStickMove(e) {

    point = {
      x: e.clientX - ballOffset.left + currentPos.left- clickOffset.left + ballRadius,
      y: e.clientY - ballOffset.top + currentPos.top - clickOffset.top + ballRadius
    };

    // Get distance from center
    self.distance = getDistance(point, centerPoint);

    // Get angle from center (0-360)
    var theta = Math.atan2(point.y - centerPoint.y, point.x - centerPoint.x);
    if(theta < 0) theta += 2 * Math.PI;
    var _angle = (theta * 180 / Math.PI + 90 ) % 360;

    // Set angle (triggers setter)
    self.angle = _angle;

    // Constrain the point within a circle
    var limitedPoint = limit(point, centerPoint);

    // Snapping is enabled
    if (self.snapping) {

      var snap = 8; // @TODO: add public option

      // Snap to the center
      if (self.distance < snap) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 0 angle
      if (_angle > 360 - snap || (_angle > 0 && _angle < snap)) {
        self.angle = 0;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 90 angle
      if (_angle > 90 - snap && _angle < 90 + snap) {
        self.angle = 90;
        limitedPoint.y = centerPoint.y;
      }

      // Snap on 180 angle
      if (_angle > 180 - snap && _angle < 180 + snap) {
        self.angle = 180;
        limitedPoint.x = centerPoint.x;
      }

      // Snap on 270 angle
      if (_angle > 270 - snap && _angle < 270 + snap) {
        self.angle = 270;
        limitedPoint.y = centerPoint.y;
      }
    } // End snapping

    var changed = false;

    if (limitedPoint.y !== lastPointY) {
      ball.css('top', limitedPoint.y - (ballHeight / 2));
      lastPointY = limitedPoint.y;
      changed = true;
    }

    if (limitedPoint.x !== lastPointX) {
      ball.css('left', limitedPoint.x - ballRadius);
      lastPointX = limitedPoint.x;
      changed = true;
    }

    if (self._angle !== lastAngle) {
      // Change stick angle according to where the ball has rotated
      stickWrap.css('-webkit-transform', 'rotate(' + self._angle + 'deg)');
      lastAngle = self._angle;
      changed = true;
    }

    // Change stick height so it reaches the ball
    if (self.distance !== lastDistance) {
      stick.height(self.distance);
      changed = true;
    }

    if (changed) {
      self.publish('change');
    }

    e.preventDefault();
  }

  function handleRetroStickPress(e) {

    ballOffset = ball.offset();
    currentPos = ball.position();
    clickOffset = {left: e.clientX - ballOffset.left, top: e.clientY - ballOffset.top};

    // Remove animation classes (only used for when releasing)
    self._ball.removeClass('retrostick-ball-to-center');
    self._stick.removeClass('retrostick-stick-to-center');

    doc.on('mousemove.retrostick', handleRetroStickMove);

    doc.on('mouseup.retrostick', function () {
      self.resetPosition();
      doc.off('mousemove.retrostick');
    });

    e.preventDefault();
  }

  ball.on('mousedown.retrostick', handleRetroStickPress);

}

RetroJoyStick.prototype = {

    get angle(){
      return this._angle;
    },

    set angle(val){
      // Change stick angle according to where the ball has rotated
      //stickWrap.css('-webkit-transform', 'rotate(' + _angle + 'deg)');

      this._angle = Math.floor(val);
    },

    get distance(){
      return this._distance;
    },

    set distance(distance){
      // Make sure distance doesn't go further than the max.
      if (distance > MAX_DISTANCE) distance = MAX_DISTANCE;
      this._distance = distance;

      //this._ball.css('top', val.y - ballRadius);
      //this._ball.css('left', val.x - ballRadius);
    }

};

RetroJoyStick.prototype.resetPosition = function () {
  this._ball.addClass('bringBallToCenter');
  this._ball.css('top', 50);
  this._ball.css('left', 50);
  this._stick.addClass('shrinkstickToCenter');
  this._stick.height(5);
  this.angle = 0;
  this.distance = 0;
  this.publish('change');
};

// https://gist.github.com/deshawnbw/7521966
RetroJoyStick.prototype.publish = function(topic, args){
  var self = this;
  if (this._eventCache && this._eventCache[topic]) {
    this._eventCache[topic].forEach(function (topicSubscriber) {
      topicSubscriber.apply(self, args || []);
    });
  }
};

RetroJoyStick.prototype.subscribe = function (topic, callback) {
  if (!this._eventCache) this._eventCache = {};
  if (!this._eventCache[topic]) this._eventCache[topic] = [];
  this._eventCache[topic].push(callback);

  return [topic, callback];
};

RetroJoyStick.prototype.on = RetroJoyStick.prototype.subscribe;

RetroJoyStick.prototype.trigger = RetroJoyStick.prototype.publish;

RetroJoyStick.prototype.unsubscribe = function(handle){
  var self = this;
  if (this._eventCache && this._eventCache[handle[0]]) {
    this._eventCache[handle[0]].forEach(function (callback, i) {
      if (handle[1] === callback) {
        self._eventCache[handle[0]].splice(i, 1);
      }
    });
  }
};


function getDistance(point1, point2) {
  var xs = (point1.x - point2.x) * (point1.x - point2.x);
  var ys = (point1.y - point2.y) * (point1.y - point2.y);

  return Math.floor(Math.sqrt(xs + ys));
}

// http://stackoverflow.com/questions/8515900/how-to-constrain-movement-within-the-area-of-a-circle
// http://jsfiddle.net/7Asn6/
function limit(point, centerPoint) {
  if (centerPoint.x) {
  var dist = getDistance(point, centerPoint);
  if (dist <= centerPoint.x) { // radius
      return point;
  } 
  else {
    x = point.x - centerPoint.x;
    y = point.y - centerPoint.y;
    var radians = Math.atan2(y, x);
       return {
           x: Math.cos(radians) * centerPoint.x + centerPoint.x,
           y: Math.sin(radians) * centerPoint.y + centerPoint.y
       };
  }
  }
}

