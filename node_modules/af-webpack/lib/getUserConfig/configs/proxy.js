"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'proxy',

    validate(val) {
      (0, _assert.default)((0, _isPlainObject.default)(val), `The proxy config must be Plain Object, but got ${val}`);
    }

  };
}