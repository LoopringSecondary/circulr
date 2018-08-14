
module.exports = function (extent) {
  var bandwidth = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  var min = extent[0],
      max = extent[1];

  var values = [];
  var tmp = min;
  while (tmp < max) {
    values.push(tmp);
    tmp += bandwidth;
  }
  values.push(max);
  return values;
};