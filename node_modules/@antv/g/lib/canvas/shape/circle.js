var Util = require('../../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');

var Circle = function Circle(cfg) {
  Circle.superclass.constructor.call(this, cfg);
};

Circle.ATTRS = {
  x: 0,
  y: 0,
  r: 0,
  lineWidth: 1
};

Util.extend(Circle, Shape);

Util.augment(Circle, {
  canFill: true,
  canStroke: true,
  type: 'circle',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;
    var lineWidth = this.getHitLineWidth();
    var halfWidth = lineWidth / 2 + r;
    return {
      minX: cx - halfWidth,
      minY: cy - halfWidth,
      maxX: cx + halfWidth,
      maxY: cy + halfWidth
    };
  },
  isPointInPath: function isPointInPath(x, y) {
    var fill = this.hasFill();
    var stroke = this.hasStroke();
    if (fill && stroke) {
      return this._isPointInFill(x, y) || this._isPointInStroke(x, y);
    }

    if (fill) {
      return this._isPointInFill(x, y);
    }

    if (stroke) {
      return this._isPointInStroke(x, y);
    }

    return false;
  },
  _isPointInFill: function _isPointInFill(x, y) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;

    return Inside.circle(cx, cy, r, x, y);
  },
  _isPointInStroke: function _isPointInStroke(x, y) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;
    var lineWidth = this.getHitLineWidth();

    return Inside.arcline(cx, cy, r, 0, Math.PI * 2, false, lineWidth, x, y);
  },
  createPath: function createPath(context) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.r;
    context = context || self.get('context');

    context.beginPath();
    context.arc(cx, cy, r, 0, Math.PI * 2, false);
    context.closePath();
  }
});

module.exports = Circle;