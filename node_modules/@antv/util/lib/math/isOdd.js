var isNumber = require('../type/isNumber');

var isOdd = function isOdd(num) {
  return isNumber(num) && num % 2 !== 0;
};

module.exports = isOdd;