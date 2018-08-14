/**
 * Created by Elaine on 2018/5/14.
 */
var Util = require('../../util/index');

var Clip = function Clip(cfg) {
  var el = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath');
  var id = Util.uniqueId('clip_');
  if (cfg.get('el')) {
    el.appendChild(cfg.get('el'));
  } else if (Util.isString(cfg.nodeName)) {
    el.appendChild(cfg);
  } else {
    throw 'clip element should be a instance of Shape or a SVG node';
  }
  el.setAttribute('id', id);
  this.__cfg = { el: el, id: id };
  this.__attrs = { config: cfg };
  return this;
};

Util.augment(Clip, {
  type: 'clip',
  match: function match() {
    return false;
  }
});

module.exports = Clip;