function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the class of Helix Coordinate
 * @author sima.zhang
 */
var Util = require('../util');
var Base = require('./base');
var MatrixUtil = Util.MatrixUtil;
var vec2 = MatrixUtil.vec2;

var Helix = function (_Base) {
  _inherits(Helix, _Base);

  Helix.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      startAngle: 1.25 * Math.PI,
      endAngle: 7.25 * Math.PI,
      innerRadius: 0,
      type: 'helix',
      isHelix: true
    });
  };

  function Helix(cfg) {
    _classCallCheck(this, Helix);

    var _this = _possibleConstructorReturn(this, _Base.call(this, cfg));

    _this._init();
    return _this;
  }

  Helix.prototype._init = function _init() {
    var width = this.width;
    var height = this.height;
    var radius = this.radius;
    var innerRadius = this.innerRadius;
    var startAngle = this.startAngle;
    var endAngle = this.endAngle;

    var index = (endAngle - startAngle) / (2 * Math.PI) + 1; // 螺线圈数
    var maxRadius = Math.min(width, height) / 2;
    if (radius && radius >= 0 && radius <= 1) {
      maxRadius = maxRadius * radius;
    }

    var d = Math.floor(maxRadius * (1 - innerRadius) / index);
    var a = d / (Math.PI * 2); // 螺线系数

    var x = {
      start: startAngle,
      end: endAngle
    };
    var y = {
      start: innerRadius * maxRadius,
      end: innerRadius * maxRadius + d * 0.99
    };

    this.a = a;
    this.d = d;
    this.x = x;
    this.y = y;
  };

  Helix.prototype.getCenter = function getCenter() {
    return this.center;
  };

  /**
   * 将百分比数据变成屏幕坐标
   * @param  {Object} point 归一化的点坐标
   * @return {Object}       返回对应的屏幕坐标
   */


  Helix.prototype.convertPoint = function convertPoint(point) {
    var a = this.a;
    var center = this.center;
    var x = void 0;
    var y = void 0;

    if (this.isTransposed) {
      x = point.y;
      y = point.x;
    } else {
      x = point.x;
      y = point.y;
    }

    var thi = this.convertDim(x, 'x');
    var r = a * thi;
    var newY = this.convertDim(y, 'y');

    return {
      x: center.x + Math.cos(thi) * (r + newY),
      y: center.y + Math.sin(thi) * (r + newY)
    };
  };

  /**
   * 将屏幕坐标点还原成百分比数据
   * @param  {Object} point 屏幕坐标
   * @return {Object}       返回对应的归一化后的数据
   */


  Helix.prototype.invertPoint = function invertPoint(point) {
    var center = this.center;
    var a = this.a;
    var d = this.d + this.y.start;
    var v = vec2.subtract([], [point.x, point.y], [center.x, center.y]);
    var thi = vec2.angleTo(v, [1, 0], true);
    var rMin = thi * a; // 坐标与原点的连线在第一圈上的交点，最小r值

    if (vec2.length(v) < rMin) {
      // 坐标与原点的连线不可能小于最小r值，但不排除因小数计算产生的略小于rMin的情况
      rMin = vec2.length(v);
    }

    var index = Math.floor((vec2.length(v) - rMin) / d); // 当前点位于第index圈
    thi = 2 * index * Math.PI + thi;
    var r = a * thi;
    var newY = vec2.length(v) - r;
    newY = Util.snapEqual(newY, 0) ? 0 : newY;

    var x = this.invertDim(thi, 'x');
    var y = this.invertDim(newY, 'y');
    x = Util.snapEqual(x, 0) ? 0 : x;
    y = Util.snapEqual(y, 0) ? 0 : y;

    var rst = {};
    rst.x = this.isTransposed ? y : x;
    rst.y = this.isTransposed ? x : y;
    return rst;
  };

  return Helix;
}(Base);

module.exports = Helix;