function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The data is replaced with constant
 * @author dxq613@gmail.com
 */

var Base = require('./base');
var Util = require('../util');

var Identity = function (_Base) {
  _inherits(Identity, _Base);

  function Identity() {
    _classCallCheck(this, Identity);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  /**
   * @override
   */
  Identity.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      isIdentity: true,
      /**
       * @override
       * @type {String}
       */
      type: 'identity',

      /**
       * 常量值
       * @type {*}
       */
      value: null
    });
  };

  /**
   * @override
   */


  Identity.prototype.getText = function getText() {
    return this.value.toString();
  };

  /**
   * @override
   */


  Identity.prototype.scale = function scale(value) {
    if (this.value !== value && Util.isNumber(value)) {
      return value;
    }
    return this.range[0];
  };

  /**
   * @override
   */


  Identity.prototype.invert = function invert() {
    return this.value;
  };

  return Identity;
}(Base);

module.exports = Identity;