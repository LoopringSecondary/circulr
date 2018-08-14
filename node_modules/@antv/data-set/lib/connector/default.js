var isString = require('lodash/isString');
var cloneDeep = require('lodash/cloneDeep');

var _require = require('../data-set'),
    registerConnector = _require.registerConnector;

registerConnector('default', function (dataView, dataSet) {
  if (isString(dataView)) {
    dataView = dataSet.getView(dataView);
  }
  if (!dataView) {
    throw new TypeError('Invalid dataView');
  }
  return cloneDeep(dataView.rows);
});