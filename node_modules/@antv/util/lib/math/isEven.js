var isNumber = require('../type/isNumber');

var isEven = function isEven(num) {
  return isNumber(num) && num % 2 === 0;
};

module.exports = isEven;