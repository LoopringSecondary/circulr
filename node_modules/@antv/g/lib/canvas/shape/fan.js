var Util = require('../../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');
var ArcMath = require('./math/arc');
var vec2 = require('../../util/matrix').vec2;

var Fan = function Fan(cfg) {
  Fan.superclass.constructor.call(this, cfg);
};

Fan.ATTRS = {
  x: 0,
  y: 0,
  rs: 0,
  re: 0,
  startAngle: 0,
  endAngle: 0,
  clockwise: false,
  lineWidth: 1
};

Util.extend(Fan, Shape);

Util.augment(Fan, {
  canFill: true,
  canStroke: true,
  type: 'fan',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      clockwise: false,
      lineWidth: 1,
      rs: 0,
      re: 0
    };
  },
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rs = attrs.rs;
    var re = attrs.re;
    var startAngle = attrs.startAngle;
    var endAngle = attrs.endAngle;
    var clockwise = attrs.clockwise;
    var lineWidth = this.getHitLineWidth();

    var boxs = ArcMath.box(cx, cy, rs, startAngle, endAngle, clockwise);
    var boxe = ArcMath.box(cx, cy, re, startAngle, endAngle, clockwise);
    var minX = Math.min(boxs.minX, boxe.minX);
    var minY = Math.min(boxs.minY, boxe.minY);
    var maxX = Math.max(boxs.maxX, boxe.maxX);
    var maxY = Math.max(boxs.maxY, boxe.maxY);

    var halfWidth = lineWidth / 2;
    return {
      minX: minX - halfWidth,
      minY: minY - halfWidth,
      maxX: maxX + halfWidth,
      maxY: maxY + halfWidth
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
    var rs = attrs.rs;
    var re = attrs.re;
    var startAngle = attrs.startAngle;
    var endAngle = attrs.endAngle;
    var clockwise = attrs.clockwise;
    var v1 = [1, 0];
    var subv = [x - cx, y - cy];
    var angle = vec2.angleTo(v1, subv);

    var angle1 = ArcMath.nearAngle(angle, startAngle, endAngle, clockwise);

    if (Util.isNumberEqual(angle, angle1)) {
      var ls = vec2.squaredLength(subv);
      if (rs * rs <= ls && ls <= re * re) {
        return true;
      }
    }
    return false;
  },
  _isPointInStroke: function _isPointInStroke(x, y) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rs = attrs.rs;
    var re = attrs.re;
    var startAngle = attrs.startAngle;
    var endAngle = attrs.endAngle;
    var clockwise = attrs.clockwise;
    var lineWidth = this.getHitLineWidth();

    var ssp = {
      x: Math.cos(startAngle) * rs + cx,
      y: Math.sin(startAngle) * rs + cy
    };
    var sep = {
      x: Math.cos(startAngle) * re + cx,
      y: Math.sin(startAngle) * re + cy
    };
    var esp = {
      x: Math.cos(endAngle) * rs + cx,
      y: Math.sin(endAngle) * rs + cy
    };
    var eep = {
      x: Math.cos(endAngle) * re + cx,
      y: Math.sin(endAngle) * re + cy
    };

    if (Inside.line(ssp.x, ssp.y, sep.x, sep.y, lineWidth, x, y)) {
      return true;
    }

    if (Inside.line(esp.x, esp.y, eep.x, eep.y, lineWidth, x, y)) {
      return true;
    }

    if (Inside.arcline(cx, cy, rs, startAngle, endAngle, clockwise, lineWidth, x, y)) {
      return true;
    }

    if (Inside.arcline(cx, cy, re, startAngle, endAngle, clockwise, lineWidth, x, y)) {
      return true;
    }

    return false;
  },
  createPath: function createPath(context) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rs = attrs.rs;
    var re = attrs.re;
    var startAngle = attrs.startAngle;
    var endAngle = attrs.endAngle;
    var clockwise = attrs.clockwise;

    var ssp = {
      x: Math.cos(startAngle) * rs + cx,
      y: Math.sin(startAngle) * rs + cy
    };
    var sep = {
      x: Math.cos(startAngle) * re + cx,
      y: Math.sin(startAngle) * re + cy
    };
    var esp = {
      x: Math.cos(endAngle) * rs + cx,
      y: Math.sin(endAngle) * rs + cy
    };

    context = context || self.get('context');
    context.beginPath();
    context.moveTo(ssp.x, ssp.y);
    context.lineTo(sep.x, sep.y);
    context.arc(cx, cy, re, startAngle, endAngle, clockwise);
    context.lineTo(esp.x, esp.y);
    context.arc(cx, cy, rs, endAngle, startAngle, !clockwise);
    context.closePath();
  }
});

module.exports = Fan;