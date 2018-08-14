'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Path = exports.JitterPoint = exports.ErrorBar = exports.Sankey = exports.Edge = exports.Heatmap = exports.Contour = exports.Polygon = exports.Candle = exports.Box = exports.Schema = exports.Pyramid = exports.Funnel = exports.Point = exports.DodgeInterval = exports.StackInterval = exports.Interval = exports.DodgeBar = exports.StackBar = exports.Bar = exports.SmoothArea = exports.StackArea = exports.Area = exports.DashLine = exports.SmoothLine = exports.Sector = exports.Pie = exports.Line = exports.Series = exports.Brush = exports.Axis = exports.Guide = exports.Legend = exports.Tooltip = exports.Coord = undefined;

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var __extends = undefined && undefined.__extends || function () {
    var extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function (d, b) {
        d.__proto__ = b;
    } || function (d, b) {
        for (var p in b) {
            if (b.hasOwnProperty(p)) d[p] = b[p];
        }
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();

var Props = function () {
    function Props() {}
    return Props;
}();
var SubComponent = function (_super) {
    __extends(SubComponent, _super);
    function SubComponent(props) {
        var _this = _super.call(this, props) || this;
        _this.displayName = 'SubComponent';
        return _this;
    }
    SubComponent.prototype.componentDidUpdate = function () {
        this.context.centralizedUpdates(this);
    };
    SubComponent.prototype.componentDidMount = function () {
        this.context.centralizedUpdates(this);
    };
    SubComponent.prototype.render = function () {
        return null;
    };
    SubComponent.contextTypes = {
        centralizedUpdates: PropTypes.func,
        hasInViews: PropTypes.bool,
        viewId: PropTypes.string,
        viewType: PropTypes.string
    };
    return SubComponent;
}(React.Component);
var Coord = function (_super) {
    __extends(Coord, _super);
    function Coord() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Coord';
        return _this;
    }
    return Coord;
}(SubComponent);
exports.Coord = Coord;

var Tooltip = function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Tooltip';
        return _this;
    }
    return Tooltip;
}(SubComponent);
exports.Tooltip = Tooltip;

var Legend = function (_super) {
    __extends(Legend, _super);
    function Legend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Legend';
        return _this;
    }
    return Legend;
}(SubComponent);
exports.Legend = Legend;

var Guide = function (_super) {
    __extends(Guide, _super);
    function Guide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Guide';
        return _this;
    }
    return Guide;
}(SubComponent);
exports.Guide = Guide;

var Axis = function (_super) {
    __extends(Axis, _super);
    function Axis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Axis';
        return _this;
    }
    return Axis;
}(SubComponent);
exports.Axis = Axis;

var Brush = function (_super) {
    __extends(Brush, _super);
    function Brush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Brush';
        return _this;
    }
    return Brush;
}(SubComponent);
exports.Brush = Brush;

var Series = function (_super) {
    __extends(Series, _super);
    function Series() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Series';
        return _this;
    }
    return Series;
}(SubComponent);
exports.Series = Series;

var Line = function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Line';
        return _this;
    }
    return Line;
}(SubComponent);
exports.Line = Line;

var Pie = function (_super) {
    __extends(Pie, _super);
    function Pie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Pie';
        return _this;
    }
    return Pie;
}(SubComponent);
exports.Pie = Pie;

var Sector = function (_super) {
    __extends(Sector, _super);
    function Sector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Sector';
        return _this;
    }
    return Sector;
}(SubComponent);
exports.Sector = Sector;

var SmoothLine = function (_super) {
    __extends(SmoothLine, _super);
    function SmoothLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'SmoothLine';
        return _this;
    }
    return SmoothLine;
}(SubComponent);
exports.SmoothLine = SmoothLine;

var DashLine = function (_super) {
    __extends(DashLine, _super);
    function DashLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DashLine';
        return _this;
    }
    return DashLine;
}(SubComponent);
exports.DashLine = DashLine;

var Area = function (_super) {
    __extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Area';
        return _this;
    }
    return Area;
}(SubComponent);
exports.Area = Area;

var StackArea = function (_super) {
    __extends(StackArea, _super);
    function StackArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackArea';
        return _this;
    }
    return StackArea;
}(SubComponent);
exports.StackArea = StackArea;

