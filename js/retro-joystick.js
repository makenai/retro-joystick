/*

   @TODO:

     [ ] restrain to center circle of 100 pixels

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
  var posX, posY, _posX, _posY;

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

  ball.on('mousedown.retrostick', handleRetroStickPress);

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

  function handleRetroStickMove(e) {

    _posX = e.clientX - ballOffset.left + currentPos.left- clickOffset.left + (ballHeight / 2);
    _posY = e.clientY - ballOffset.top + currentPos.top - clickOffset.top + (ballWidth / 2);

    var posChanged = false;

    //if (pointInCircle(_posX, _posY, centerPoint.x, centerPoint.y, 100)) {

      //ball.css('top', posY - (ballHeight / 2));
      //ball.css('left', posX - (ballWidth / 2));

      //posY = _posY;
      //posX = _posX;
      //posChanged = true;
    //}


    point = {x: posX, y: posY};

    // Get distance from center
    var distance = getDistance(point, centerPoint);

    // Set distance (triggers setter)
    self.distance = distance;

    // Get angle from center (0-360)
    var theta = Math.atan2(posY - Math.floor(baseHeight / 2), posX - Math.floor(baseWidth / 2));
    if(theta < 0) theta += 2 * Math.PI;
    var _angle = (theta * 180 / Math.PI + 90 ) % 360;

    // Set angle (triggers setter)
    self.angle = _angle;

    self.publish('change');

    //if (distance <= 100) {
      ball.css('top', posY - (ballHeight / 2));
      ball.css('left', posX - (ballWidth / 2));

      posY = _posY;
      posX = _posX;
      posChanged = true;

      /** Converts numeric degrees to radians */
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }


      // given angle (as a radian) and a distance away from the center, i am
      // trying to find the X/Y position
      //
      // i am want to output the coordinates of


      var cosAngle = Math.cos(_angle.toRad());
      var sinAngle = Math.sin(_angle.toRad());

      //console.log('position', distance + (cosAngle * distance), distance + (sinAngle * distance));

      // <inf-groupoid> Let (x0,y0) be the coordinates of the center of the circle.
      // <inf-groupoid> Let r be the distance away from the center.
      // "x = x0 + r*cos(t)" and "y = y0 + r*sin(t)", where t is the angle.

      var x = centerPoint.x + distance * cosAngle;
      var y = centerPoint.y + distance * sinAngle;

      console.log('position', x, y);

      // Change rod angle according to where the ball has rotated
      rodWrap.css('-webkit-transform', 'rotate(' + _angle + 'deg)');

      // Change rod height so it reaches the ball
      rod.height(distance);
    //}
    //else {

      //ball.css('top', posY - (ballHeight / 2));
      //ball.css('left', posX - (ballWidth / 2));

      //posY = _posY;
      //posX = _posX;
      //posChanged = true;

      //// Change rod angle according to where the ball has rotated
      //rodWrap.css('-webkit-transform', 'rotate(' + angle + 'deg)');

      //[>* Converts numeric degrees to radians <]
      //if (typeof(Number.prototype.toRad) === "undefined") {
        //Number.prototype.toRad = function() {
          //return this * Math.PI / 180;
        //}
      //}

      //var cosAngle = Math.cos(angle.toRad());
      //var sinAngle = Math.sin(angle.toRad());

      //console.log('wut', 100 * cosAngle, 100 * sinAngle);

      //// Change rod height so it reaches the ball
      //rod.height(100);

    //}

    e.preventDefault();
  }


  function handleRetroStickPress(e) {

    ballOffset = ball.offset();
    currentPos = ball.position();
    clickOffset = {left: e.clientX - ballOffset.left, top: e.clientY - ballOffset.top};

    doc.on('mousemove.retrostick', handleRetroStickMove);

    doc.on('mouseup.retrostick', function () {
      $(document).off('mousemove.retrostick');
    });

    e.preventDefault();
  }

}

RetroJoyStick.prototype = {

    get angle(){
      return this._angle;
    },

    set angle(val){
      this._angle = Math.floor(val);
    },

    get distance(){
      return this._distance;
    },

    set distance(val){
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

