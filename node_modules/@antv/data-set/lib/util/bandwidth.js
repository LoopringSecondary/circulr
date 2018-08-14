var _require = require('simple-statistics'),
    standardDeviation = _require.standardDeviation;

module.exports = {
  silverman: function silverman(arr) {
    var stdev = standardDeviation(arr);
    var num = 4 * Math.pow(stdev, 5);
    var denom = 3 * arr.length;
    return Math.pow(num / denom, 0.2);
  }
};