var assign = require('lodash/assign');
var values = require('lodash/values');
var _partition = require('../util/partition');
var View = require('../view');

assign(View.prototype, {
  partition: function partition() {
    var group_by = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
    var order_by = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

    return _partition(this.rows, group_by, order_by);
  },
  group: function group(group_by, order_by) {
    var groups = this.partition(group_by, order_by);
    return values(groups);
  },
  groups: function groups(group_by, order_by) {
    return this.group(group_by, order_by);
  }
});