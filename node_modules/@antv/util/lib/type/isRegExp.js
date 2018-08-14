var isType = require('./isType');

var isRegExp = function isRegExp(str) {
  return isType(str, 'RegExp');
};

module.exports = isRegExp;