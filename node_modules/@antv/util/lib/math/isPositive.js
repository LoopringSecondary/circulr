var isNumber = require('../type/isNumber');

var isPositive = function isPositive(num) {
  return isNumber(num) && num > 0;
};

module.exports = isPositive;