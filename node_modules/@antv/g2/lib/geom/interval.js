function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview interval geometry
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');
var Util = require('../util');
var SizeMixin = require('./mixin/size');
require('./shape/interval');

var Interval = function (_GeomBase) {
  _inherits(Interval, _GeomBase);

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Interval.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'interval';
    cfg.shapeType = 'interval';
    cfg.generatePoints = true;
    return cfg;
  };

  function Interval(cfg) {
    _classCallCheck(this, Interval);

    var _this = _possibleConstructorReturn(this, _GeomBase.call(this, cfg));

    Util.assign(_this, SizeMixin);
    return _this;
  }

  Interval.prototype.createShapePointsCfg = function createShapePointsCfg(obj) {
    var cfg = _GeomBase.prototype.createShapePointsCfg.call(this, obj);
    cfg.size = this.getNormalizedSize(obj);
    return cfg;
  };

  Interval.prototype.clearInner = function clearInner() {
    _GeomBase.prototype.clearInner.call(this);
    this.set('defaultSize', null);
  };

  return Interval;
}(GeomBase);

var IntervalStack = function (_Interval) {
  _inherits(IntervalStack, _Interval);

  function IntervalStack() {
    _classCallCheck(this, IntervalStack);

    return _possibleConstructorReturn(this, _Interval.apply(this, arguments));
  }

  IntervalStack.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interval.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'stack' }];
    return cfg;
  };

  return IntervalStack;
}(Interval);

var IntervalDodge = function (_Interval2) {
  _inherits(IntervalDodge, _Interval2);

  function IntervalDodge() {
    _classCallCheck(this, IntervalDodge);

    return _possibleConstructorReturn(this, _Interval2.apply(this, arguments));
  }

  IntervalDodge.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interval2.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'dodge' }];
    return cfg;
  };

  return IntervalDodge;
}(Interval);

var IntervalSymmetric = function (_Interval3) {
  _inherits(IntervalSymmetric, _Interval3);

  function IntervalSymmetric() {
    _classCallCheck(this, IntervalSymmetric);

    return _possibleConstructorReturn(this, _Interval3.apply(this, arguments));
  }

  IntervalSymmetric.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interval3.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'symmetric' }];
    return cfg;
  };

  return IntervalSymmetric;
}(Interval);

Interval.Stack = IntervalStack;
Interval.Dodge = IntervalDodge;
Interval.Symmetric = IntervalSymmetric;

GeomBase.Interval = Interval;
GeomBase.IntervalStack = IntervalStack;
GeomBase.IntervalDodge = IntervalDodge;
GeomBase.IntervalSymmetric = IntervalSymmetric;

module.exports = Interval;