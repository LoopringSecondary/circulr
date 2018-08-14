var isType = require('./isType');

var isString = function isString(str) {
  return isType(str, 'String');
};

module.exports = isString;