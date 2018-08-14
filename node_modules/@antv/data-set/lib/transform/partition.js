var assign = require('lodash/assign');
var values = require('lodash/values');
var partition = require('../util/partition');

var _require = require('../data-set'),
    registerTransform = _require.registerTransform;

var DEFAULT_OPTIONS = {
  groupBy: [], // optional
  orderBy: []
};

registerTransform('partition', function (dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.rows = partition(dataView.rows, options.groupBy, options.orderBy);
});

function group(dataView) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  options = assign({}, DEFAULT_OPTIONS, options);
  dataView.rows = values(partition(dataView.rows, options.groupBy, options.orderBy));
}

registerTransform('group', group);
registerTransform('groups', group);