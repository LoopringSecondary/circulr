var isType = require('./isType');

var isDate = function isDate(value) {
  return isType(value, 'Date');
};

module.exports = isDate;