var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

/*
 * options: {
 *   type: 'map',
 *   callback,
 * }
 */

function defaultCallback(row) {
  return row;
}

registerTransform('map', function (dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  dataView.rows = dataView.rows.map(options.callback || defaultCallback);
});