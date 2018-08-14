var isType = require('./isType');

var isArray = Array.isArray ? Array.isArray : function (value) {
  return isType(value, 'Array');
};

module.exports = isArray;