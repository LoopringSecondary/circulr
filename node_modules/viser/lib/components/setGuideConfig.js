'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.process = undefined;

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _EventUtils = require('../utils/EventUtils');

var EventUtils = _interopRequireWildcard(_EventUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var __assign = undefined && undefined.__assign || Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
    }
    return t;
};

function setGuideLine(chart, item) {
    if (item.quickType === 'parallel') {
        var data = item.data;
        chart.guide().line(__assign({ start: ['min', data], end: ['max', data] }, item));
    } else if (item.quickType === 'normal') {
        var data = item.data;
        chart.guide().line(__assign({ start: [data, 'min'], end: [data, 'max'] }, item));
    } else {
        chart.guide().line(item);
    }
}
function setGuideArc(chart, item) {
    if (item.quickType === 'parallel') {
        var data = item.data;
        chart.guide().arc(__assign({ start: ['min', data], end: ['max', data] }, item));
        chart.guide().arc(__assign({ start: ['max', data], end: ['min', data] }, item));
    } else if (item.quickType === 'normal') {
        var data = item.data;
        chart.guide().line(__assign({ start: [data, 'min'], end: [data, 'max'] }, item));
    } else {
        chart.guide().arc(item);
    }
}
var process = exports.process = function process(chart, config) {
    var cGuide = (0, _cloneDeep3.default)(config.guide);
    var isArr = Array.isArray(cGuide);
    if ((0, _isNil3.default)(cGuide) || (0, _isEmpty3.default)(cGuide)) {
        return;
    }
    var arrGuide = isArr ? cGuide : [cGuide];
    arrGuide.forEach(function (res) {
        EventUtils.setEvent(chart, "guide-" + res.type, res);
        if (res.type === 'line') {
            setGuideLine(chart, res);
        } else if (res.type === 'region') {
            chart.guide().region(res);
        } else if (res.type === 'arc') {
            setGuideArc(chart, res);
        } else if (res.type === 'text') {
            chart.guide().text(res);
        } else if (res.type === 'image') {
            chart.guide().image(res);
        } else if (res.type === 'html') {
            chart.guide().html(res);
        }
    });
    return chart;
};
//# sourceMappingURL=setGuideConfig.js.map