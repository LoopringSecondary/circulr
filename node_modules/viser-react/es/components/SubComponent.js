var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import * as PropTypes from 'prop-types';
import * as React from 'react';
var Props = (function () {
    function Props() {
    }
    return Props;
}());
var SubComponent = (function (_super) {
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
}(React.Component));
var Coord = (function (_super) {
    __extends(Coord, _super);
    function Coord() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Coord';
        return _this;
    }
    return Coord;
}(SubComponent));
export { Coord };
var Tooltip = (function (_super) {
    __extends(Tooltip, _super);
    function Tooltip() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Tooltip';
        return _this;
    }
    return Tooltip;
}(SubComponent));
export { Tooltip };
var Legend = (function (_super) {
    __extends(Legend, _super);
    function Legend() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Legend';
        return _this;
    }
    return Legend;
}(SubComponent));
export { Legend };
var Guide = (function (_super) {
    __extends(Guide, _super);
    function Guide() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Guide';
        return _this;
    }
    return Guide;
}(SubComponent));
export { Guide };
var Axis = (function (_super) {
    __extends(Axis, _super);
    function Axis() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Axis';
        return _this;
    }
    return Axis;
}(SubComponent));
export { Axis };
var Brush = (function (_super) {
    __extends(Brush, _super);
    function Brush() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Brush';
        return _this;
    }
    return Brush;
}(SubComponent));
export { Brush };
var Series = (function (_super) {
    __extends(Series, _super);
    function Series() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Series';
        return _this;
    }
    return Series;
}(SubComponent));
export { Series };
var Line = (function (_super) {
    __extends(Line, _super);
    function Line() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Line';
        return _this;
    }
    return Line;
}(SubComponent));
export { Line };
var Pie = (function (_super) {
    __extends(Pie, _super);
    function Pie() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Pie';
        return _this;
    }
    return Pie;
}(SubComponent));
export { Pie };
var Sector = (function (_super) {
    __extends(Sector, _super);
    function Sector() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Sector';
        return _this;
    }
    return Sector;
}(SubComponent));
export { Sector };
var SmoothLine = (function (_super) {
    __extends(SmoothLine, _super);
    function SmoothLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'SmoothLine';
        return _this;
    }
    return SmoothLine;
}(SubComponent));
export { SmoothLine };
var DashLine = (function (_super) {
    __extends(DashLine, _super);
    function DashLine() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DashLine';
        return _this;
    }
    return DashLine;
}(SubComponent));
export { DashLine };
var Area = (function (_super) {
    __extends(Area, _super);
    function Area() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Area';
        return _this;
    }
    return Area;
}(SubComponent));
export { Area };
var StackArea = (function (_super) {
    __extends(StackArea, _super);
    function StackArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackArea';
        return _this;
    }
    return StackArea;
}(SubComponent));
export { StackArea };
var SmoothArea = (function (_super) {
    __extends(SmoothArea, _super);
    function SmoothArea() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'SmoothArea';
        return _this;
    }
    return SmoothArea;
}(SubComponent));
export { SmoothArea };
var Bar = (function (_super) {
    __extends(Bar, _super);
    function Bar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Bar';
        return _this;
    }
    return Bar;
}(SubComponent));
export { Bar };
var StackBar = (function (_super) {
    __extends(StackBar, _super);
    function StackBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackBar';
        return _this;
    }
    return StackBar;
}(SubComponent));
export { StackBar };
var DodgeBar = (function (_super) {
    __extends(DodgeBar, _super);
    function DodgeBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DodgeBar';
        return _this;
    }
    return DodgeBar;
}(SubComponent));
export { DodgeBar };
var Interval = (function (_super) {
    __extends(Interval, _super);
    function Interval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Interval';
        return _this;
    }
    return Interval;
}(SubComponent));
export { Interval };
var StackInterval = (function (_super) {
    __extends(StackInterval, _super);
    function StackInterval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'StackInterval';
        return _this;
    }
    return StackInterval;
}(SubComponent));
export { StackInterval };
var DodgeInterval = (function (_super) {
    __extends(DodgeInterval, _super);
    function DodgeInterval() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'DodgeInterval';
        return _this;
    }
    return DodgeInterval;
}(SubComponent));
export { DodgeInterval };
var Point = (function (_super) {
    __extends(Point, _super);
    function Point() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Point';
        return _this;
    }
    return Point;
}(SubComponent));
export { Point };
var Funnel = (function (_super) {
    __extends(Funnel, _super);
    function Funnel() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Funnel';
        return _this;
    }
    return Funnel;
}(SubComponent));
export { Funnel };
var Pyramid = (function (_super) {
    __extends(Pyramid, _super);
    function Pyramid() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Pyramid';
        return _this;
    }
    return Pyramid;
}(SubComponent));
export { Pyramid };
var Schema = (function (_super) {
    __extends(Schema, _super);
    function Schema() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Schema';
        return _this;
    }
    return Schema;
}(SubComponent));
export { Schema };
var Box = (function (_super) {
    __extends(Box, _super);
    function Box() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Box';
        return _this;
    }
    return Box;
}(SubComponent));
export { Box };
var Candle = (function (_super) {
    __extends(Candle, _super);
    function Candle() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Candle';
        return _this;
    }
    return Candle;
}(SubComponent));
export { Candle };
var Polygon = (function (_super) {
    __extends(Polygon, _super);
    function Polygon() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Polygon';
        return _this;
    }
    return Polygon;
}(SubComponent));
export { Polygon };
var Contour = (function (_super) {
    __extends(Contour, _super);
    function Contour() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Contour';
        return _this;
    }
    return Contour;
}(SubComponent));
export { Contour };
var Heatmap = (function (_super) {
    __extends(Heatmap, _super);
    function Heatmap() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Heatmap';
        return _this;
    }
    return Heatmap;
}(SubComponent));
export { Heatmap };
var Edge = (function (_super) {
    __extends(Edge, _super);
    function Edge() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Edge';
        return _this;
    }
    return Edge;
}(SubComponent));
export { Edge };
var Sankey = (function (_super) {
    __extends(Sankey, _super);
    function Sankey() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Sankey';
        return _this;
    }
    return Sankey;
}(SubComponent));
export { Sankey };
var ErrorBar = (function (_super) {
    __extends(ErrorBar, _super);
    function ErrorBar() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'ErrorBar';
        return _this;
    }
    return ErrorBar;
}(SubComponent));
export { ErrorBar };
var JitterPoint = (function (_super) {
    __extends(JitterPoint, _super);
    function JitterPoint() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'JitterPoint';
        return _this;
    }
    return JitterPoint;
}(SubComponent));
export { JitterPoint };
var Path = (function (_super) {
    __extends(Path, _super);
    function Path() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.displayName = 'Path';
        return _this;
    }
    return Path;
}(SubComponent));
export { Path };
//# sourceMappingURL=SubComponent.js.map