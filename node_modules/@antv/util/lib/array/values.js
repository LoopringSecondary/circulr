var each = require('../each');
var isNil = require('../type/isNil');
var isArray = require('../type/isArray');

var values = function values(data, name) {
  var rst = [];
  var tmpMap = {};
  for (var i = 0; i < data.length; i++) {
    var obj = data[i];
    var value = obj[name];
    if (!isNil(value)) {
      if (!isArray(value)) {
        value = [value];
      }
      each(value, function (val) {
        if (!tmpMap[val]) {
          rst.push(val);
          tmpMap[val] = true;
        }
      });
    }
  }
  return rst;
};

module.exports = values;