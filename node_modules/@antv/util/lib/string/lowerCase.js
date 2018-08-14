var toString = require('../toString');

var lowerCase = function lowerCase(str) {
  return toString(str).toLowerCase();
};

module.exports = lowerCase;