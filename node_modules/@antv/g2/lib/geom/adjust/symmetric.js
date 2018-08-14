function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The extension function of symmetric ,which mixin to geom
 * @author huangtonger@aliyun.com
 */

var Util = require('../../util');
var Adjust = require('./adjust');

/**
 * 数据调整的基类
 * @class Adjust.Symmetric
 */

var Symmetric = function (_Adjust) {
  _inherits(Symmetric, _Adjust);

  function Symmetric() {
    _classCallCheck(this, Symmetric);

    return _possibleConstructorReturn(this, _Adjust.apply(this, arguments));
  }

  /**
   * @override
   */
  Symmetric.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Adjust.prototype.getDefaultCfg.call(this);
    return Util.assign(cfg, {
      // 缓存的最大值
      cacheMax: null,
      /**
       * @override
       */
      adjustNames: ['y'] // Only support stack y
    });
  };
  // 获取最大的y值


  Symmetric.prototype._getMax = function _getMax(dim) {
    var self = this;
    var mergeData = self.mergeData;
    var maxRecord = Util.maxBy(mergeData, function (obj) {
      var value = obj[dim];
      if (Util.isArray(value)) {
        return Math.max.apply(null, value);
      }
      return value;
    });
    var maxValue = maxRecord[dim];
    var max = Util.isArray(maxValue) ? Math.max.apply(null, maxValue) : maxValue;
    return max;
  };

  // 获取每个字段最大的值


  Symmetric.prototype._getXValuesMax = function _getXValuesMax() {
    var self = this;
    var yField = self.yField;
    var xField = self.xField;
    var cache = {};
    var mergeData = self.mergeData;
    Util.each(mergeData, function (obj) {
      var xValue = obj[xField];
      var yValue = obj[yField];
      var max = Util.isArray(yValue) ? Math.max.apply(null, yValue) : yValue;
      cache[xValue] = cache[xValue] || 0;
      if (cache[xValue] < max) {
        cache[xValue] = max;
      }
    });
    return cache;
  };

  // 入口函数


  Symmetric.prototype.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = Util.Array.merge(dataArray);
    self.mergeData = mergeData;
    self._processSymmetric(dataArray);
    self.mergeData = null;
  };

  // 处理对称


  Symmetric.prototype._processSymmetric = function _processSymmetric(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;
    var max = self._getMax(yField);
    var first = dataArray[0][0];

    var cache = void 0;
    if (first && Util.isArray(first[yField])) {
      cache = self._getXValuesMax();
    }
    Util.each(dataArray, function (data) {
      Util.each(data, function (obj) {
        var value = obj[yField];
        var offset = void 0;
        if (Util.isArray(value)) {
          var xValue = obj[xField];
          var valueMax = cache[xValue];
          offset = (max - valueMax) / 2;
          var tmp = [];
          /* eslint-disable no-loop-func */
          Util.each(value, function (subVal) {
            // 多个字段
            tmp.push(offset + subVal);
          });
          /* eslint-enable no-loop-func */
          obj[yField] = tmp;
        } else {
          offset = (max - value) / 2;
          obj[yField] = [offset, value + offset];
        }
      });
    });
  };

  return Symmetric;
}(Adjust);

module.exports = Symmetric;