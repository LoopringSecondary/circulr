var each = require('./each');
var isArrayLike = require('./type/isArrayLike');

var map = function map(arr, func) {
  if (!isArrayLike(arr)) {
    return arr;
  }
  var result = [];
  each(arr, function (value, index) {
    result.push(func(value, index));
  });
  return result;
};

module.exports = map;