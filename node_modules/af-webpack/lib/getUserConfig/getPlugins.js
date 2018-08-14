"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = require("path");

var _requireindex = _interopRequireDefault(require("requireindex"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default() {
  const pluginsMap = (0, _requireindex.default)((0, _path.join)(__dirname, './configs'));
  return Object.keys(pluginsMap).map(key => {
    return pluginsMap[key].default();
  });
}