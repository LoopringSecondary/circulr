'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.supportD3Formatter = undefined;

var _isString2 = require('lodash/isString');

var _isString3 = _interopRequireDefault(_isString2);

var _get2 = require('lodash/get');

var _get3 = _interopRequireDefault(_get2);

var _d3Format = require('d3-format');

var d3 = _interopRequireWildcard(_d3Format);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var supportD3Formatter = exports.supportD3Formatter = function supportD3Formatter(obj) {
    var _loop_1 = function _loop_1(item) {
        if (obj.hasOwnProperty(item)) {
            var formatter_1 = (0, _get3.default)(obj[item], 'formatter');
            if ((0, _isString3.default)(formatter_1)) {
                obj[item].formatter = function (val) {
                    return d3.format(formatter_1)(val);
                };
            }
        }
    };
    for (var item in obj) {
        _loop_1(item);
    }
    return obj;
};
//# sourceMappingURL=setCustomFormatter.js.map