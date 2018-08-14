/**
 * Created by Elaine on 2018/5/9.
 */
var Util = require('../../util/index');
var Element = require('./element');
var Gradient = require('../defs/gradient');
var Shadow = require('../defs/shadow');
var Arrow = require('../defs/arrow');
var Clip = require('../defs/clip');

var Defs = function Defs(cfg) {
  Defs.superclass.constructor.call(this, cfg);
  this.set('children', []);
};

Util.extend(Defs, Element);

Util.augment(Defs, {
  isGroup: false,
  canFill: false,
  canStroke: false,
  capture: false,
  visible: false,
  init: function init() {
    var el = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    var id = Util.uniqueId('defs_');
    el.setAttribute('id', id);
    this.set('el', el);
    this.set('children', []);
  },
  find: function find(type, attr) {
    var children = this.get('children');
    var result = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].match(type, attr)) {
        result = children[i].__cfg.id;
        break;
      }
    }
    return result;
  },
  findById: function findById(id) {
    var children = this.get('children');
    var flag = null;
    for (var i = 0; i < children.length; i++) {
      if (children[i].__cfg.id === id) {
        flag = children[i];
        break;
      }
    }
    return flag;
  },
  add: function add(items) {
    var el = this.get('el');
    var self = this;
    var children = this.get('children');
    if (Util.isArray(items)) {
      Util.each(items, function (item) {
        var parent = item.get('parent');
        if (parent) {
          parent.removeChild(item, false);
          self._setContext(item);
        }
        el.appendChild(item.get('el'));
      });
      children.push.apply(children, items);
      return self;
    }
    if (self.findById(items.get('id'))) {
      return self;
    }
    var parent = items.get('parent');
    if (parent) {
      parent.removeChild(items, false);
    }
    self._add(items);
    el.appendChild(items.get('el'));
    return self;
  },
  _add: function _add(item) {
    this.get('el').appendChild(item.__cfg.el);
    this.get('children').push(item);
    item.__cfg.parent = this;
    item.__cfg.defs = this;
    item.__cfg.canvas = this.__cfg.canvas;
  },
  addGradient: function addGradient(cfg) {
    var gradient = new Gradient(cfg);
    this._add(gradient);
    return gradient.__cfg.id;
  },
  addShadow: function addShadow(cfg) {
    var shadow = new Shadow(cfg);
    this._add(shadow);
    return shadow.__cfg.id;
  },
  addArrow: function addArrow(name, cfg, stroke) {
    var arrow = new Arrow(name, cfg, stroke);
    this._add(arrow);
    return arrow.__cfg.id;
  },
  addClip: function addClip(cfg) {
    var clip = new Clip(cfg);
    this._add(clip);
    return clip.__cfg.id;
  }
});

module.exports = Defs;