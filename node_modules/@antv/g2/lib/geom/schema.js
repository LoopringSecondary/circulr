function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 自定义图形
 * @author dxq613@gmail.com
 */
var GeomBase = require('./base');
var Util = require('../util');
var SizeMixin = require('./mixin/size');
require('./shape/schema');

var Schema = function (_GeomBase) {
  _inherits(Schema, _GeomBase);

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Schema.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'schema';
    cfg.shapeType = 'schema';
    cfg.generatePoints = true;
    return cfg;
  };

  function Schema(cfg) {
    _classCallCheck(this, Schema);

    var _this = _possibleConstructorReturn(this, _GeomBase.call(this, cfg));

    Util.assign(_this, SizeMixin);
    return _this;
  }

  Schema.prototype.createShapePointsCfg = function createShapePointsCfg(obj) {
    var cfg = _GeomBase.prototype.createShapePointsCfg.call(this, obj);
    cfg.size = this.getNormalizedSize(obj);
    return cfg;
  };

  return Schema;
}(GeomBase);

var SchemaDodge = function (_Schema) {
  _inherits(SchemaDodge, _Schema);

  function SchemaDodge() {
    _classCallCheck(this, SchemaDodge);

    return _possibleConstructorReturn(this, _Schema.apply(this, arguments));
  }

  SchemaDodge.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Schema.prototype.getDefaultCfg.call(this);
    cfg.hasDefaultAdjust = true;
    cfg.adjusts = [{ type: 'dodge' }];
    return cfg;
  };

  return SchemaDodge;
}(Schema);

Schema.Dodge = SchemaDodge;

GeomBase.Schema = Schema;
GeomBase.SchemaDodge = SchemaDodge;

module.exports = Schema;