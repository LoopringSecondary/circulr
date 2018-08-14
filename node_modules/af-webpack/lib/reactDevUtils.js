"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "clearConsole", {
  enumerable: true,
  get: function get() {
    return _clearConsole2.default;
  }
});
exports.webpackHotDevClientPath = void 0;

var _clearConsole2 = _interopRequireDefault(require("./clearConsole"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const webpackHotDevClientPath = require.resolve('./webpackHotDevClient');

exports.webpackHotDevClientPath = webpackHotDevClientPath;