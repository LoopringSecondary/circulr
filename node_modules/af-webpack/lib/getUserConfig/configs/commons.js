"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'commons',

    validate(val) {
      // TODO: 校验数组项的构成
      (0, _assert.default)(Array.isArray(val), `The commons config must be Array, but got ${val}`);
    }

  };
}