"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'disableDynamicImport',

    validate(val) {
      (0, _assert.default)(typeof val === 'boolean', `The disableDynamicImport config must be Boolean, but got ${val}`);
    }

  };
}