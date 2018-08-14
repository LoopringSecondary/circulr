var assign = require('lodash/assign');
var forIn = require('lodash/forIn');
var has = require('lodash/has');
var isFunction = require('lodash/isFunction');
var isUndefined = require('lodash/isUndefined');
var isString = require('lodash/isString');
var simpleStatistics = require('simple-statistics');
var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getField = _require2.getField;

var DEFAULT_OPTIONS = {
  // field: '', // required
  // method: 'value', // required
  // value: 10, // required if (method === 'value')
  groupBy: []
};

function notUndefinedValues(values) {
  return values.filter(function (value) {
    return !isUndefined(value);
  });
}

var STATISTICS_METHODS = ['mean', 'median', 'max', 'min'];
var imputations = {};
STATISTICS_METHODS.forEach(function (method) {
  imputations[method] = function (row, values) {
    return simpleStatistics[method](values);
  };
});
imputations.value = function (row, values, value) {
  return value;
};

function transform(dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var rows = dataView.rows;
  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);
  var method = options.method;
  var groupBy = options.groupBy;
  if (!method) {
    throw new TypeError('Invalid method!');
  }
  if (method === 'value' && !has(options, 'value')) {
    throw new TypeError('Invalid value: it is nil.');
  }
  var column = notUndefinedValues(dataView.getColumn(field));
  var groups = partition(rows, groupBy);
  forIn(groups, function (group) {
    var fieldValues = notUndefinedValues(group.map(function (row) {
      return row[field];
    }));
    if (fieldValues.length === 0) {
      fieldValues = column;
    }
    group.forEach(function (row) {
      if (isUndefined(row[field])) {
        if (isFunction(method)) {
          row[field] = method(row, fieldValues, options.value, group);
        } else if (isString(method)) {
          row[field] = imputations[method](row, fieldValues, options.value);
        } else {
          throw new TypeError('Invalid method: must be a function or one of ' + STATISTICS_METHODS.join(', '));
        }
      }
    });
  });
}

registerTransform('impute', transform);