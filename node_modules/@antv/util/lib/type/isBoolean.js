/**
 * 是否是布尔类型
 *
 * @param {Object} value 测试的值
 * @return {Boolean}
 */
var isType = require('./isType');

var isBoolean = function isBoolean(value) {
  return isType(value, 'Boolean');
};

module.exports = isBoolean;