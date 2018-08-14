var toString = require('../toString');

var upperCase = function upperCase(str) {
  return toString(str).toUpperCase();
};

module.exports = upperCase;