function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Util = require('../util');
var Interaction = require('./base');
var G2 = require('../core.js');

var DRAGGING_TYPES = ['X', 'Y', 'XY'];
var DEFAULT_TYPE = 'X';

var Drag = function (_Interaction) {
  _inherits(Drag, _Interaction);

  Drag.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Interaction.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      type: DEFAULT_TYPE,
      stepRatio: 0.05,
      stepByField: {},
      originScaleDefsByField: {},
      previousPoint: null,
      isDragging: false
    });
  };

  function Drag(cfg, view) {
    _classCallCheck(this, Drag);

    var _this = _possibleConstructorReturn(this, _Interaction.call(this, cfg, view));

    var me = _this;
    me.type = me.type.toUpperCase();
    me.chart = view;

    var scales = view.getYScales();
    var xScale = view.getXScale();
    scales.push(xScale);
    var scaleController = view.get('scaleController');
    scales.forEach(function (scale) {
      var field = scale.field;
      var def = scaleController.defs[field];
      me.originScaleDefsByField[field] = Util.mix(def, {
        nice: !!def.nice
      });
      if (scale.isLinear) {
        me.stepByField[field] = (scale.max - scale.min) * me.stepRatio;
      }
    });

    if (DRAGGING_TYPES.indexOf(me.type) === -1) {
      me.type = DEFAULT_TYPE;
    }
    return _this;
  }

  // onDragstart() { }
  // onDrag() { }
  // onDragend() { }

  Drag.prototype._applyTranslate = function _applyTranslate(scale) {
    var offset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var me = this;
    var chart = me.chart;
    var min = scale.min,
        max = scale.max,
        field = scale.field;

    var range = max - min;
    chart.scale(field, {
      nice: false,
      min: min - offset * range,
      max: max - offset * range
    });
  };

  Drag.prototype.start = function start(ev) {
    var me = this;
    var chart = me.chart,
        canvas = me.canvas;

    var canvasDOM = canvas.get('canvasDOM');
    canvasDOM.style.cursor = 'pointer';
    var coord = chart.get('coord');
    me.isDragging = true;
    me.previousPoint = coord.invertPoint(ev);
  };

  Drag.prototype.process = function process(ev) {
    var me = this;
    if (me.isDragging) {
      var chart = me.chart,
          type = me.type,
          canvas = me.canvas;

      var canvasDOM = canvas.get('canvasDOM');
      canvasDOM.style.cursor = 'move';
      var coord = chart.get('coord');
      var previousPoint = me.previousPoint;
      var currentPoint = coord.invertPoint(ev);
      if (type.indexOf('X') > -1) {
        me._applyTranslate(chart.getXScale(), currentPoint.x - previousPoint.x);
      }
      if (type.indexOf('Y') > -1) {
        var yScales = chart.getYScales();
        yScales.forEach(function (yScale) {
          me._applyTranslate(yScale, currentPoint.y - previousPoint.y);
        });
      }
      me.previousPoint = currentPoint;
      chart.repaint();
    }
  };

  Drag.prototype.end = function end() {
    var me = this;
    me.isDragging = false;
    var canvas = me.canvas;

    var canvasDOM = canvas.get('canvasDOM');
    canvasDOM.style.cursor = 'default';
  };

  Drag.prototype.reset = function reset() {
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

  return Drag;
}(Interaction);

G2.registerInteraction('drag', Drag);
G2.registerInteraction('Drag', Drag);

module.exports = Drag;