"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _assert = _interopRequireDefault(require("assert"));

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  return {
    name: 'cssModulesExcludes',

    validate(val) {
      (0, _assert.default)(Array.isArray(val), `The cssModulesExcludes config must be Array, but got ${val}`);
      val.forEach(file => {
        const ext = (0, _path.extname)(file).toLowerCase();
        (0, _assert.default)(ext === '.css' || ext === '.less', `Items in the cssModulesExcludes config must end with .css or .less, but got ${file}`);
      });
    }

  };
}