function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The measurement of linear data scale function
 * @author dxq613@gmail.com
 */

var Linear = require('./linear');
var Util = require('../util');
var timeAuto = require('./auto/time');
var fecha = require('fecha');
var TimeUtil = require('./time-util');

/**
 * 时间度量的构造函数
 * @class Scale.Time
 */

var Time = function (_Linear) {
  _inherits(Time, _Linear);

  function Time() {
    _classCallCheck(this, Time);

    return _possibleConstructorReturn(this, _Linear.apply(this, arguments));
  }

  /**
   * @override
   */
  Time.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Linear.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * @override
       */
      type: 'time',

      /**
       * 格式化符
       * @type {String}
       */
      mask: 'YYYY-MM-DD'
    });
  };

  /**
   * @override
   */


  Time.prototype.init = function init() {
    var self = this;
    var values = self.values;
    if (values && values.length) {
      // 重新计算最大最小值
      var timeStamps = [];
      var min = Infinity; // 最小值
      var secondMin = min; // 次小值
      var max = 0;
      // 使用一个循环，计算min,max,secondMin
      Util.each(values, function (v) {
        var timeStamp = self._toTimeStamp(v);
        if (isNaN(timeStamp)) {
          throw new TypeError('Invalid Time: ' + v);
        }
        if (min > timeStamp) {
          secondMin = min;
          min = timeStamp;
        } else if (secondMin > timeStamp) {
          secondMin = timeStamp;
        }
        if (max < timeStamp) {
          max = timeStamp;
        }
        timeStamps.push(timeStamp);
      });
      // 存在多个值时，设置最小间距
      if (values.length > 1) {
        self.minTickInterval = secondMin - min;
      }
      if (Util.isNil(self.min) || self._toTimeStamp(self.min) > min) {
        self.min = min;
      }
      if (Util.isNil(self.max) || self._toTimeStamp(self.max) < max) {
        self.max = max;
      }
    }
    _Linear.prototype.init.call(this);
  };

  Time.prototype.calculateTicks = function calculateTicks() {
    var self = this;
    var min = self.min;
    var max = self.max;
    var count = self.tickCount;
    var interval = self.tickInterval;
    var tmp = timeAuto({
      min: min,
      max: max,
      minCount: count,
      maxCount: count,
      interval: interval,
      minInterval: self.minTickInterval
    });
    return tmp.ticks;
  };

  /**
   * @override
   */


  Time.prototype.getText = function getText(value) {
    var formatter = this.formatter;
    value = this.translate(value);
    value = formatter ? formatter(value) : fecha.format(value, this.mask);
    return value;
  };

  /**
   * @override
   */


  Time.prototype.scale = function scale(value) {
    if (Util.isString(value)) {
      value = this.translate(value);
    }
    return _Linear.prototype.scale.call(this, value);
  };

  /**
   * @override
   */


  Time.prototype.translate = function translate(value) {
    return this._toTimeStamp(value);
  };

  // 将时间转换为时间戳


  Time.prototype._toTimeStamp = function _toTimeStamp(value) {
    return TimeUtil.toTimeStamp(value);
  };

  return Time;
}(Linear);

module.exports = Time;