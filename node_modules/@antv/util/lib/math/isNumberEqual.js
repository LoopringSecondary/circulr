var PRECISION = 0.00001; // numbers less than this is considered as 0

var isNumberEqual = function isNumberEqual(a, b) {
  return Math.abs(a - b) < PRECISION;
};

module.exports = isNumberEqual;