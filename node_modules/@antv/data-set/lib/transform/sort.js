var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

/*
 * options: {
 *   type: 'sort',
 *   callback,
 * }
 */

registerTransform('sort', function (dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  var columnName = dataView.getColumnName(0);
  dataView.rows.sort(options.callback || function (a, b) {
    return a[columnName] - b[columnName];
  });
});