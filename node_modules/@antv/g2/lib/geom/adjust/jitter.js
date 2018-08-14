function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview Repositions graphic elements randomly using a normal or uniform distribution
 * @author dxq613@gmail.com
 * reference: http://www-01.ibm.com/support/knowledgecenter/SSLVMB_21.0.0/com.ibm.spss.statistics.help/gpl_statement_element_jitter.htm
 */

var Util = require('../../util');
var Adjust = require('./adjust');

/**
 * 数据调整的基类
 * @class Adjust.Jitter
 */

var Jitter = function (_Adjust) {
  _inherits(Jitter, _Adjust);

  function Jitter() {
    _classCallCheck(this, Jitter);

    return _possibleConstructorReturn(this, _Adjust.apply(this, arguments));
  }

  Jitter.prototype.getAdjustOffset = function getAdjustOffset(pre, next) {
    var r = Math.random(); // 随机位置，均匀分布
    var avg = next - pre; // * length
    var append = avg * 0.05;
    return pre + append + avg * 0.9 * r;
  };

  // adjust group data


  Jitter.prototype._adjustGroup = function _adjustGroup(group, dim, key, values) {
    var self = this;
    var range = self.getAdjustRange(dim, key, values);

    Util.each(group, function (record) {
      record[dim] = self.getAdjustOffset(range.pre, range.next); // 获取调整的位置
    });
  };

  Jitter.prototype.adjustDim = function adjustDim(dim, values, data) {
    var self = this;
    var groupData = self.groupData(data, dim);
    Util.each(groupData, function (group, key) {
      key = parseFloat(key);
      self._adjustGroup(group, dim, key, values);
    });
  };

  return Jitter;
}(Adjust);

module.exports = Jitter;