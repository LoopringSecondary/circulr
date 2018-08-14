function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 路径图，无序的线图
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');
var SplitMixin = require('./mixin/split');
var Util = require('../util');

var Path = function (_GeomBase) {
  _inherits(Path, _GeomBase);

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Path.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'path';
    cfg.shapeType = 'line';
    return cfg;
  };

  function Path(cfg) {
    _classCallCheck(this, Path);

    var _this = _possibleConstructorReturn(this, _GeomBase.call(this, cfg));

    Util.assign(_this, SplitMixin);
    return _this;
  }

  Path.prototype.getDrawCfg = function getDrawCfg(obj) {
    var cfg = _GeomBase.prototype.getDrawCfg.call(this, obj);
    cfg.isStack = this.hasStack();
    return cfg;
  };

  Path.prototype.draw = function draw(data, container, shapeFactory, index) {
    var self = this;
    var splitArray = this.splitData(data);

    var cfg = this.getDrawCfg(data[0]);
    cfg.origin = data; // path,line 等图的origin 是整个序列
    Util.each(splitArray, function (subData, splitedIndex) {
      if (!Util.isEmpty(subData)) {
        cfg.splitedIndex = splitedIndex; // 传入分割片段索引 用于生成id
        cfg.points = subData;
        var geomShape = shapeFactory.drawShape(cfg.shape, cfg, container);
        self.appendShapeInfo(geomShape, index + splitedIndex);
      }
    });
  };

  return Path;
}(GeomBase);

GeomBase.Path = Path;

module.exports = Path;