"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = registerBabel;

function registerBabel(opts = {}) {
  const only = opts.only,
        ignore = opts.ignore,
        babelPreset = opts.babelPreset,
        disablePreventTest = opts.disablePreventTest;

  if (disablePreventTest || process.env.NODE_ENV !== 'test') {
    process.env.BABEL_DISABLE_CACHE = 1;

    require('@babel/register')({
      // eslint-disable-line
      presets: [babelPreset],
      plugins: [require.resolve('babel-plugin-add-module-exports'), require.resolve('@babel/plugin-transform-modules-commonjs')],
      only,
      ignore,
      babelrc: false,
      cache: false
    });
  }
}