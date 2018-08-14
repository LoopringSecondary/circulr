"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getUserConfig;
exports.watchConfigs = watchConfigs;
exports.unwatchConfigs = unwatchConfigs;

var _fs = require("fs");

var _path = require("path");

var _assert = _interopRequireDefault(require("assert"));

var _stripJsonComments = _interopRequireDefault(require("strip-json-comments"));

var _didyoumean = _interopRequireDefault(require("didyoumean"));

var _chalk = _interopRequireDefault(require("chalk"));

var _lodash = _interopRequireDefault(require("lodash.isequal"));

var _isPlainObject = _interopRequireDefault(require("is-plain-object"));

var _reactDevUtils = require("../reactDevUtils");

var _watch = require("./watch");

var _getPlugins = _interopRequireDefault(require("./getPlugins"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const debug = require('debug')('af-webpack:getUserConfig');

const plugins = (0, _getPlugins.default)();
const pluginNames = plugins.map(p => p.name);
const pluginsMapByName = plugins.reduce((memo, p) => {
  memo[p.name] = p;
  return memo;
}, {});
let devServer = null;
const USER_CONFIGS = 'USER_CONFIGS';

function throwError(msg) {
  printError(msg);
  throw new Error(msg);
}

function printError(messages) {
  if (devServer) {
    devServer.sockWrite(devServer.sockets, 'errors', typeof messages === 'string' ? [messages] : messages);
  }
}

function reload() {
  devServer.sockWrite(devServer.sockets, 'content-changed');
}

function restart(why) {
  (0, _reactDevUtils.clearConsole)();
  console.log(_chalk.default.green(`Since ${why}, try to restart the server`));
  (0, _watch.unwatch)();
  devServer.close();
  process.send({
    type: 'RESTART'
  });
}

function merge(oldObj, newObj) {
  for (const key in newObj) {
    if (Array.isArray(newObj[key]) && Array.isArray(oldObj[key])) {
      oldObj[key] = oldObj[key].concat(newObj[key]);
    } else if ((0, _isPlainObject.default)(newObj[key]) && (0, _isPlainObject.default)(oldObj[key])) {
      oldObj[key] = Object.assign(oldObj[key], newObj[key]);
    } else {
      oldObj[key] = newObj[key];
    }
  }
}

function replaceNpmVariables(value, pkg) {
  if (typeof value === 'string') {
    return value.replace('$npm_package_name', pkg.name).replace('$npm_package_version', pkg.version);
  } else {
    return value;
  }
}

function getUserConfig(opts = {}) {
  const _opts$cwd = opts.cwd,
        cwd = _opts$cwd === void 0 ? process.cwd() : _opts$cwd,
        _opts$configFile = opts.configFile,
        configFile = _opts$configFile === void 0 ? '.webpackrc' : _opts$configFile,
        _opts$disabledConfigs = opts.disabledConfigs,
        disabledConfigs = _opts$disabledConfigs === void 0 ? [] : _opts$disabledConfigs,
        preprocessor = opts.preprocessor; // TODO: 支持数组的形式？
  // Read config from configFile and `${configFile}.js`

  const rcFile = (0, _path.resolve)(cwd, configFile);
  const jsRCFile = (0, _path.resolve)(cwd, `${configFile}.js`);
  (0, _assert.default)(!((0, _fs.existsSync)(rcFile) && (0, _fs.existsSync)(jsRCFile)), `${configFile} file and ${configFile}.js file can not exist at the same time.`);
  let config = {};

  if ((0, _fs.existsSync)(rcFile)) {
    config = JSON.parse((0, _stripJsonComments.default)((0, _fs.readFileSync)(rcFile, 'utf-8')));
  }

  if ((0, _fs.existsSync)(jsRCFile)) {
    // no cache
    delete require.cache[jsRCFile];
    config = require(jsRCFile); // eslint-disable-line

    if (config.default) {
      config = config.default;
    }
  }

  if (typeof preprocessor === 'function') {
    config = preprocessor(config);
  } // Context for validate function


  const context = {
    cwd
  }; // Validate

  let errorMsg = null;
  Object.keys(config).forEach(key => {
    // 禁用项
    if (disabledConfigs.includes(key)) {
      errorMsg = `Configuration item ${key} is disabled, please remove it.`;
    } // 非法的项


    if (!pluginNames.includes(key)) {
      const guess = (0, _didyoumean.default)(key, pluginNames);
      const affix = guess ? `do you meen ${guess} ?` : 'please remove it.';
      errorMsg = `Configuration item ${key} is not valid, ${affix}`;
    } else {
      // run config plugin's validate
      const plugin = pluginsMapByName[key];

      if (plugin.validate) {
        try {
          plugin.validate.call(context, config[key]);
        } catch (e) {
          errorMsg = e.message;
        }
      }
    }
  }); // 确保不管校验是否出错，下次 watch 判断时能拿到正确的值

  if (errorMsg) {
    if (
    /* from watch */
    opts.setConfig) {
      opts.setConfig(config);
    }

    throwError(errorMsg);
  } // Merge config with current env


  if (config.env) {
    if (config.env[process.env.NODE_ENV]) {
      merge(config, config.env[process.env.NODE_ENV]);
    }

    delete config.env;
  } // Replace npm variables


  const pkgFile = (0, _path.resolve)(cwd, 'package.json');

  if (Object.keys(config).length && (0, _fs.existsSync)(pkgFile)) {
    const pkg = JSON.parse((0, _fs.readFileSync)(pkgFile, 'utf-8'));
    config = Object.keys(config).reduce((memo, key) => {
      memo[key] = replaceNpmVariables(config[key], pkg);
      return memo;
    }, {});
  }

  let configFailed = false;

  function watchConfigsAndRun(_devServer, watchOpts = {}) {
    devServer = _devServer;
    const watcher = watchConfigs(opts);

    if (watcher) {
      watcher.on('all', () => {
        try {
          if (watchOpts.beforeChange) {
            watchOpts.beforeChange();
          }

          const _getUserConfig = getUserConfig(_objectSpread({}, opts, {
            setConfig(newConfig) {
              config = newConfig;
            }

          })),
                newConfig = _getUserConfig.config; // 从失败中恢复过来，需要 reload 一次


          if (configFailed) {
            configFailed = false;
            reload();
          } // 比较，然后执行 onChange


          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = plugins[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              const plugin = _step.value;
              const name = plugin.name,
                    onChange = plugin.onChange;

              if (!(0, _lodash.default)(newConfig[name], config[name])) {
                debug(`Config ${name} changed, from ${JSON.stringify(config[name])} to ${JSON.stringify(newConfig[name])}`);
                (onChange || restart.bind(null, `${name} changed`)).call(null, {
                  name,
                  val: config[name],
                  newVal: newConfig[name],
                  config,
                  newConfig
                });
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } catch (e) {
          configFailed = true;
          console.error(_chalk.default.red(`Watch handler failed, since ${e.message}`));
          console.error(e);
        }
      });
    }
  }

  debug(`UserConfig: ${JSON.stringify(config)}`);
  return {
    config,
    watch: watchConfigsAndRun
  };
}

function watchConfigs(opts = {}) {
  const _opts$cwd2 = opts.cwd,
        cwd = _opts$cwd2 === void 0 ? process.cwd() : _opts$cwd2,
        _opts$configFile2 = opts.configFile,
        configFile = _opts$configFile2 === void 0 ? '.webpackrc' : _opts$configFile2;
  const rcFile = (0, _path.resolve)(cwd, configFile);
  const jsRCFile = (0, _path.resolve)(cwd, `${configFile}.js`);
  return (0, _watch.watch)(USER_CONFIGS, [rcFile, jsRCFile]);
}

function unwatchConfigs() {
  (0, _watch.unwatch)(USER_CONFIGS);
}