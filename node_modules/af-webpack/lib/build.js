"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = build;

var _webpack = _interopRequireDefault(require("webpack"));

var _chalk = _interopRequireDefault(require("chalk"));

var _rimraf = require("rimraf");

var _assert = _interopRequireDefault(require("assert"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _formatWebpackMessages = _interopRequireDefault(require("react-dev-utils/formatWebpackMessages"));

var _printBuildError = _interopRequireDefault(require("react-dev-utils/printBuildError"));

var _FileSizeReporter = require("react-dev-utils/FileSizeReporter");

var _applyWebpackConfig = require("./applyWebpackConfig");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const debug = require('debug')('af-webpack:build'); // These sizes are pretty large. We'll warn for bundles exceeding them.


const WARN_AFTER_BUNDLE_GZIP_SIZE = 512 * 1024;
const WARN_AFTER_CHUNK_GZIP_SIZE = 1024 * 1024;

function buildWebpack(opts = {}) {
  const webpackConfig = opts.webpackConfig,
        watch = opts.watch,
        success = opts.success,
        fail = opts.fail;
  debug(`webpack config: ${JSON.stringify(webpackConfig)}`);
  debug(`Clean output path ${webpackConfig.output.path.replace(`${process.cwd()}/`, '')}`);
  (0, _rimraf.sync)(webpackConfig.output.path);

  function successHandler({
    stats,
    warnings
  }) {
    if (warnings.length) {
      console.log(_chalk.default.yellow('Compiled with warnings.\n'));
      console.log(warnings.join('\n\n'));
    } else {
      console.log(_chalk.default.green('Compiled successfully.\n'));
    }

    console.log('File sizes after gzip:\n');
    (0, _FileSizeReporter.printFileSizesAfterBuild)(stats, {
      root: webpackConfig.output.path,
      sizes: {}
    }, webpackConfig.output.path, WARN_AFTER_BUNDLE_GZIP_SIZE, WARN_AFTER_CHUNK_GZIP_SIZE);
    console.log();

    if (success) {
      success({
        stats,
        warnings
      });
    }
  }

  function errorHandler(err) {
    console.log(_chalk.default.red('Failed to compile.\n'));
    (0, _printBuildError.default)(err);
    debug(err);
    if (fail) fail(err);
    if (!watch) process.exit(1);
  }

  function doneHandler(err, stats) {
    debug('build done');

    if (err) {
      return errorHandler(err);
    }

    const messages = (0, _formatWebpackMessages.default)(stats.toJson({}, true));

    if (messages.errors.length) {
      if (messages.errors.length > 1) {
        messages.errors.length = 1;
      }

      return errorHandler(new Error(messages.errors.join('\n\n')));
    }

    return successHandler({
      stats,
      warnings: messages.warnings
    });
  }

  const compiler = (0, _webpack.default)(webpackConfig);

  if (watch) {
    compiler.watch(200, doneHandler);
  } else {
    compiler.run(doneHandler);
  }
}

function build(opts = {}) {
  const webpackConfig = opts.webpackConfig,
        _opts$cwd = opts.cwd,
        cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd;
  (0, _assert.default)(webpackConfig, 'webpackConfig should be supplied.');
  (0, _assert.default)((0, _isPlainObject.default)(webpackConfig), 'webpackConfig should be plain object.'); // 存在 webpack.config.js 时提醒用户

  (0, _applyWebpackConfig.warnIfExists)(opts.cwd || cwd);
  buildWebpack(opts);
}