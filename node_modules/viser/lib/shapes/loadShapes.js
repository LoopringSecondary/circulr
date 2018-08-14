'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    Sankey.registerShape();
    ErrorBar.registerShape();
};

var _ErrorBar = require('./ErrorBar');

var ErrorBar = _interopRequireWildcard(_ErrorBar);

var _Sankey = require('./Sankey');

var Sankey = _interopRequireWildcard(_Sankey);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }