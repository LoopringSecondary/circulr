var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

/*
 * options: {
 *   type: 'filter',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return !!row;
}

registerTransform('filter', function (dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  dataView.rows = dataView.rows.filter(options.callback || defaultCallback);
});