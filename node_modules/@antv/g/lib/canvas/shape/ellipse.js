var Util = require('../../util/index');
var Shape = require('../core/shape');
var Inside = require('./util/inside');
var mat3 = require('../../util/matrix').mat3;
var vec3 = require('../../util/matrix').vec3;

var Ellipse = function Ellipse(cfg) {
  Ellipse.superclass.constructor.call(this, cfg);
};

Ellipse.ATTRS = {
  x: 0,
  y: 0,
  rx: 1,
  ry: 1,
  lineWidth: 1
};

Util.extend(Ellipse, Shape);

Util.augment(Ellipse, {
  canFill: true,
  canStroke: true,
  type: 'ellipse',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1
    };
  },
  calculateBox: function calculateBox() {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rx = attrs.rx;
    var ry = attrs.ry;
    var lineWidth = this.getHitLineWidth();
    var halfXWidth = rx + lineWidth / 2;
    var halfYWidth = ry + lineWidth / 2;

    return {
      minX: cx - halfXWidth,
      minY: cy - halfYWidth,
      maxX: cx + halfXWidth,
      maxY: cy + halfYWidth
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
    var rx = attrs.rx;
    var ry = attrs.ry;

    var r = rx > ry ? rx : ry;
    var scaleX = rx > ry ? 1 : rx / ry;
    var scaleY = rx > ry ? ry / rx : 1;

    var p = [x, y, 1];
    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    mat3.scale(m, m, [scaleX, scaleY]);
    mat3.translate(m, m, [cx, cy]);
    var inm = mat3.invert([], m);
    vec3.transformMat3(p, p, inm);

    return Inside.circle(0, 0, r, p[0], p[1]);
  },
  _isPointInStroke: function _isPointInStroke(x, y) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rx = attrs.rx;
    var ry = attrs.ry;
    var lineWidth = this.getHitLineWidth();

    var r = rx > ry ? rx : ry;
    var scaleX = rx > ry ? 1 : rx / ry;
    var scaleY = rx > ry ? ry / rx : 1;
    var p = [x, y, 1];
    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    mat3.scale(m, m, [scaleX, scaleY]);
    mat3.translate(m, m, [cx, cy]);
    var inm = mat3.invert([], m);
    vec3.transformMat3(p, p, inm);

    return Inside.arcline(0, 0, r, 0, Math.PI * 2, false, lineWidth, p[0], p[1]);
  },
  createPath: function createPath(context) {
    var attrs = this.__attrs;
    var cx = attrs.x;
    var cy = attrs.y;
    var rx = attrs.rx;
    var ry = attrs.ry;

    context = context || self.get('context');
    var r = rx > ry ? rx : ry;
    var scaleX = rx > ry ? 1 : rx / ry;
    var scaleY = rx > ry ? ry / rx : 1;

    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    mat3.scale(m, m, [scaleX, scaleY]);
    mat3.translate(m, m, [cx, cy]);
    context.beginPath();
    context.save();
    context.transform(m[0], m[1], m[3], m[4], m[6], m[7]);
    context.arc(0, 0, r, 0, Math.PI * 2);
    context.restore();
    context.closePath();
  }
});

module.exports = Ellipse;