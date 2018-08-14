"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = createLaunchEditorMiddleware;

var _launchEditor = _interopRequireDefault(require("react-dev-utils/launchEditor"));

var _launchEditorEndpoint = _interopRequireDefault(require("react-dev-utils/launchEditorEndpoint"));

var _send = _interopRequireWildcard(require("./send"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLaunchEditorMiddleware() {
  return function launchEditorMiddleware(req, res, next) {
    if (req.url.startsWith(_launchEditorEndpoint.default)) {
      // 让支付宝开发者工具打开指定文件
      if (process.env.ALIPAY_EDITOR && process.send) {
        (0, _send.default)({
          type: _send.OPEN_FILE,
          payload: req.query
        });
      } else {
        (0, _launchEditor.default)(req.query.fileName, req.query.lineNumber);
      }

      res.end();
    } else {
      next();
    }
  };
}