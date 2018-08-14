'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _propTypes = require('prop-types');

var PropTypes = _interopRequireWildcard(_propTypes);

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _viser = require('viser');

var _viser2 = _interopRequireDefault(_viser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};

function firstLowerCase(str) {
    return str.replace(/^\S/, function (s) {
        return s.toLowerCase();
    });
}
function retain(obj, attr) {
    var newObj = Object.create(null);
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            var arrAttr = Array.isArray(attr) ? attr : [attr];
            if (arrAttr.indexOf(item) >= 0) {
                newObj[item] = obj[item];
            }
        }
    }
    return newObj;
}
function omit(obj, attr) {
    var newObj = Object.create(null);
    for (var item in obj) {
        if (obj.hasOwnProperty(item)) {
            var arrAttr = Array.isArray(attr) ? attr : [attr];
            if (arrAttr.indexOf(item) < 0) {
                newObj[item] = obj[item];
            }
        }
    }
    return newObj;
}
function isOwnEmpty(obj) {
    for (var name_1 in obj) {
        if (obj.hasOwnProperty(name_1)) {
            return false;
        }
    }
    return true;
}
var Chart = function (_super) {
    __extends(Chart, _super);
    function Chart(props) {
        var _this = _super.call(this, props) || this;
        _this.config = {};
        _this.views = {};
        _this.facetviews = {};
        _this.centralizedUpdates = function (unit) {
            var config = _this.config;
            var props = unit.props;
            var displayName = unit.displayName;
            var hasInViews = unit.context.hasInViews;
            if (displayName === 'Facet') {
                var options = omit(props, 'children');
                config.facet = options;
            } else if (displayName === 'FacetView') {
                var viewId = unit.state.viewId;
                if (!_this.facetviews[viewId]) {
                    _this.facetviews[viewId] = { viewId: viewId };
                }
                _this.combineViewConfig(props, _this.facetviews[viewId]);
            } else if (displayName === 'View') {
                var viewId = unit.state.viewId;
                if (!_this.views[viewId]) {
                    _this.views[viewId] = { viewId: viewId };
                }
                _this.combineViewConfig(props, _this.views[viewId]);
            } else {
                if (!hasInViews) {
                    _this.combineContentConfig(displayName, props, config);
                } else {
                    var viewType = unit.context.viewType;
                    var viewId = unit.context.viewId;
                    if (viewType === 'view') {
                        if (!_this.views[viewId]) {
                            _this.views[viewId] = { viewId: viewId };
                        }
                        _this.combineContentConfig(displayName, props, _this.views[viewId]);
                    } else if (viewType === 'facet') {
                        if (!_this.facetviews[viewId]) {
                            _this.facetviews[viewId] = { viewId: viewId };
                        }
                        _this.combineContentConfig(displayName, props, _this.facetviews[viewId]);
                    }
                }
            }
        };
        _this.portalRef = function (container) {
            if (!_this.container) {
                _this.container = container;
            }
        };
        return _this;
    }
    Chart.prototype.getChildContext = function () {
        return {
            centralizedUpdates: this.centralizedUpdates,
            hasInViews: false,
            viewType: 'view'
        };
    };
    Chart.prototype.combineChartConfig = function (props, config) {
        var chartRetain = ['height', 'width', 'animate', 'forceFit', 'background', 'plotBackground', 'padding', 'onMouseDown', 'onMouseMove', 'onMouseUp', 'onClick', 'onDbClick', 'onTouchStart', 'onTouchMove', 'onTouchEnd', 'onPlotEnter', 'onPlotMove', 'onPlotLeave', 'onPlotClick', 'onPlotDbClick'];
        config.chart = retain(props, chartRetain);
    };
    Chart.prototype.combineViewConfig = function (props, config) {
        if (props.data) {
            config.data = props.data;
        }
        if (props.scale) {
            config.scale = props.scale;
        }
        if (props.start) {
            config.start = props.start;
        }
        if (props.end) {
            config.end = props.end;
        }
    };
    Chart.prototype.combineContentConfig = function (displayName, props, config) {
        var realName = firstLowerCase(displayName);
        var nameLowerCase = displayName.toLowerCase();
        var regSeries = ['pie', 'sector', 'line', 'smoothLine', 'dashLine', 'area', 'stackArea', 'smoothArea', 'bar', 'stackBar', 'dodgeBar', 'interval', 'stackInterval', 'dodgeInterval', 'point', 'waterfall', 'funnel', 'pyramid', 'radialBar', 'schema', 'box', 'candle', 'polygon', 'contour', 'heatmap', 'edge', 'sankey', 'jitterPoint', 'path'];
        if (regSeries.indexOf(realName) < 0 && isOwnEmpty(props)) {
            config[nameLowerCase] = true;
        } else if (regSeries.indexOf(realName) >= 0) {
            if (!config.series) {
                config.series = [];
            }
            config.series.push(__assign({ quickType: realName }, props));
        } else if (nameLowerCase === 'axis') {
            if (!config.axis) {
                config.axis = [];
            }
            config.axis.push(props);
        } else if (nameLowerCase === 'series') {
            if (!config.series) {
                config.series = [];
            }
            config.series.push(props);
        } else if (nameLowerCase === 'guide') {
            if (!config.guide) {
                config.guide = [];
            }
            config.guide.push(props);
        } else if (nameLowerCase === 'legend') {
            if (!config.legend) {
                config.legend = [];
            }
            config.legend.push(props);
        } else {
            config[nameLowerCase] = props;
        }
        return config;
    };
    Chart.prototype.changeViewConfig = function () {
        var views = this.views;
        var facetviews = this.facetviews;
        var config = this.config;
        if (!isOwnEmpty(views)) {
            config.views = [];
            for (var item in views) {
                if (views.hasOwnProperty(item)) {
                    config.views.push(views[item]);
                }
            }
        }
        if (!isOwnEmpty(facetviews)) {
            config.facet.views = [];
            for (var item in facetviews) {
                if (facetviews.hasOwnProperty(item)) {
                    config.facet.views.push(facetviews[item]);
                }
            }
        }
    };
    Chart.prototype.createChartInstance = function (config) {
        if (this.chart) {
            this.chart.destroy();
        }
        this.combineChartConfig(this.props, this.config);
        this.combineViewConfig(this.props, this.config);
        config.chart.container = this.container;
        this.changeViewConfig();
        this.chart = (0, _viser2.default)(config);
    };
    Chart.prototype.repaintChartInstance = function (config) {
        this.combineChartConfig(this.props, this.config);
        this.combineViewConfig(this.props, this.config);
        this.changeViewConfig();
        if (this.chart) {
            this.chart.repaint(config);
        } else {
            config.chart.container = this.container;
            this.chart = (0, _viser2.default)(config);
        }
    };
    Chart.prototype.clearConfigData = function () {
        this.config = {};
        this.views = {};
    };
    Chart.prototype.componentDidMount = function () {
        this.createChartInstance(this.config);
        this.clearConfigData();
    };
    Chart.prototype.componentDidUpdate = function (props) {
        this.repaintChartInstance(this.config);
        this.clearConfigData();
    };
    Chart.prototype.componentWillUnmount = function () {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.container = null;
    };
    Chart.prototype.render = function () {
        return React.createElement("div", { ref: this.portalRef }, this.props.children);
    };
    Chart.childContextTypes = {
        centralizedUpdates: PropTypes.func,
        hasInViews: PropTypes.bool,
        viewType: PropTypes.string
    };
    return Chart;
}(React.Component);
exports.default = Chart;
//# sourceMappingURL=Chart.js.map