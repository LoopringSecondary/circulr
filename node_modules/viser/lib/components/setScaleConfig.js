'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.process = undefined;

var _omit2 = require('lodash/omit');

var _omit3 = _interopRequireDefault(_omit2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _cloneDeep2 = require('lodash/cloneDeep');

var _cloneDeep3 = _interopRequireDefault(_cloneDeep2);

var _setCustomFormatter = require('./setCustomFormatter');

var setCustomFormatter = _interopRequireWildcard(_setCustomFormatter);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var process = exports.process = function process(chart, config) {
    var cScale = (0, _cloneDeep3.default)(config.scale);
    var isArr = (0, _isArray3.default)(cScale);
    if ((0, _isEmpty3.default)(cScale)) {
        return;
    }
    var arrScale = isArr ? cScale : [cScale];
    var options = {};
    for (var _i = 0, arrScale_1 = arrScale; _i < arrScale_1.length; _i++) {
        var res = arrScale_1[_i];
        if (res.dataKey) {
            var currOption = (0, _omit3.default)(res, 'dataKey');
            options[res.dataKey] = currOption;
        }
    }
    options = setCustomFormatter.supportD3Formatter(options);
    return chart.scale(options);
};
//# sourceMappingURL=setScaleConfig.js.map