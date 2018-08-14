function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the opacity attribute of core
 * @author huangtonger@aliyun.com
 */

var Base = require('./base');

/**
 * 视觉通道 Opacity
 * @class Attr.Opacity
 */

var Opacity = function (_Base) {
  _inherits(Opacity, _Base);

  function Opacity(cfg) {
    _classCallCheck(this, Opacity);

    var _this = _possibleConstructorReturn(this, _Base.call(this, cfg));

    _this.names = ['opacity'];
    _this.type = 'opacity';
    _this.gradient = null;
    return _this;
  }

  return Opacity;
}(Base);

module.exports = Opacity;