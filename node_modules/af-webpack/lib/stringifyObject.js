"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(obj) {
  return Object.keys(obj).reduce((memo, key) => {
    memo[key] = JSON.stringify(obj[key]);
    return memo;
  }, {});
}