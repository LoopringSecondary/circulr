var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var _require2 = require('../util/option-parser'),
    getFields = _require2.getFields;

/*
 * options: {
 *   type: 'subset',
 *   startRowIndex: 0,
 *   endRowIndex: 1,
 *   fields: [],
 * }
 */

registerTransform('subset', function (dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var startIndex = options.startRowIndex || 0;
  var endIndex = options.endRowIndex || dataView.rows.length - 1;
  var columns = getFields(options, dataView.getColumnNames());
  dataView.rows = dataView.getSubset(startIndex, endIndex, columns);
});