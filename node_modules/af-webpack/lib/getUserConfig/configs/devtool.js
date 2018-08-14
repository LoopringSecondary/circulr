"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'devtool',

    validate(val) {
      (0, _assert.default)(typeof val === 'string', `The devtool config must be String, but got ${val}`);
    }

  };
}