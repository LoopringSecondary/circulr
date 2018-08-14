"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _fs = require("fs");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'theme',

    validate(val) {
      (0, _assert.default)((0, _isPlainObject.default)(val) || typeof val === 'string', `The theme config must be Plain Object or String, but got ${val}`);
      const cwd = this.cwd;

      if (typeof val === 'string') {
        const themeFile = (0, _path.join)(cwd, val);
        (0, _assert.default)((0, _fs.existsSync)(themeFile), `File ${val} of configure item theme not found.`);
      }
    }

  };
}