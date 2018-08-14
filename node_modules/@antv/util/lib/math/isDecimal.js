var isNumber = require('../type/isNumber');

var isDecimal = function isDecimal(num) {
  return isNumber(num) && num % 1 !== 0;
};

module.exports = isDecimal;