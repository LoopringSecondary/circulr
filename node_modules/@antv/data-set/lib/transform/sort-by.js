var isArray = require('lodash/isArray');
var reverse = require('lodash/reverse');
var sortBy = require('lodash/sortBy');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

/*
 * options: {
 *   type: 'sort-by',
 *   fields: [],
 *   order: 'ASC' // 'DESC'
 * }
 */

var VALID_ORDERS = ['ASC', 'DESC'];

function transform(dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var fields = getFields(options, [dataView.getColumnName(0)]);
  if (!isArray(fields)) {
    throw new TypeError('Invalid fields: must be an array with strings!');
  }
  dataView.rows = sortBy(dataView.rows, fields);
  var order = options.order;
  if (order && VALID_ORDERS.indexOf(order) === -1) {
    throw new TypeError('Invalid order: ' + order + ' must be one of ' + VALID_ORDERS.join(', '));
  } else if (order === 'DESC') {
    dataView.rows = reverse(dataView.rows);
  }
}
registerTransform('sort-by', transform);
registerTransform('sortBy', transform);