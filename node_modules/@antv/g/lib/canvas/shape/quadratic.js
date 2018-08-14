var Util = require('../../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');
var Arrow = require('./util/arrow');
var QuadraticMath = require('./math/quadratic');

var Quadratic = function Quadratic(cfg) {
  Quadratic.superclass.constructor.call(this, cfg);
};

Quadratic.ATTRS = {
  p1: null, // 起始点
  p2: null, // 控制点
  p3: null, // 结束点
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Quadratic, Shape);

Util.augment(Quadratic, {
  canStroke: true,
  type: 'quadratic',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      startArrow: false,
      endArrow: false
    };
  },
  calculateBox: function calculateBox() {
    var self = this;
    var attrs = self.__attrs;
    var p1 = attrs.p1,
        p2 = attrs.p2,
        p3 = attrs.p3;

    var lineWidth = this.getHitLineWidth();
    var i = void 0;
    var l = void 0;

    if (Util.isNil(p1) || Util.isNil(p2) || Util.isNil(p3)) {
      return null;
    }
    var halfWidth = lineWidth / 2;
    var xDims = QuadraticMath.extrema(p1[0], p2[0], p3[0]);
    for (i = 0, l = xDims.length; i < l; i++) {
      xDims[i] = QuadraticMath.at(p1[0], p2[0], p3[0], xDims[i]);
    }
    xDims.push(p1[0], p3[0]);
    var yDims = QuadraticMath.extrema(p1[1], p2[1], p3[1]);
    for (i = 0, l = yDims.length; i < l; i++) {
      yDims[i] = QuadraticMath.at(p1[1], p2[1], p3[1], yDims[i]);
    }
    yDims.push(p1[1], p3[1]);

    return {
      minX: Math.min.apply(Math, xDims) - halfWidth,
      maxX: Math.max.apply(Math, xDims) + halfWidth,
      minY: Math.min.apply(Math, yDims) - halfWidth,
      maxY: Math.max.apply(Math, yDims) + halfWidth
    };
  },
  isPointInPath: function isPointInPath(x, y) {
    var self = this;
    var attrs = self.__attrs;
    var p1 = attrs.p1,
        p2 = attrs.p2,
        p3 = attrs.p3;

    var lineWidth = this.getHitLineWidth();

    return Inside.quadraticline(p1[0], p1[1], p2[0], p2[1], p3[0], p3[1], lineWidth, x, y);
  },
  createPath: function createPath(context) {
    var self = this;
    var attrs = self.__attrs;
    var p1 = attrs.p1,
        p2 = attrs.p2,
        p3 = attrs.p3;


    if (Util.isNil(p1) || Util.isNil(p2) || Util.isNil(p3)) {
      return;
    }
    context = context || self.get('context');
    context.beginPath();
    context.moveTo(p1[0], p1[1]);
    context.quadraticCurveTo(p2[0], p2[1], p3[0], p3[1]);
  },
  afterPath: function afterPath(context) {
    var self = this;
    var attrs = self.__attrs;
    var p1 = attrs.p1,
        p2 = attrs.p2,
        p3 = attrs.p3;

    context = context || self.get('context');

    if (attrs.startArrow) {
      Arrow.addStartArrow(context, attrs, p2[0], p2[1], p1[0], p1[1]);
    }

    if (attrs.endArrow) {
      Arrow.addEndArrow(context, attrs, p2[0], p2[1], p3[0], p3[1]);
    }
  },
  getPoint: function getPoint(t) {
    var attrs = this.__attrs;
    return {
      x: QuadraticMath.at(attrs.p1[0], attrs.p2[0], attrs.p3[0], t),
      y: QuadraticMath.at(attrs.p1[1], attrs.p2[1], attrs.p3[1], t)
    };
  }
});

module.exports = Quadratic;