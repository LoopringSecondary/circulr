var Util = require('../../util/index');
var Shape = require('../core/shape');

var Marker = function Marker(cfg) {
  Marker.superclass.constructor.call(this, cfg);
};

Marker.Symbols = {
  // 圆
  circle: function circle(x, y, r) {
    return 'M' + x + ',' + y + '\n            m' + -r + ',0\n            a ' + r + ',' + r + ',0,1,0,' + r * 2 + ',0\n            a ' + r + ',' + r + ',0,1,0,' + -r * 2 + ',0';
  },

  // 正方形
  square: function square(x, y, r) {
    return 'M' + (x - r) + ',' + (y - r) + '\n            H' + (x + r) + 'V' + (y + r) + '\n            H' + (x - r) + 'Z';
  },

  // 菱形
  diamond: function diamond(x, y, r) {
    return 'M' + (x - r) + ',' + y + '\n             L' + x + ',' + (y - r) + '\n             L' + (x + r) + ',' + y + ',\n             L' + x + ',' + (y + r) + 'Z';
  },

  // 三角形
  triangle: function triangle(x, y, r) {
    var diff = r * Math.sin(1 / 3 * Math.PI);
    return 'M' + (x - r) + ',' + (y + diff) + '\n            L' + x + ',' + (y - diff) + '\n            L' + (x + r) + ',' + (y + diff) + 'Z';
  },

  // 倒三角形
  'triangle-down': function triangleDown(x, y, r) {
    var diff = r * Math.sin(1 / 3 * Math.PI);
    return 'M' + (x - r) + ',' + (y - diff) + '\n            L' + (x + r) + ',' + (y - diff) + '\n            L' + x + ',' + (y + diff) + 'Z';
  }
};

Marker.ATTRS = {
  path: null,
  lineWidth: 1
};

Util.extend(Marker, Shape);

Util.augment(Marker, {
  type: 'marker',
  canFill: true,
  canStroke: true,
  init: function init(id) {
    Marker.superclass.init.call(this);
    var marker = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    id = id || Util.uniqueId(this.type + '_');
    marker.setAttribute('id', id);
    this.setSilent('el', marker);
  },
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      x: 0,
      y: 0,
      lineWidth: 1,
      fill: 'none'
    };
  },
  _afterSetX: function _afterSetX() {
    this._assembleShape();
  },
  _afterSetY: function _afterSetY() {
    this._assembleShape();
  },
  _afterSetRadius: function _afterSetRadius() {
    this._assembleShape();
  },
  _afterSetR: function _afterSetR() {
    this._assembleShape();
  },
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    if ('x' in objs || 'y' in objs || 'radius' in objs) {
      this._assembleShape();
    }
  },
  _assembleShape: function _assembleShape() {
    var attrs = this.__attrs;
    var r = attrs.r;
    if (typeof attrs.r === 'undefined') {
      r = attrs.radius;
    }
    if (isNaN(Number(attrs.x)) || isNaN(Number(attrs.y)) || isNaN(Number(r))) {
      return;
    }
    var d = '';
    if (typeof attrs.symbol === 'function') {
      d = attrs.symbol(attrs.x, attrs.y, r);
    } else {
      d = Marker.Symbols[attrs.symbol || 'circle'](attrs.x, attrs.y, r);
    }
    if (Util.isArray(d)) {
      d = d.map(function (path) {
        return path.join(' ');
      }).join('');
    }
    this.get('el').setAttribute('d', d);
  }
});

module.exports = Marker;