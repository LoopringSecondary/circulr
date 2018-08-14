var isArray = require('../type/isArray');
var isPlainObject = require('../type/isPlainObject');
var each = require('../each');

var reduce = function reduce(arr, fn, init) {
  if (!isArray(arr) && !isPlainObject(arr)) {
    return arr;
  }
  var result = init;
  each(arr, function (data, i) {
    result = fn(result, data, i);
  });
  return result;
};

module.exports = reduce;