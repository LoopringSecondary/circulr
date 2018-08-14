'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Slider = exports.Plugin = exports.Path = exports.JitterPoint = exports.Sankey = exports.Edge = exports.Heatmap = exports.Contour = exports.Polygon = exports.Candle = exports.Box = exports.Schema = exports.Pyramid = exports.Funnel = exports.Point = exports.DodgeInterval = exports.StackInterval = exports.Interval = exports.DodgeBar = exports.StackBar = exports.Bar = exports.SmoothArea = exports.StackArea = exports.Area = exports.DashLine = exports.SmoothLine = exports.Sector = exports.Pie = exports.Line = exports.Brush = exports.Series = exports.Axis = exports.Guide = exports.Legend = exports.Tooltip = exports.Coord = exports.LiteChart = exports.Facet = exports.FacetView = exports.View = exports.Chart = exports.Global = exports.registerShape = exports.registerAnimation = undefined;

var _Chart = require('./components/Chart');

Object.defineProperty(exports, 'Chart', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Chart).default;
  }
});

var _View = require('./components/View');

Object.defineProperty(exports, 'View', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_View).default;
  }
});

var _FacetView = require('./components/FacetView');

Object.defineProperty(exports, 'FacetView', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_FacetView).default;
  }
});

var _Facet = require('./components/Facet');

Object.defineProperty(exports, 'Facet', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_Facet).default;
  }
});

var _LiteChart = require('./components/LiteChart');

Object.defineProperty(exports, 'LiteChart', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_LiteChart).default;
  }
});

var _plugin = require('./plugins/plugin');

Object.defineProperty(exports, 'Plugin', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_plugin).default;
  }
});

var _viser = require('viser');

var viser = _interopRequireWildcard(_viser);

var _SubComponent = require('./components/SubComponent');

var _SubPlugin = require('./plugins/SubPlugin');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var registerAnimation = exports.registerAnimation = viser.registerAnimation;
var registerShape = exports.registerShape = viser.registerShape;
var Global = exports.Global = viser.Global;
exports.Coord = _SubComponent.Coord;
exports.Tooltip = _SubComponent.Tooltip;
exports.Legend = _SubComponent.Legend;
exports.Guide = _SubComponent.Guide;
exports.Axis = _SubComponent.Axis;
exports.Series = _SubComponent.Series;
exports.Brush = _SubComponent.Brush;
exports.Line = _SubComponent.Line;
exports.Pie = _SubComponent.Pie;
exports.Sector = _SubComponent.Sector;
exports.SmoothLine = _SubComponent.SmoothLine;
exports.DashLine = _SubComponent.DashLine;
exports.Area = _SubComponent.Area;
exports.StackArea = _SubComponent.StackArea;
exports.SmoothArea = _SubComponent.SmoothArea;
exports.Bar = _SubComponent.Bar;
exports.StackBar = _SubComponent.StackBar;
exports.DodgeBar = _SubComponent.DodgeBar;
exports.Interval = _SubComponent.Interval;
exports.StackInterval = _SubComponent.StackInterval;
exports.DodgeInterval = _SubComponent.DodgeInterval;
exports.Point = _SubComponent.Point;
exports.Funnel = _SubComponent.Funnel;
exports.Pyramid = _SubComponent.Pyramid;
exports.Schema = _SubComponent.Schema;
exports.Box = _SubComponent.Box;
exports.Candle = _SubComponent.Candle;
exports.Polygon = _SubComponent.Polygon;
exports.Contour = _SubComponent.Contour;
exports.Heatmap = _SubComponent.Heatmap;
exports.Edge = _SubComponent.Edge;
exports.Sankey = _SubComponent.Sankey;
exports.JitterPoint = _SubComponent.JitterPoint;
exports.Path = _SubComponent.Path;
exports.Slider = _SubPlugin.Slider;
//# sourceMappingURL=index.js.map