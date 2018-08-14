function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The extension function of stack ,which mixin to geom
 * @author dxq613@gmail.com
 */

var Util = require('../../util');
var Adjust = require('./adjust');

/**
 * 数据调整的基类
 * @class Adjust.Stack
 */

var Stack = function (_Adjust) {
  _inherits(Stack, _Adjust);

  function Stack() {
    _classCallCheck(this, Stack);

    return _possibleConstructorReturn(this, _Adjust.apply(this, arguments));
  }

  /**
   * @override
   */
  Stack.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Adjust.prototype.getDefaultCfg.call(this);
    return Util.assign(cfg, {
      /**
       * 仅有一个维度调整时，总的高度
       * @type {Number}
       */
      height: null,
      /**
       * 单个点的大小
       * @type {Number}
       */
      size: 10,
      /**
       * 是否反序进行层叠
       * @type {Boolean}
       */
      reverseOrder: false,

      /**
       * @override
       */
      adjustNames: ['y'] // Only support stack y
    });
  };

  Stack.prototype.processOneDimStack = function processOneDimStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField || 'y';
    var height = self.height;

    var stackY = {};
    // 如果层叠的顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (var i = 0; i < dataArray.length; i++) {
      // var preY = stackHeight;
      var data = dataArray[i];
      // cates
      for (var j = 0; j < data.length; j++) {
        var item = data[j];
        var size = item.size || self.size;
        var stackHeight = size * 2 / height;
        var x = item[xField];
        if (!stackY[x]) {
          stackY[x] = stackHeight / 2;
        }
        item[yField] = stackY[x];
        stackY[x] += stackHeight;
      }
    }
  };

  Stack.prototype.processAdjust = function processAdjust(dataArray) {
    var self = this;
    if (self.yField) {
      self.processStack(dataArray);
    } else {
      self.processOneDimStack(dataArray);
    }
  };

  Stack.prototype.processStack = function processStack(dataArray) {
    var self = this;
    var xField = self.xField;
    var yField = self.yField;
    var count = dataArray.length;
    var stackCache = {
      positive: {},
      negative: {}
    };
    // 层叠顺序翻转
    if (self.reverseOrder) {
      dataArray = dataArray.slice(0).reverse();
    }
    for (var i = 0; i < count; i++) {
      var data = dataArray[i];
      for (var j = 0; j < data.length; j++) {
        var item = data[j];
        var x = item[xField] || 0;
        var y = item[yField] || 0;
        var xkey = x.toString();
        y = Util.isArray(y) ? y[1] : y;
        var direction = y >= 0 ? 'positive' : 'negative';
        if (!stackCache[direction][xkey]) {
          stackCache[direction][xkey] = 0;
        }
        item[yField] = [stackCache[direction][xkey], y + stackCache[direction][xkey]];
        stackCache[direction][xkey] += y;
      }
    }
  };

  return Stack;
}(Adjust);

module.exports = Stack;