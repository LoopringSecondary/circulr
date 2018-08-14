"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _path = require("path");

var _registerBabel = _interopRequireDefault(require("af-webpack/registerBabel"));

var _lodash = _interopRequireDefault(require("lodash.escaperegexp"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _default(babelPreset, opts) {
  const configOnly = opts.configOnly,
        disablePreventTest = opts.disablePreventTest,
        ignore = opts.ignore,
        cwd = opts.cwd;
  const files = ['.roadhogrc.mock.js', '.webpackrc.js', 'webpack.config.js', 'mock', 'src'].map(file => {
    return (0, _lodash.default)((0, _path.join)(cwd, file));
  });
  const only = configOnly ? [new RegExp(`(${files.join('|')})`)] : null;
  (0, _registerBabel.default)({
    only,
    ignore,
    babelPreset,
    disablePreventTest
  });
}