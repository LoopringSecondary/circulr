function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 时间数据作为分类类型
 * @author dxq613@gmail.com
 */

var Category = require('./category');
var Util = require('../util');
var fecha = require('fecha');
var catAuto = require('./auto/cat');
var TimeUtil = require('./time-util');

/**
 * 度量的构造函数
 * @class Scale.TimeCategory
 */

var TimeCategory = function (_Category) {
  _inherits(TimeCategory, _Category);

  function TimeCategory() {
    _classCallCheck(this, TimeCategory);

    return _possibleConstructorReturn(this, _Category.apply(this, arguments));
  }

  /**
   * @override
   */
  TimeCategory.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Category.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * @override
       */
      type: 'timeCat',

      /**
       * 格式化符
       * @type {String}
       */
      mask: 'YYYY-MM-DD',

      /**
       * @override
       */
      tickCount: 7
    });
  };

  TimeCategory.prototype.init = function init() {
    var self = this;
    var values = this.values;
    // 针对时间分类类型，会将时间统一转换为时间戳
    Util.each(values, function (v, i) {
      values[i] = self._toTimeStamp(v);
    });
    values.sort(function (v1, v2) {
      return v1 - v2;
    });

    if (!self.ticks) {
      self.ticks = this.calculateTicks(false);
    }
  };

  /**
   * 计算 ticks
   * @param  {boolean} formated 是否将 ticks 按照指定的 mask 格式化
   * @return {array} 返回 ticks 数组
   */


  TimeCategory.prototype.calculateTicks = function calculateTicks(formated) {
    var self = this;
    var count = self.tickCount;
    var ticks = void 0;
    if (count) {
      var temp = catAuto({
        maxCount: count,
        data: self.values
      });
      ticks = temp.ticks;
    } else {
      ticks = self.values;
    }

    if (formated) {
      Util.each(ticks, function (value, index) {
        ticks[index] = fecha.format(value, self.mask);
      });
    }
    return ticks;
  };

  /**
   * @override
   */


  TimeCategory.prototype.translate = function translate(value) {
    value = this._toTimeStamp(value);
    var index = this.values.indexOf(value);

    if (index === -1) {
      if (Util.isNumber(value) && value < this.values.length) {
        index = value;
      } else {
        index = NaN;
      }
    }
    return index;
  };

  /**
   * @override
   */


  TimeCategory.prototype.scale = function scale(value) {
    var rangeMin = this.rangeMin();
    var rangeMax = this.rangeMax();
    var index = this.translate(value);
    var percent = void 0;

    if (this.values.length === 1) {
      percent = index;
    } else if (index > -1) {
      percent = index / (this.values.length - 1);
    } else {
      percent = 0;
    }

    return rangeMin + percent * (rangeMax - rangeMin);
  };

  /**
   * @override
   */


  TimeCategory.prototype.getText = function getText(value) {
    var result = '';
    var index = this.translate(value);
    if (index > -1) {
      result = this.values[index];
    } else {
      result = value;
    }

    var formatter = this.formatter;
    result = parseInt(result, 10);
    result = formatter ? formatter(result) : fecha.format(result, this.mask);
    return result;
  };

  /**
   * @override
   */


  TimeCategory.prototype.getTicks = function getTicks() {
    var self = this;
    var ticks = this.ticks;
    var rst = [];
    Util.each(ticks, function (tick) {
      var obj = void 0;
      if (Util.isObject(tick)) {
        obj = tick;
      } else {
        obj = {
          text: Util.isString(tick) ? tick : self.getText(tick),
          tickValue: tick, // 用于坐标轴上文本动画时确定前后帧的对应关系
          value: self.scale(tick)
        };
      }
      rst.push(obj);
    });
    return rst;
  };

  // 将时间转换为时间戳


  TimeCategory.prototype._toTimeStamp = function _toTimeStamp(value) {
    return TimeUtil.toTimeStamp(value);
  };

  return TimeCategory;
}(Category);

module.exports = TimeCategory;