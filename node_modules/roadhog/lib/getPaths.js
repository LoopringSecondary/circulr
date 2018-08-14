"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

const _require = require('path'),
      resolve = _require.resolve;

const _require2 = require('fs'),
      realpathSync = _require2.realpathSync;

function resolveOwn(relativePath) {
  return resolve(__dirname, relativePath);
}

function _default(cwd) {
  const appDirectory = realpathSync(cwd);

  function resolveApp(relativePath) {
    return resolve(appDirectory, relativePath);
  }

  return {
    appBuild: resolveApp('dist'),
    appPublic: resolveApp('public'),
    appPackageJson: resolveApp('package.json'),
    appSrc: resolveApp('src'),
    appNodeModules: resolveApp('node_modules'),
    ownNodeModules: resolveOwn('../../node_modules'),
    resolveApp,
    appDirectory
  };
}