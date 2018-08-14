var forIn = require('lodash/forIn');
var isPlainObject = require('lodash/isPlainObject');
var isString = require('lodash/isString');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

/*
 * options: {
 *   type: 'pick',
 *   fields: [],
 * }
 */

function transform(dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var map = options.map || {};
  var cleanMap = {};
  if (isPlainObject(map)) {
    forIn(map, function (value, key) {
      if (isString(value) && isString(key)) {
        cleanMap[key] = value;
      }
    });
  }
  dataView.rows.forEach(function (row) {
    forIn(map, function (newKey, key) {
      var temp = row[key];
      delete row[key];
      row[newKey] = temp;
    });
  });
}

registerTransform('rename', transform);
registerTransform('rename-fields', transform);