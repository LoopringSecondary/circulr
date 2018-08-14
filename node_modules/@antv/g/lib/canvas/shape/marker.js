var Util = require('../../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');
var Format = require('../../util/format');
var PathSegment = require('./util/path-segment');

var Marker = function Marker(cfg) {
  Marker.superclass.constructor.call(this, cfg);
};

Marker.Symbols = {
  // 圆
  circle: function circle(x, y, r) {
    return [['M', x, y], ['m', -r, 0], ['a', r, r, 0, 1, 0, r * 2, 0], ['a', r, r, 0, 1, 0, -r * 2, 0]];
  },

  // 正方形
  square: function square(x, y, r) {
    return [['M', x - r, y - r], ['L', x + r, y - r], ['L', x + r, y + r], ['L', x - r, y + r], ['Z']];
  },

  // 菱形
  diamond: function diamond(x, y, r) {
    return [['M', x - r, y], ['L', x, y - r], ['L', x + r, y], ['L', x, y + r], ['Z']];
  },

  // 三角形
  triangle: function triangle(x, y, r) {
    var diffY = r * Math.sin(1 / 3 * Math.PI);
    return [['M', x - r, y + diffY], ['L', x, y - diffY], ['L', x + r, y + diffY], ['z']];
  },

  // 倒三角形
  'triangle-down': function triangleDown(x, y, r) {
    var diffY = r * Math.sin(1 / 3 * Math.PI);
    return [['M', x - r, y - diffY], ['L', x + r, y - diffY], ['L', x, y + diffY], ['Z']];
  }
};

Marker.ATTRS = {
  path: null,
  lineWidth: 1
};

Util.extend(Marker, Shape);

Util.augment(Marker, {
  type: 'marker',
  canFill: true,
  canStroke: true,
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.radius;
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
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var r = attrs.radius || attrs.r;
    var lineWidth = this.getHitLineWidth();
    return Inside.circle(cx, cy, r + lineWidth / 2, x, y);
  },
  createPath: function createPath(context) {
    var attrs = this.__attrs;
    var x = attrs.x;
    var y = attrs.y;
    var r = attrs.radius || attrs.r;
    var symbol = attrs.symbol || 'circle';
    var method = void 0;
    if (Util.isFunction(symbol)) {
      method = symbol;
    } else {
      method = Marker.Symbols[symbol];
    }
    var path = method(x, y, r);
    path = Format.parsePath(path);
    context.beginPath();
    var preSegment = void 0;
    for (var i = 0; i < path.length; i++) {
      var item = path[i];
      preSegment = new PathSegment(item, preSegment, i === path.length - 1);
      preSegment.draw(context);
    }
  }
});

module.exports = Marker;