'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _Slider = require('./Slider');

var _Slider2 = _interopRequireDefault(_Slider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (config) {
    var plugins = {};
    for (var pluginName in config) {
        if (config.hasOwnProperty(pluginName)) {
            var pluginConfig = config[pluginName];
            switch (pluginName) {
                case 'slider':
                    plugins.slider = (0, _Slider2.default)(pluginConfig);
                    break;
                default:
                    break;
            }
        }
    }
    return plugins;
};
//# sourceMappingURL=index.js.map