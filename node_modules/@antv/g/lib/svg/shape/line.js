var Util = require('../../util/index');
var Shape = require('../core/shape');

var Line = function Line(cfg) {
  Line.superclass.constructor.call(this, cfg);
};

Line.ATTRS = {
  x1: 0,
  y1: 0,
  x2: 0,
  y2: 0,
  lineWidth: 1,
  startArrow: false,
  endArrow: false
};

Util.extend(Line, Shape);

Util.augment(Line, {
  canStroke: true,
  type: 'line',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      stroke: '#000',
      startArrow: false,
      endArrow: false
    };
  },
  _afterSetAttrStroke: function _afterSetAttrStroke(value) {
    var start = this.get('marker-start');
    var end = this.get('marker-end');
    if (start) {
      this.get('defs').findById(start).update(value);
    }
    if (end) {
      this.get('defs').findById(end).update(value);
    }
  },
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    if (objs.stroke) {
      this._afterSetAttrStroke(objs.stroke);
    }
  },
  createPath: function createPath() {},
  getPoint: function getPoint(t) {
    var attrs = this.__attrs;
    return {
      x: (attrs.x2 - attrs.x1) * t + attrs.x1,
      y: (attrs.y2 - attrs.y1) * t + attrs.y1
    };
  }
});

module.exports = Line;