var isNumber = require('../type/isNumber');

var isNagative = function isNagative(num) {
  return isNumber(num) && num < 0;
};

module.exports = isNagative;