/**
 * @fileOverview The class that performs label rendering
 * @author sima.zhang
 */
var Util = require('../../util');
var Labels = require('./labels');

module.exports = {
  renderLabels: function renderLabels() {
    var labelCfg = this.get('label');

    if (Util.isNil(labelCfg)) {
      return;
    }

    if (Util.isNil(labelCfg.items)) {
      labelCfg.items = [];
    }

    var labelsGroup = this.addGroup(Labels, labelCfg);
    this.set('labelsGroup', labelsGroup);
  },
  resetLabels: function resetLabels(items) {
    var self = this;
    var labelCfg = self.get('label');

    if (!labelCfg) {
      return;
    }

    var labelsGroup = self.get('labelsGroup');
    var children = labelsGroup.getLabels();
    var count = children.length;
    items = items || labelCfg.items;
    Util.each(items, function (item, index) {
      if (index < count) {
        var label = children[index];
        labelsGroup.changeLabel(label, item);
      } else {
        var labelShape = self.addLabel(item.text, item);
        if (labelShape) {
          labelShape._id = item._id;
          labelShape.set('coord', item.coord);
        }
      }
    });
    for (var i = count - 1; i >= items.length; i--) {
      children[i].remove();
    }
  },
  addLabel: function addLabel(value, offsetPoint) {
    var self = this;
    var labelsGroup = self.get('labelsGroup');
    var label = {};
    var rst = void 0;
    if (labelsGroup) {
      label.text = value;
      label.x = offsetPoint.x;
      label.y = offsetPoint.y;
      label.point = offsetPoint;
      label.textAlign = offsetPoint.textAlign;
      if (offsetPoint.rotate) {
        label.rotate = offsetPoint.rotate;
      }
      rst = labelsGroup.addLabel(label);
    }
    return rst;
  },
  removeLabels: function removeLabels() {
    var labelsGroup = this.get('labelsGroup');
    labelsGroup && labelsGroup.remove();
    this.set('labelsGroup', null);
  }
};