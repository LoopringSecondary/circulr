function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview Moves graphic elements next to other graphic elements that appear at the same value, rather than superimposing them.
 * @fileOverview dxq613@gmail.com
 */

var Util = require('../../util');
var Adjust = require('./adjust');
var Global = require('../../global');
/**
 * 数据调整的基类
 * @class Adjust.Dodge
 */

var Dodge = function (_Adjust) {
  _inherits(Dodge, _Adjust);

  function Dodge() {
    _classCallCheck(this, Dodge);

    return _possibleConstructorReturn(this, _Adjust.apply(this, arguments));
  }

  Dodge.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Adjust.prototype.getDefaultCfg.call(this);
    return Util.assign(cfg, {
      /**
       * 调整过程中,2个数据的间距
       * @type {Number}
       */
      marginRatio: 1 / 2,

      /**
       * 调整占单位宽度的比例,例如：占2个分类间距的 1/2
       * @type {Number}
       */
      dodgeRatio: Global.widthRatio.column,

      dodgeBy: null
    });
  };

  /**
   * @protected
   * @override
   */


  Dodge.prototype.processAdjust = function processAdjust(dataArray) {
    var self = this;
    var mergeData = Util.Array.merge(dataArray);
    var dodgeDim = self.dodgeBy;
    var adjDataArray = dataArray;
    if (dodgeDim) {
      // 如果指定了分组dim的字段
      adjDataArray = Util.Array.group(mergeData, dodgeDim);
    }
    self.cacheMap = {};
    self.adjDataArray = adjDataArray;
    self.mergeData = mergeData;
    self.adjustData(adjDataArray, mergeData);

    self.adjDataArray = null;
    self.mergeData = null;
  };

  Dodge.prototype.getDistribution = function getDistribution(dim) {
    var self = this;
    var dataArray = self.adjDataArray;
    var cacheMap = self.cacheMap;
    var map = cacheMap[dim];
    if (!map) {
      map = {};
      Util.each(dataArray, function (data, index) {
        var values = Util.Array.values(data, dim);
        if (!values.length) {
          values.push(0);
        }
        Util.each(values, function (val) {
          if (!map[val]) {
            map[val] = [];
          }
          map[val].push(index);
        });
      });
      cacheMap[dim] = map;
    }

    return map;
  };

  Dodge.prototype.adjustDim = function adjustDim(dim, values, data, frameCount, frameIndex) {
    var self = this;
    var map = self.getDistribution(dim);
    var groupData = self.groupData(data, dim); // 根据值分组

    Util.each(groupData, function (group, key) {
      key = parseFloat(key);
      var range = void 0;
      if (values.length === 1) {
        range = {
          pre: values[0] - 1,
          next: values[0] + 1
        };
      } else {
        range = self.getAdjustRange(dim, key, values);
      }
      Util.each(group, function (record) {
        var value = record[dim];
        var valueArr = map[value];
        var valIndex = valueArr.indexOf(frameIndex);
        record[dim] = self.getDodgeOffset(range, valIndex, valueArr.length);
      });
    });
  };

  Dodge.prototype.getDodgeOffset = function getDodgeOffset(range, index, count) {
    var self = this;
    var pre = range.pre;
    var next = range.next;
    var tickLength = next - pre;
    var dodgeRatio = self.dodgeRatio;
    var width = tickLength * dodgeRatio / count;
    var margin = self.marginRatio * width;
    var offset = 1 / 2 * (tickLength - count * width - (count - 1) * margin) + ((index + 1) * width + index * margin) - 1 / 2 * width - 1 / 2 * tickLength;
    return (pre + next) / 2 + offset;
  };

  return Dodge;
}(Adjust);

module.exports = Dodge;