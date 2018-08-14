function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Util = require('../util');
var Interaction = require('./base');
var G2 = require('../core.js');

var ZOOMING_TYPES = ['X', 'Y', 'XY'];
var DEFAULT_TYPE = 'X';

// TODO zoom with center point

var Zoom = function (_Interaction) {
  _inherits(Zoom, _Interaction);

  Zoom.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interaction.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      processingEvent: 'mousewheel',
      type: DEFAULT_TYPE,
      stepRatio: 0.05,
      stepByField: {},
      originScaleDefsByField: {}
    });
  };

  function Zoom(cfg, view) {
    _classCallCheck(this, Zoom);

    var _this = _possibleConstructorReturn(this, _Interaction.call(this, cfg, view));

    var me = _this;
    me.chart = view;
    me.type = me.type.toUpperCase();

    var scales = view.getYScales();
    var xScale = view.getXScale();
    scales.push(xScale);
    var scaleController = view.get('scaleController');
    scales.forEach(function (scale) {
      var field = scale.field;
      var def = scaleController.defs[field] || {};
      me.originScaleDefsByField[field] = Util.mix(def, {
        nice: !!def.nice
      });
      if (scale.isLinear) {
        me.stepByField[field] = (scale.max - scale.min) * me.stepRatio;
      }
    });

    if (ZOOMING_TYPES.indexOf(me.type) === -1) {
      me.type = DEFAULT_TYPE;
    }
    return _this;
  }

  // onZoom() { }
  // onZoomin() { }
  // onZoomout() { }

  Zoom.prototype._applyScale = function _applyScale(scale, delta) {
    var minOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var me = this;
    var chart = me.chart,
        stepByField = me.stepByField;

    if (scale.isLinear) {
      var min = scale.min,
          max = scale.max,
          field = scale.field;

      var maxOffset = 1 - minOffset;
      var step = stepByField[field] * delta;
      var newMin = min + step * minOffset;
      var newMax = max - step * maxOffset;
      if (newMax > newMin) {
        chart.scale(field, {
          nice: false,
          min: newMin,
          max: newMax
        });
      }
    }
  };

  Zoom.prototype.process = function process(ev) {
    var me = this;
    var chart = me.chart,
        type = me.type;

    var coord = chart.get('coord');
    var deltaY = ev.deltaY;
    var offsetPoint = coord.invertPoint(ev);
    if (deltaY) {
      me.onZoom && me.onZoom(deltaY, offsetPoint, me);
      if (deltaY > 0) {
        me.onZoomin && me.onZoomin(deltaY, offsetPoint, me);
      } else {
        me.onZoomout && me.onZoomout(deltaY, offsetPoint, me);
      }
      var delta = deltaY / Math.abs(deltaY);
      if (type.indexOf('X') > -1) {
        me._applyScale(chart.getXScale(), delta, offsetPoint.x);
      }
      if (type.indexOf('Y') > -1) {
        var yScales = chart.getYScales();
        yScales.forEach(function (yScale) {
          me._applyScale(yScale, delta, offsetPoint.y);
        });
      }
    }
    chart.repaint();
  };

  Zoom.prototype.reset = function reset() {
    var me = this;
    var view = me.view,
        originScaleDefsByField = me.originScaleDefsByField;

    var scales = view.getYScales();
    var xScale = view.getXScale();
    scales.push(xScale);
    scales.forEach(function (scale) {
      if (scale.isLinear) {
        var field = scale.field;
        view.scale(field, originScaleDefsByField[field]);
      }
    });
    view.repaint();
  };

  return Zoom;
}(Interaction);

G2.registerInteraction('zoom', Zoom);
G2.registerInteraction('Zoom', Zoom);

module.exports = Zoom;