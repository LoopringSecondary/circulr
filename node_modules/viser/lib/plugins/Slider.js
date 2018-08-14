'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var Slider = require('@antv/g2-plugin-slider');

exports.default = function (config) {
    var container = document.getElementById(config.container);
    if (!container) {
        console.error('plugin slider container not defined');
        return;
    }
    container.innerHTML = '';
    var sliderInstance = new Slider(config);
    sliderInstance.render();
};
//# sourceMappingURL=Slider.js.map