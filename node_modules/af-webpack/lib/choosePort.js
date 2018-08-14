"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = choosePort;

var _detectPort = _interopRequireDefault(require("detect-port"));

var _getProcessForPort = _interopRequireDefault(require("react-dev-utils/getProcessForPort"));

var _chalk = _interopRequireDefault(require("chalk"));

var _inquirer = _interopRequireDefault(require("inquirer"));

var _isRoot = _interopRequireDefault(require("is-root"));

var _clearConsole = _interopRequireDefault(require("./clearConsole"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const isInteractive = process.stdout.isTTY;

function choosePort(defaultPort) {
  if (process.env.DETECT_PORT === 'none') {
    return Promise.resolve(defaultPort);
  }

  return (0, _detectPort.default)(defaultPort).then(port => new Promise(resolve => {
    if (port === defaultPort) {
      return resolve(port);
    }

    const message = process.platform !== 'win32' && defaultPort < 1024 && !(0, _isRoot.default)() ? `Admin permissions are required to run a server on a port below 1024.` : `Something is already running on port ${defaultPort}.`;

    if (isInteractive) {
      (0, _clearConsole.default)();
      const existingProcess = (0, _getProcessForPort.default)(defaultPort);
      const question = {
        type: 'confirm',
        name: 'shouldChangePort',
        message: `${_chalk.default.yellow(`message${existingProcess // eslint-disable-line
        ? ` Probably:\n  ${existingProcess}` : ''}`)}\n\nWould you like to run the app on another port instead?`,
        default: true
      };

      _inquirer.default.prompt(question).then(answer => {
        if (answer.shouldChangePort) {
          resolve(port);
        } else {
          resolve(null);
        }
      });
    } else {
      console.log(_chalk.default.red(message));
      resolve(null);
    }
  }), err => {
    throw new Error(_chalk.default.red(`Could not find an open port.\nNetwork error message: ${err.message || err}\n`));
  });
}