'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.setDefaultPoint = exports.process = undefined;

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

var process = exports.process = function process(chart, config) {
    var cTooltip = (0, _cloneDeep3.default)(config.tooltip);
    if ((0, _isNil3.default)(cTooltip) || cTooltip === false || cTooltip.show === false) {
        return chart.tooltip(false);
    }
    for (var item in cTooltip) {
        if (cTooltip.hasOwnProperty(item)) {
            if (item === 'g2Tooltip') {
                cTooltip['g2-tooltip'] = cTooltip[item];
                cTooltip = (0, _omit3.default)(cTooltip, 'g2Tooltip');
            }
            if (item === 'g2TooltipTitle') {
                cTooltip['g2-tooltip-title'] = cTooltip[item];
                cTooltip = (0, _omit3.default)(cTooltip, 'g2TooltipTitle');
            }
            if (item === 'g2TooltipList') {
                cTooltip['g2-tooltip-list'] = cTooltip[item];
                cTooltip = (0, _omit3.default)(cTooltip, 'g2TooltipList');
            }
            if (item === 'g2TooltipListItem') {
                cTooltip['g2-tooltip-list-item'] = cTooltip[item];
                cTooltip = (0, _omit3.default)(cTooltip, 'g2TooltipListItem');
            }
            if (item === 'g2TooltipMaker') {
                cTooltip['g2-tooltip-maker'] = cTooltip[item];
                cTooltip = (0, _omit3.default)(cTooltip, 'g2TooltipMaker');
            }
        }
    }
    EventUtils.setEvent(chart, 'tooltip', cTooltip);
    return chart.tooltip(cTooltip);
};
var setDefaultPoint = exports.setDefaultPoint = function setDefaultPoint(chart, config) {
    var cTooltip = (0, _cloneDeep3.default)(config.tooltip);
    if (!(0, _isNil3.default)(cTooltip) && cTooltip !== false && cTooltip.show !== false && cTooltip.defaultPoint) {
        var defaultPoint = cTooltip.defaultPoint;
        var xyPoint = chart.getXY(defaultPoint);
        if (!!xyPoint) {
            chart.showTooltip(xyPoint);
        }
    }
};
//# sourceMappingURL=setTooltipConfig.js.map