'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Plugin = exports.Global = exports.registerShape = exports.registerAnimation = undefined;

var _isArray2 = require('lodash/isArray');

var _isArray3 = _interopRequireDefault(_isArray2);

var _isPlainObject2 = require('lodash/isPlainObject');

var _isPlainObject3 = _interopRequireDefault(_isPlainObject2);

var _isNil2 = require('lodash/isNil');

var _isNil3 = _interopRequireDefault(_isNil2);

var _isEmpty2 = require('lodash/isEmpty');

var _isEmpty3 = _interopRequireDefault(_isEmpty2);

exports.default = function (config) {
    if ((0, _isNil3.default)(config) || (0, _isEmpty3.default)(config)) {
        return;
    }
    var hasData = hasDataCondition(config);
    if (!hasData) {
        return;
    }
    var commonChart = new _CommonChart2.default(config);
    commonChart.render();
    return commonChart;
};

var _index = require('./plugins/index');

Object.defineProperty(exports, 'Plugin', {
    enumerable: true,
    get: function get() {
        return _interopRequireDefault(_index).default;
    }
});

var _CommonChart = require('./core/CommonChart');

var _CommonChart2 = _interopRequireDefault(_CommonChart);

var _CustomizeUtils = require('./utils/CustomizeUtils');

var CustomizeUtils = _interopRequireWildcard(_CustomizeUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var G2 = require('@antv/g2');
var registerAnimation = exports.registerAnimation = CustomizeUtils.registerAnimation;
var registerShape = exports.registerShape = CustomizeUtils.registerShape;
var Global = exports.Global = G2.Global;
function hasDataCondition(config) {
    var hasData = false;
    if (!(0, _isEmpty3.default)(config.data)) {
        hasData = true;
    }
    if (!(0, _isNil3.default)(config.views)) {
        if ((0, _isPlainObject3.default)(config.views) && !(0, _isEmpty3.default)(config.views.data)) {
            hasData = true;
        }
        if ((0, _isArray3.default)(config.views)) {
            for (var _i = 0, _a = config.views; _i < _a.length; _i++) {
                var item = _a[_i];
                if (!(0, _isEmpty3.default)(item.data)) {
                    hasData = true;
                }
            }
        }
    }
    return hasData;
}