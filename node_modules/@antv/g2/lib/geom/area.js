function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 面积图
 * @author dxq613@gmail.com
 */

var GeomBase = require('./base');
var SplitMixin = require('./mixin/split');
var Util = require('../util');
require('./shape/area');

var Area = function (_GeomBase) {
  _inherits(Area, _GeomBase);

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Area.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'area';
    cfg.shapeType = 'area';
    cfg.generatePoints = true;
    cfg.sortable = true;
    return cfg;
  };

  function Area(cfg) {
    _classCallCheck(this, Area);

    var _this = _possibleConstructorReturn(this, _GeomBase.call(this, cfg));

    Util.assign(_this, SplitMixin);
    return _this;
  }

  Area.prototype.draw = function draw(data, container, shapeFactory, index) {
    var self = this;
    var cfg = this.getDrawCfg(data[0]);
    var splitArray = this.splitData(data);

    cfg.origin = data; // path,line,area 等图的origin 是整个序列
    Util.each(splitArray, function (subData, splitedIndex) {
      cfg.splitedIndex = splitedIndex; // 传入分割片段索引 用于生成id
      var points = subData.map(function (obj) {
        return obj.points;
      });
      cfg.points = points;
      var geomShape = shapeFactory.drawShape(cfg.shape, cfg, container);
      self.appendShapeInfo(geomShape, index + splitedIndex);
    });
  };

  return Area;
}(GeomBase);

var AreaStack = function (_Area) {
  _inherits(AreaStack, _Area);

  function AreaStack() {
    _classCallCheck(this, AreaStack);

    return _possibleConstructorReturn(this, _Area.apply(this, arguments));
  }

  AreaStack.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Area.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'stack' }];
    return cfg;
  };

  return AreaStack;
}(Area);

Area.Stack = AreaStack;

GeomBase.Area = Area;
GeomBase.AreaStack = AreaStack;

module.exports = Area;