"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default(source, map) {
  const resourcePath = this.resourcePath;
  const debugLoader = process.env.DEBUG_LOADER;

  if (debugLoader && resourcePath.indexOf(debugLoader) > -1) {
    console.log('');
    console.log('');
    console.log('-------------------------------');
    console.log(resourcePath);
    console.log('===');
    console.log(source);
    console.log('-------------------------------');
    console.log('');
    console.log('');
  }

  this.callback(null, source, map);
}