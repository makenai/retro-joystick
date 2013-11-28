/*

   @TODO:

     [x] restrain to center circle of 100 pixels

     [ ] snap to center when releasing

     [ ] animate back to center when releasing

     [ ] snap to center X +-20px

     [ ] snap to center Y +-20px

     [ ] distance setter changes knob position

     [ ] angle setter changes knob position

*/
function RetroJoyStick() {

  var ball = $('#retrostick-ball');
  var rod = $('#retrostick-rod');
  var rodWrap = $('#retrostick-rod-wrap');
  var base = $('#retrostick-base');
  var doc = $(document);

  var ballOffset;
  var currentPos;
  var clickOffset;
  var posX, posY;

  var ballWidth = ball.width();
  var ballHeight = ball.height();

  var baseWidth = base.width();
  var baseHeight = base.height();

  var retroStickAreaMaxTop = 0;
  var retroStickAreaMaxLeft = 0;
  var retroStickAreaMaxRight = baseWidth;
  var retroStickAreaMaxBottom = baseHeight;

  var point;
  var centerPoint = {x: baseWidth / 2, y: baseHeight / 2};

  var self = this;

  function getDistance(point1, point2) {
    var xs = (point1.x - point2.x) * (point1.x - point2.x);
    var ys = (point1.y - point2.y) * (point1.y - point2.y);

    return Math.floor(Math.sqrt(xs + ys));
  }

  // http://stackoverflow.com/questions/16792841/detect-if-user-clicks-inside-a-circle
  // x,y is the point to test
  // cx, cy is circle center, and radius is circle radius
  function pointInCircle(x, y, cx, cy, radius) {
    var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
    return distancesquared <= radius * radius;
  }

  // http://stackoverflow.com/questions/8515900/how-to-constrain-movement-within-the-area-of-a-circle
  // http://jsfiddle.net/7Asn6/
  function limit(point) {
    if (centerPoint.x) {
    var dist = getDistance(point, centerPoint);
    if (dist <= baseWidth / 2) { // radius
        return point;
    } 
    else {
      x = point.x - centerPoint.x;
      y = point.y - centerPoint.y;
      var radians = Math.atan2(y, x)
         return {
             x: Math.cos(radians) * (baseWidth / 2) + centerPoint.x, // baseWidth / 2 = radius
             y: Math.sin(radians) * (baseWidth / 2) + centerPoint.y
         }
    }
    }
  }

  function handleRetroStickMove(e) {

    posX = e.clientX - ballOffset.left + currentPos.left- clickOffset.left + (ballHeight / 2);
    posY = e.clientY - ballOffset.top + currentPos.top - clickOffset.top + (ballWidth / 2);
    point = {x: posX, y: posY};

    // Get distance from center
    var distance = getDistance(point, centerPoint);
    if (distance > 100) distance = 100;

    // Set distance (triggers setter)
    self.distance = distance;

    // Get angle from center (0-360)
    var theta = Math.atan2(posY - Math.floor(baseHeight / 2), posX - Math.floor(baseWidth / 2));
    if(theta < 0) theta += 2 * Math.PI;
    var _angle = (theta * 180 / Math.PI + 90 ) % 360;

    // Set angle (triggers setter)
    self.angle = _angle;

    self.publish('change');

    var limitedPoint = limit(point);

    ball.css('top', limitedPoint.y - (ballHeight / 2));
    ball.css('left', limitedPoint.x - (ballWidth / 2));

    // Change rod angle according to where the ball has rotated
    rodWrap.css('-webkit-transform', 'rotate(' + _angle + 'deg)');

    // Change rod height so it reaches the ball
    rod.height(distance);

    e.preventDefault();
  }

  function handleRetroStickPress(e) {

    ballOffset = ball.offset();
    currentPos = ball.position();
    clickOffset = {left: e.clientX - ballOffset.left, top: e.clientY - ballOffset.top};

    doc.on('mousemove.retrostick', handleRetroStickMove);

    doc.on('mouseup.retrostick', function () {
      self.angle = 0;
      self.distance = 0;
      $(document).off('mousemove.retrostick');
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

      // Change rod angle according to where the ball has rotated
      rodWrap.css('-webkit-transform', 'rotate(' + _angle + 'deg)');

      this._angle = Math.floor(val);
    },

    get distance(){
      return this._distance;
    },

    set distance(val){
      ball.css('top', limitedPoint.y - (ballHeight / 2));
      ball.css('left', limitedPoint.x - (ballWidth / 2));

      this._distance = val;
    }

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
}

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

