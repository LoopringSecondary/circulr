var isArray = require('lodash/isArray');
var isFunction = require('lodash/isFunction');
var isString = require('lodash/isString');
var groupBy = require('lodash/groupBy');
var simpleSortBy = require('./simple-sort-by');

module.exports = function (rows, group_by) {
  var order_by = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : [];

  var newRows = rows;
  if (order_by && order_by.length) {
    newRows = simpleSortBy(rows, order_by);
  }

  var groupingFn = void 0;
  if (isFunction(group_by)) {
    groupingFn = group_by;
  } else if (isArray(group_by)) {
    groupingFn = function groupingFn(row) {
      return '_' + group_by.map(function (col) {
        return row[col];
      }).join('-');
    };
    // NOTE: Object.keys({'b': 'b', '2': '2', '1': '1', 'a': 'a'}) => [ '1', '2', 'b', 'a' ]
    // that is why we have to add a prefix
  } else if (isString(group_by)) {
    groupingFn = function groupingFn(row) {
      return '_' + row[group_by];
    };
  }
  var groups = groupBy(newRows, groupingFn);
  return groups;
};