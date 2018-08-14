'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.process = undefined;

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _EventUtils = require('../utils/EventUtils');

var EventUtils = _interopRequireWildcard(_EventUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function setHighlight(item) {
    item.onHover = function (ev) {
        var shapes = ev.shapes;
        var geom = ev.geom;
        geom.highlightShapes(shapes);
    };
    return item;
}
var process = exports.process = function process(chart, config) {
    var cLegend = (0, _cloneDeep3.default)(config.legend);
    var isArr = Array.isArray(cLegend);
    if ((0, _isNil3.default)(cLegend) || cLegend === false || isArr && cLegend.length === 0) {
        return chart.legend(false);
    }
    if (cLegend === true) {
        return chart.legend();
    }
    var arrLegend = isArr ? cLegend : [cLegend];
    for (var _i = 0, arrLegend_1 = arrLegend; _i < arrLegend_1.length; _i++) {
        var res = arrLegend_1[_i];
        if (res.highlight) {
            res = setHighlight(res);
        }
        var _loop_1 = function _loop_1(item) {
            if (res.hasOwnProperty(item)) {
                if (item === 'onClick') {
                    var content_1 = res.onClick;
                    res.onClick = function (ev) {
                        content_1(ev, chart);
                    };
                }
                EventUtils.setSEvent(chart, 'legend', item, res[item]);
            }
        };
        for (var item in res) {
            _loop_1(item);
        }
        if (!(0, _isNil3.default)(res.legendMarker)) {
            res['g2-legend-marker'] = res.legendMarker;
        }
        if (!(0, _isNil3.default)(res.legendListItem)) {
            res['g2-legend-list-item'] = res.legendListItem;
        }
        res = (0, _omit3.default)(res, ['legendMarker', 'legendListItem']);
        if (res.dataKey) {
            if (res.show === false) {
                chart.legend(res.dataKey, false);
            } else {
                var option = (0, _omit3.default)(res, ['dataKey', 'show']);
                chart.legend(res.dataKey, option);
            }
        } else {
            chart.legend(res);
        }
    }
    return chart;
};
//# sourceMappingURL=setLegendConfig.js.map