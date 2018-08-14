var isArray = require('lodash/isArray');
var isFunction = require('lodash/isFunction');
var isString = require('lodash/isString');

module.exports = function (arr) {
  var keys = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  var comparer = void 0;
  if (isFunction(keys)) {
    comparer = keys;
  } else if (isArray(keys)) {
    comparer = function comparer(a, b) {
      for (var i = 0; i < keys.length; i++) {
        var key = keys[i];
        if (a[key] < b[key]) {
          return -1;
        }
        if (a[key] > b[key]) {
          return 1;
        }
      }
      return 0;
    };
  } else if (isString(keys)) {
    comparer = function comparer(a, b) {
      if (a[keys] < b[keys]) {
        return -1;
      }
      if (a[keys] > b[keys]) {
        return 1;
      }
      return 0;
    };
  }
  return arr.sort(comparer);
};