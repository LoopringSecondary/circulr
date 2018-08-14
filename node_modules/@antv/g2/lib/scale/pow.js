function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 使用pow进行度量计算
 * @author dxq613@gmail.com
 */

var Linear = require('./linear');
var Util = require('../util');

// 求以a为次幂，结果为b的基数，如 x^^a = b;求x
function calBase(a, b) {
  var e = Math.E;
  var value = Math.pow(e, Math.log(b) / a); // 使用换底公式求底
  return value;
}

/**
 * 度量的Pow计算
 * @class Scale.Log
 */

var Pow = function (_Linear) {
  _inherits(Pow, _Linear);

  function Pow() {
    _classCallCheck(this, Pow);

    return _possibleConstructorReturn(this, _Linear.apply(this, arguments));
  }

  /**
   * @override
   */
  Pow.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Linear.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * @override
       */
      type: 'pow',

      /**
       * 进行pow计算的基数
       * @type {Number}
       */
      exponent: 2,

      /**
       * @override
       * pow 的坐标点的个数控制在10个以下
       * @type {Number}
       */
      tickCount: 10
    });
  };

  /**
   * @override
   */


  Pow.prototype.calculateTicks = function calculateTicks() {
    var self = this;
    var exponent = self.exponent;
    var min = void 0;
    var max = Math.ceil(calBase(exponent, self.max));

    if (self.min >= 0) {
      min = Math.floor(calBase(exponent, self.min));
    } else {
      min = 0;
    }
    if (min > max) {
      var tmp = max;
      max = min;
      min = tmp;
    }
    var count = max - min;
    var tickCount = self.tickCount;
    var avg = Math.ceil(count / tickCount);
    var ticks = [];

    for (var i = min; i < max + avg; i = i + avg) {
      ticks.push(Math.pow(i, exponent));
    }
    return ticks;
  };

  // 获取度量计算时，value占的定义域百分比


  Pow.prototype._getScalePercent = function _getScalePercent(value) {
    var max = this.max;
    var min = this.min;
    if (max === min) {
      return 0;
    }
    var exponent = this.exponent;
    var percent = (calBase(exponent, value) - calBase(exponent, min)) / (calBase(exponent, max) - calBase(exponent, min));
    return percent;
  };

  /**
   * @override
   */


  Pow.prototype.scale = function scale(value) {
    var percent = this._getScalePercent(value);
    var rangeMin = this.rangeMin();
    var rangeMax = this.rangeMax();
    return rangeMin + percent * (rangeMax - rangeMin);
  };

  /**
   * @override
   */


  Pow.prototype.invert = function invert(value) {
    var percent = (value - this.rangeMin()) / (this.rangeMax() - this.rangeMin());
    var exponent = this.exponent;
    var max = calBase(exponent, this.max);
    var min = calBase(exponent, this.min);
    var tmp = percent * (max - min) + min;
    return Math.pow(tmp, exponent);
  };

  return Pow;
}(Linear);

module.exports = Pow;