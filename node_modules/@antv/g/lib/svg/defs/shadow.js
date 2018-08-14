/**
 * Created by Elaine on 2018/5/10.
 */
var Util = require('../../util/index');

var ATTR_MAP = {
  shadowColor: 'color',
  shadowOpacity: 'opacity',
  shadowBlur: 'blur',
  shadowOffsetX: 'dx',
  shadowOffsetY: 'dy'
};

function parseShadow(config, el) {
  var child = '<feDropShadow \n      dx="' + config.dx + '" \n      dy="' + config.dy + '" \n      stdDeviation="' + (config.blur ? config.blur / 10 : 0) + '"\n      flood-color="' + (config.color ? config.color : '#000') + '"\n      flood-opacity="' + (config.opacity ? config.opacity : 1) + '"\n      />';
  el.innerHTML = child;
}

var Shadow = function Shadow(cfg) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', 'filter');
  var id = Util.uniqueId('filter_');
  el.setAttribute('id', id);
  parseShadow(cfg, el);
  this.__cfg = { el: el, id: id };
  this.__attrs = { config: cfg };
  return this;
};
Util.augment(Shadow, {
  type: 'filter',
  match: function match(type, cfg) {
    if (this.type !== type) {
      return false;
    }
    var flag = false;
    var config = this.__attrs.config;
    Util.each(Object.keys(config), function (attr) {
      if (!flag) {
        flag = config[attr] === cfg[attr];
      }
    });
    return flag;
  },
  update: function update(name, value) {
    var config = this.__attrs.config;
    config[ATTR_MAP[name]] = value;
    parseShadow(config, this.__cfg.el);
    return this;
  }
});

module.exports = Shadow;