
var G = require('@antv/g/src');
var Global = require('./global');
var Util = require('./util');

var renderer = G.canvas;

if (Global.renderer2d === 'svg') {
  renderer = G.svg;
}

Util.mix(renderer, G);

module.exports = renderer;