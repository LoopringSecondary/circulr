var Util = require('../../util/index');
var Shape = require('../core/shape');

var Path = function Path(cfg) {
  Path.superclass.constructor.call(this, cfg);
};

function at(p0, p1, p2, p3, t) {
  var onet = 1 - t;
  return onet * onet * (onet * p3 + 3 * t * p2) + t * t * (t * p0 + 3 * onet * p1);
}

Path.ATTRS = {
  path: null,
  lineWidth: 1,
  curve: null, // 曲线path
  tCache: null,
  startArrow: false,
  endArrow: false
};

Util.extend(Path, Shape);

Util.augment(Path, {
  canFill: true,
  canStroke: true,
  type: 'path',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      fill: 'none',
      startArrow: false,
      endArrow: false
    };
  },
  _afterSetAttrStroke: function _afterSetAttrStroke(value) {
    var start = this.get('marker-start');
    var end = this.get('marker-end');
    if (start) {
      this.get('defs').findById(start).update(null, value);
    }
    if (end) {
      this.get('defs').findById(end).update(null, value);
    }
  },
  _afterSetAttrPath: function _afterSetAttrPath(value) {
    var el = this.get('el');
    var d = value;
    if (Util.isArray(d)) {
      d = d.map(function (path) {
        return path.join(' ');
      }).join('');
    }
    if (~d.indexOf('NaN')) {
      el.setAttribute('d', '');
    } else {
      el.setAttribute('d', d);
    }
  },
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    if (objs.path) {
      this._afterSetAttrPath(objs.path);
    }
    if (objs.stroke) {
      this._afterSetAttrStroke(objs.stroke);
    }
  },
  getPoint: function getPoint(t) {
    var tCache = this.tCache;
    var subt = void 0;
    var index = void 0;

    if (!tCache) {
      this._calculateCurve();
      this._setTcache();
      tCache = this.tCache;
    }

    var curve = this.curve;

    if (!tCache) {
      if (curve) {
        return {
          x: curve[0][1],
          y: curve[0][2]
        };
      }
      return null;
    }
    Util.each(tCache, function (v, i) {
      if (t >= v[0] && t <= v[1]) {
        subt = (t - v[0]) / (v[1] - v[0]);
        index = i;
      }
    });
    var seg = curve[index];
    if (Util.isNil(seg) || Util.isNil(index)) {
      return null;
    }
    var l = seg.length;
    var nextSeg = curve[index + 1];

    return {
      x: at(seg[l - 2], nextSeg[1], nextSeg[3], nextSeg[5], 1 - subt),
      y: at(seg[l - 1], nextSeg[2], nextSeg[4], nextSeg[6], 1 - subt)
    };
  },
  createPath: function createPath() {}
});

module.exports = Path;