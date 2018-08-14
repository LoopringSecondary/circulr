function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the class of Polar Coordinate
 * @author sima.zhang
 */
var Util = require('../util');
var Base = require('./base');
var MatrixUtil = Util.MatrixUtil;
var mat3 = MatrixUtil.mat3;
var vec2 = MatrixUtil.vec2;
var vec3 = MatrixUtil.vec3;

var Polar = function (_Base) {
  _inherits(Polar, _Base);

  Polar.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      startAngle: -Math.PI / 2,
      endAngle: Math.PI * 3 / 2,
      innerRadius: 0,
      type: 'polar',
      isPolar: true
    });
  };

  function Polar(cfg) {
    _classCallCheck(this, Polar);

    var _this = _possibleConstructorReturn(this, _Base.call(this, cfg));

    _this._init();
    return _this;
  }

  Polar.prototype._init = function _init() {
    var radius = this.radius;
    var innerRadius = this.innerRadius;
    var startAngle = this.startAngle;
    var endAngle = this.endAngle;
    var center = this.center;
    var oneBox = this.getOneBox();

    var oneWidth = oneBox.maxX - oneBox.minX;
    var oneHeight = oneBox.maxY - oneBox.minY;
    var left = Math.abs(oneBox.minX) / oneWidth;
    var top = Math.abs(oneBox.minY) / oneHeight;
    var width = this.width;
    var height = this.height;
    var maxRadius = void 0;
    var circleCentre = void 0;
    if (height / oneHeight > width / oneWidth) {
      // width为主
      maxRadius = width / oneWidth;
      circleCentre = {
        x: center.x - (0.5 - left) * width,
        y: center.y - (0.5 - top) * maxRadius * oneHeight
      };
    } else {
      // height为主
      maxRadius = height / oneHeight;
      circleCentre = {
        x: center.x - (0.5 - left) * maxRadius * oneWidth,
        y: center.y - (0.5 - top) * height
      };
    }

    if (!radius) {
      radius = maxRadius;
    } else if (radius > 0 && radius <= 1) {
      radius = maxRadius * radius;
    } else if (radius <= 0 || radius > maxRadius) {
      radius = maxRadius;
    }

    var x = {
      start: startAngle,
      end: endAngle
    };

    var y = {
      start: innerRadius * radius,
      end: radius
    };

    this.x = x;
    this.y = y;
    this.radius = radius;
    this.circleCentre = circleCentre;
    this.center = circleCentre;
  };

  Polar.prototype.getCenter = function getCenter() {
    return this.circleCentre;
  };

  Polar.prototype.getOneBox = function getOneBox() {
    var startAngle = this.startAngle;
    var endAngle = this.endAngle;
    if (Math.abs(endAngle - startAngle) >= Math.PI * 2) {
      return {
        minX: -1,
        maxX: 1,
        minY: -1,
        maxY: 1
      };
    }
    var xs = [0, Math.cos(startAngle), Math.cos(endAngle)];
    var ys = [0, Math.sin(startAngle), Math.sin(endAngle)];

    for (var i = Math.min(startAngle, endAngle); i < Math.max(startAngle, endAngle); i += Math.PI / 18) {
      xs.push(Math.cos(i));
      ys.push(Math.sin(i));
    }

    return {
      minX: Math.min.apply(Math, xs),
      maxX: Math.max.apply(Math, xs),
      minY: Math.min.apply(Math, ys),
      maxY: Math.max.apply(Math, ys)
    };
  };

  Polar.prototype.getRadius = function getRadius() {
    return this.radius;
  };

  Polar.prototype.convertPoint = function convertPoint(point) {
    var center = this.getCenter();
    var x = this.isTransposed ? point.y : point.x;
    var y = this.isTransposed ? point.x : point.y;

    x = this.convertDim(x, 'x');
    y = this.convertDim(y, 'y');

    return {
      x: center.x + Math.cos(x) * y,
      y: center.y + Math.sin(x) * y
    };
  };

  Polar.prototype.invertPoint = function invertPoint(point) {
    var center = this.getCenter();
    var vPoint = [point.x - center.x, point.y - center.y];
    var x = this.x;
    var m = [1, 0, 0, 0, 1, 0, 0, 0, 1];
    mat3.rotate(m, m, x.start);

    var vStart = [1, 0, 0];
    vec3.transformMat3(vStart, vStart, m);
    vStart = [vStart[0], vStart[1]];
    var angle = vec2.angleTo(vStart, vPoint, x.end < x.start);
    if (Util.snapEqual(angle, Math.PI * 2)) {
      angle = 0;
    }
    var radius = vec2.length(vPoint);

    var xPercent = angle / (x.end - x.start);
    xPercent = x.end - x.start > 0 ? xPercent : -xPercent;

    var yPercent = this.invertDim(radius, 'y');
    var rst = {};
    rst.x = this.isTransposed ? yPercent : xPercent;
    rst.y = this.isTransposed ? xPercent : yPercent;
    return rst;
  };

  return Polar;
}(Base);

module.exports = Polar;