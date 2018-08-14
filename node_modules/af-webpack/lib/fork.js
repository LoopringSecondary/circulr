"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = start;

var _child_process = require("child_process");

var _send = _interopRequireWildcard(require("./send"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function start(devScriptPath) {
  const devProcess = (0, _child_process.fork)(devScriptPath, process.argv.slice(2));
  devProcess.on('message', data => {
    const type = data && data.type || null;

    if (type === _send.RESTART) {
      devProcess.kill('SIGINT');
      start(devScriptPath);
    }

    (0, _send.default)(data);
  });
}