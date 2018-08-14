"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _fs = require("fs");

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(path) {
  const content = (0, _stripJsonComments.default)((0, _fs.readFileSync)(path, 'utf-8'));
  return JSON.parse(content);
}