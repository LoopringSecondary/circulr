var isNil = require('./type/isNil');
var isArrayLike = require('./type/isArrayLike');
var getType = require('./type/getType');
var isPrototype = require('./type/isPrototype');
var hasOwnProperty = Object.prototype.hasOwnProperty;

function isEmpty(value) {
  /**
   * isEmpty(null) => true
   * isEmpty() => true
   * isEmpty(true) => true
   * isEmpty(1) => true
   * isEmpty([1, 2, 3]) => false
   * isEmpty('abc') => false
   * isEmpty({ a: 1 }) => false
   */
  if (isNil(value)) {
    return true;
  }
  if (isArrayLike(value)) {
    return !value.length;
  }
  var type = getType(value);
  if (type === 'Map' || type === 'Set') {
    return !value.size;
  }
  if (isPrototype(value)) {
    return !Object.keys(value).length;
  }
  for (var key in value) {
    if (hasOwnProperty.call(value, key)) {
      return false;
    }
  }
  return true;
}

module.exports = isEmpty;