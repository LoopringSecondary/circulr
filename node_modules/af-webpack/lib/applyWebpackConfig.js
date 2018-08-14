"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnIfExists = warnIfExists;
exports.applyWebpackConfig = applyWebpackConfig;

var _fs = require("fs");

var _path = require("path");

var _chalk = _interopRequireDefault(require("chalk"));

var _webpack = _interopRequireDefault(require("webpack"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function warnIfExists(cwd) {
  const filePath = (0, _path.join)(cwd, 'webpack.config.js');

  if ((0, _fs.existsSync)(filePath)) {
    console.log(_chalk.default.yellow(`⚠️ ⚠️ ⚠️  It\\'s not recommended to use ${_chalk.default.bold('webpack.config.js')}, since it\\'s major or minor version upgrades may result in incompatibility. If you insist on doing so, please be careful of the compatibility after upgrading.`));
    console.log();
  }
}

function applyWebpackConfig(cwd, config) {
  const filePath = (0, _path.join)(cwd, 'webpack.config.js');

  if ((0, _fs.existsSync)(filePath)) {
    let customConfigFn = require(filePath); // eslint-disable-line


    if (customConfigFn.default) {
      customConfigFn = customConfigFn.default;
    }

    return customConfigFn(config, {
      // eslint-disable-line
      webpack: _webpack.default
    });
  } else {
    return config;
  }
}