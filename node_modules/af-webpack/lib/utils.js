"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stripLastSlash = stripLastSlash;

function stripLastSlash(str) {
  return str.slice(-1) === '/' ? str.slice(0, -1) : str;
}