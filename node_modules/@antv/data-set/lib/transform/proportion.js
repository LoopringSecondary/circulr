var assign = require('lodash/assign');
var forIn = require('lodash/forIn');
var isArray = require('lodash/isArray');
var isString = require('lodash/isString');
var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getField = _require2.getField;

var DEFAULT_OPTIONS = {
  // field: 'y', // required
  // dimension: 'x', // required
  groupBy: [], // optional
  as: '_proportion'
};

function transform(dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = assign({}, DEFAULT_OPTIONS, options);
  var field = getField(options);
  var dimension = options.dimension;
  var groupBy = options.groupBy;
  var as = options.as;
  if (!isString(dimension)) {
    throw new TypeError('Invalid dimension: must be a string!');
  }
  if (isArray(as)) {
    console.warn('Invalid as: must be a string, will use the first element of the array specified.');
    as = as[0];
  }
  if (!isString(as)) {
    throw new TypeError('Invalid as: must be a string!');
  }
  var rows = dataView.rows;
  var result = [];
  var groups = partition(rows, groupBy);
  forIn(groups, function (group) {
    var totalCount = group.length;
    var innerGroups = partition(group, [dimension]);
    forIn(innerGroups, function (innerGroup) {
      var innerCount = innerGroup.length;
      // const resultRow = pick(innerGroup[0], union(groupBy, [ dimension ]));
      var resultRow = innerGroup[0];
      // FIXME in case dimension and field is the same
      var dimensionValue = resultRow[dimension];
      resultRow[field] = innerCount;
      resultRow[dimension] = dimensionValue;
      resultRow[as] = innerCount / totalCount;
      result.push(resultRow);
    });
  });
  dataView.rows = result;
}

registerTransform('proportion', transform);