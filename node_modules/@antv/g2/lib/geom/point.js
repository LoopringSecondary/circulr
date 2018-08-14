function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 点图
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');
var Util = require('../util');
require('./shape/point');

var Point = function (_GeomBase) {
  _inherits(Point, _GeomBase);

  function Point() {
    _classCallCheck(this, Point);

    return _possibleConstructorReturn(this, _GeomBase.apply(this, arguments));
  }

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Point.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'point';
    cfg.shapeType = 'point';
    cfg.generatePoints = true;
    return cfg;
  };

  Point.prototype.drawPoint = function drawPoint(obj, container, shapeFactory, index) {
    var self = this;
    var shape = obj.shape;
    var cfg = self.getDrawCfg(obj);
    var geomShape = void 0;
    if (Util.isArray(obj.y)) {
      var hasAdjust = self.hasStack();
      Util.each(obj.y, function (y, idx) {
        cfg.y = y;
        cfg.yIndex = idx;
        if (!hasAdjust || idx !== 0) {
          geomShape = shapeFactory.drawShape(shape, cfg, container);
          self.appendShapeInfo(geomShape, index + idx);
        }
      });
    } else if (!Util.isNil(obj.y)) {
      geomShape = shapeFactory.drawShape(shape, cfg, container);
      self.appendShapeInfo(geomShape, index);
    }
  };

  return Point;
}(GeomBase);

var PointJitter = function (_Point) {
  _inherits(PointJitter, _Point);

  function PointJitter() {
    _classCallCheck(this, PointJitter);

    return _possibleConstructorReturn(this, _Point.apply(this, arguments));
  }

  PointJitter.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Point.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'jitter' }];
    return cfg;
  };

  return PointJitter;
}(Point);

var PointStack = function (_Point2) {
  _inherits(PointStack, _Point2);

  function PointStack() {
    _classCallCheck(this, PointStack);

    return _possibleConstructorReturn(this, _Point2.apply(this, arguments));
  }

  PointStack.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Point2.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'stack' }];
    return cfg;
  };

  return PointStack;
}(Point);

Point.Jitter = PointJitter;
Point.Stack = PointStack;

GeomBase.Point = Point;
GeomBase.PointJitter = PointJitter;
GeomBase.PointStack = PointStack;

module.exports = Point;