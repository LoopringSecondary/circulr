function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 边，用于关系图的边
 * @author dxq613@gmail.com
 */

var GeomBase = require('./base');
require('./shape/edge');

var Edge = function (_GeomBase) {
  _inherits(Edge, _GeomBase);

  function Edge() {
    _classCallCheck(this, Edge);

    return _possibleConstructorReturn(this, _GeomBase.apply(this, arguments));
  }

  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Edge.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _GeomBase.prototype.getDefaultCfg.call(this);
    cfg.type = 'edge';
    cfg.shapeType = 'edge';
    cfg.generatePoints = true;
    return cfg;
  };

  return Edge;
}(GeomBase);

GeomBase.Edge = Edge;

module.exports = Edge;