var SmoothArea = function (_super) {
    __extends(SmoothArea, _super);
    function SmoothArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'SmoothArea';
        return _this;
    }
    return SmoothArea;
}(SubComponent);
exports.SmoothArea = SmoothArea;

var Bar = function (_super) {
    __extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Bar';
        return _this;
    }
    return Bar;
}(SubComponent);
exports.Bar = Bar;

var StackBar = function (_super) {
    __extends(StackBar, _super);
    function StackBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackBar';
        return _this;
    }
    return StackBar;
}(SubComponent);
exports.StackBar = StackBar;

var DodgeBar = function (_super) {
    __extends(DodgeBar, _super);
    function DodgeBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DodgeBar';
        return _this;
    }
    return DodgeBar;
}(SubComponent);
exports.DodgeBar = DodgeBar;

var Interval = function (_super) {
    __extends(Interval, _super);
    function Interval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Interval';
        return _this;
    }
    return Interval;
}(SubComponent);
exports.Interval = Interval;

var StackInterval = function (_super) {
    __extends(StackInterval, _super);
    function StackInterval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackInterval';
        return _this;
    }
    return StackInterval;
}(SubComponent);
exports.StackInterval = StackInterval;

var DodgeInterval = function (_super) {
    __extends(DodgeInterval, _super);
    function DodgeInterval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DodgeInterval';
        return _this;
    }
    return DodgeInterval;
}(SubComponent);
exports.DodgeInterval = DodgeInterval;

var Point = function (_super) {
    __extends(Point, _super);
    function Point() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Point';
        return _this;
    }
    return Point;
}(SubComponent);
exports.Point = Point;

var Funnel = function (_super) {
    __extends(Funnel, _super);
    function Funnel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Funnel';
        return _this;
    }
    return Funnel;
}(SubComponent);
exports.Funnel = Funnel;

var Pyramid = function (_super) {
    __extends(Pyramid, _super);
    function Pyramid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Pyramid';
        return _this;
    }
    return Pyramid;
}(SubComponent);
exports.Pyramid = Pyramid;

var Schema = function (_super) {
    __extends(Schema, _super);
    function Schema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Schema';
        return _this;
    }
    return Schema;
}(SubComponent);
exports.Schema = Schema;

var Box = function (_super) {
    __extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Box';
        return _this;
    }
    return Box;
}(SubComponent);
exports.Box = Box;

var Candle = function (_super) {
    __extends(Candle, _super);
    function Candle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Candle';
        return _this;
    }
    return Candle;
}(SubComponent);
exports.Candle = Candle;

var Polygon = function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Polygon';
        return _this;
    }
    return Polygon;
}(SubComponent);
exports.Polygon = Polygon;

var Contour = function (_super) {
    __extends(Contour, _super);
    function Contour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Contour';
        return _this;
    }
    return Contour;
}(SubComponent);
exports.Contour = Contour;

var Heatmap = function (_super) {
    __extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Heatmap';
        return _this;
    }
    return Heatmap;
}(SubComponent);
exports.Heatmap = Heatmap;

var Edge = function (_super) {
    __extends(Edge, _super);
    function Edge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Edge';
        return _this;
    }
    return Edge;
}(SubComponent);
exports.Edge = Edge;

var Sankey = function (_super) {
    __extends(Sankey, _super);
    function Sankey() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Sankey';
        return _this;
    }
    return Sankey;
}(SubComponent);
exports.Sankey = Sankey;

var ErrorBar = function (_super) {
    __extends(ErrorBar, _super);
    function ErrorBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'ErrorBar';
        return _this;
    }
    return ErrorBar;
}(SubComponent);
exports.ErrorBar = ErrorBar;

var JitterPoint = function (_super) {
    __extends(JitterPoint, _super);
    function JitterPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'JitterPoint';
        return _this;
    }
    return JitterPoint;
}(SubComponent);
exports.JitterPoint = JitterPoint;

var Path = function (_super) {
    __extends(Path, _super);
    function Path() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Path';
        return _this;
    }
    return Path;
}(SubComponent);
exports.Path = Path;
//# sourceMappingURL=SubComponent.js.map