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
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import viser from 'viser';
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
var LiteChart = (function (_super) {
    __extends(LiteChart, _super);
    function LiteChart(props) {
        var _this = _super.call(this, props) || this;
        _this.config = {};
        _this.displayName = '';
        _this.portalRef = function (container) {
            if (!_this.container) {
                _this.container = container;
            }
        };
        return _this;
    }
    LiteChart.prototype.combineChartConfig = function (props, config) {
        var chartRetain = [
            'height',
            'width',
            'animate',
            'forceFit',
            'background',
            'plotBackground',
            'padding',
        ];
        config.chart = retain(props, chartRetain);
        return config;
    };
    LiteChart.prototype.combineViewConfig = function (props, config) {
        if (props.data) {
            config.data = props.data;
        }
        if (props.dataPre) {
            config.dataPre = props.dataPre;
        }
        if (props.scale) {
            config.scale = props.scale;
        }
        if (props.guide) {
            config.guide = props.guide;
        }
        config.tooltip = props.tooltip ? props.tooltip : true;
        config.legend = props.legend ? props.legend : true;
        config.axis = props.axis ? props.axis : true;
        return config;
    };
    LiteChart.prototype.combineSeriesConfig = function (props, config) {
        var regSeries = [
            'pie',
            'sector',
            'line',
            'smoothLine',
            'dashLine',
            'area',
            'stackArea',
            'smoothArea',
            'bar',
            'stackBar',
            'dodgeBar',
            'interval',
            'stackInterval',
            'dodgeInterval',
            'point',
            'waterfall',
            'funnel',
            'pyramid',
            'radialBar',
            'schema',
            'box',
            'candle',
            'polygon',
            'contour',
            'heatmap',
            'edge',
            'jitterPoint',
        ];
        for (var _i = 0, regSeries_1 = regSeries; _i < regSeries_1.length; _i++) {
            var res = regSeries_1[_i];
            if (props[res]) {
                config.series = __assign({}, config.series, { quickType: res });
                break;
            }
        }
        return config;
    };
    LiteChart.prototype.createChartInstance = function (config) {
        var elm = this.elm;
        if (elm) {
            ReactDOM.unmountComponentAtNode(elm);
        }
        if (this.chart) {
            this.chart.destroy();
        }
        this.combineChartConfig(this.props, this.config);
        this.combineViewConfig(this.props, this.config);
        this.combineSeriesConfig(this.props, this.config);
        var root = document.createElement('div');
        this.container.appendChild(root);
        config.chart.container = root;
        this.elm = document.createElement('div');
        this.chart = viser(config);
    };
    LiteChart.prototype.repaintChartInstance = function (config) {
        this.combineChartConfig(this.props, this.config);
        this.combineViewConfig(this.props, this.config);
        this.combineSeriesConfig(this.props, this.config);
        if (this.chart) {
            this.chart.repaint(config);
        }
        else {
            config.chart.container = this.container;
            this.chart = viser(config);
        }
    };
    LiteChart.prototype.clearConfigData = function () {
        this.config = {};
    };
    LiteChart.prototype.componentDidMount = function () {
        this.createChartInstance(this.config);
        this.clearConfigData();
    };
    LiteChart.prototype.componentDidUpdate = function () {
        this.repaintChartInstance(this.config);
        this.clearConfigData();
    };
    LiteChart.prototype.componentWillUnmount = function () {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
        this.elm = this.container = null;
    };
    LiteChart.prototype.render = function () {
        return React.createElement("div", { ref: this.portalRef }, this.props.children);
    };
    return LiteChart;
}(React.Component));
export default LiteChart;
//# sourceMappingURL=LiteChart.js.map