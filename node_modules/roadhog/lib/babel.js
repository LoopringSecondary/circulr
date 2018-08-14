"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(context, opts = {}) {
  return {
    presets: [[require.resolve('babel-preset-umi'), opts]]
  };
}