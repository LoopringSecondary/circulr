var Util = require('../../util/index');
var Shape = require('../core/shape');

var Polygon = function Polygon(cfg) {
  Polygon.superclass.constructor.call(this, cfg);
};

Polygon.ATTRS = {
  points: null,
  lineWidth: 1
};

Util.extend(Polygon, Shape);

Util.augment(Polygon, {
  canFill: true,
  canStroke: true,
  type: 'polygon',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      fill: 'none'
    };
  },
  _afterSetAttrPoints: function _afterSetAttrPoints() {
    var value = this.__attrs.points;
    var el = this.get('el');
    var points = value;
    if (!value || value.length === 0) {
      points = '';
    } else if (Util.isArray(value)) {
      points = points.map(function (point) {
        return point[0] + ',' + point[1];
      });
      points = points.join(' ');
    }
    el.setAttribute('points', points);
  },
  _afterSetAttrAll: function _afterSetAttrAll(obj) {
    if ('points' in obj) {
      this._afterSetAttrPoints();
    }
  },
  createPath: function createPath() {}
});

module.exports = Polygon;