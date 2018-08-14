var each = require('../each');
var toArray = require('../toArray');

var union = function union() {
  var result = new Set();
  var values = [];
  each(arguments, function (arg) {
    values = toArray(arg);
    each(values, function (val) {
      result.add(val);
    });
  });
  return Array.from(result);
};

module.exports = union;