function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// const Global = require('../global');
var Util = require('../util');
var DomUtil = Util.DomUtil;
var View = require('../chart/view');
var G2 = require('../core.js');

var assign = Util.assign;

var Interaction = function () {
  Interaction.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      startEvent: 'mousedown',
      processingEvent: 'mousemove',
      endEvent: 'mouseup',
      resetEvent: 'dblclick'
    };
  };

  Interaction.prototype._start = function _start(ev) {
    var me = this;
    me.preStart && me.preStart(ev);
    me.start(ev);
    me.onStart && me.onStart(ev);
  };

  Interaction.prototype._process = function _process(ev) {
    var me = this;
    me.preProcess && me.preProcess(ev);
    me.process(ev);
    me.onProcess && me.onProcess(ev);
  };

  Interaction.prototype._end = function _end(ev) {
    var me = this;
    me.preEnd && me.preEnd(ev);
    me.end(ev);
    me.onEnd && me.onEnd(ev);
  };

  Interaction.prototype._reset = function _reset(ev) {
    var me = this;
    me.preReset && me.preReset(ev);
    me.reset(ev);
    me.onReset && me.onReset(ev);
  };

  Interaction.prototype.start = function start() {
    // TODO override
  };

  Interaction.prototype.process = function process() {
    // TODO override
  };

  Interaction.prototype.end = function end() {
    // TODO override
  };

  Interaction.prototype.reset = function reset() {
    // TODO override
  };

  function Interaction(cfg, view) {
    _classCallCheck(this, Interaction);

    var me = this;
    var defaultCfg = me.getDefaultCfg();
    assign(me, defaultCfg, cfg);
    me.view = view;
    me.canvas = view.get('canvas');
    me._bindEvents();
  }

  Interaction.prototype._bindEvents = function _bindEvents() {
    var me = this;
    var canvas = me.canvas;
    var canvasDOM = canvas.get('canvasDOM');
    me._clearEvents();
    me._onStartListener = DomUtil.addEventListener(canvasDOM, me.startEvent, Util.wrapBehavior(me, '_start'));
    me._onProcessingListener = DomUtil.addEventListener(canvasDOM, me.processingEvent, Util.wrapBehavior(me, '_process'));
    me._onEndListener = DomUtil.addEventListener(canvasDOM, me.endEvent, Util.wrapBehavior(me, '_end'));
    me._onResetListener = DomUtil.addEventListener(canvasDOM, me.resetEvent, Util.wrapBehavior(me, '_reset'));
  };

  Interaction.prototype._clearEvents = function _clearEvents() {
    var me = this;
    me._onStartListener && me._onStartListener.remove();
    me._onProcessingListener && me._onProcessingListener.remove();
    me._onEndListener && me._onEndListener.remove();
    me._onResetListener && me._onResetListener.remove();
  };

  Interaction.prototype.destroy = function destroy() {
    this._clearEvents();
  };

  return Interaction;
}();

G2._Interactions = {};
G2.registerInteraction = function (type, constructor) {
  G2._Interactions[type] = constructor;
};
G2.getInteraction = function (type) {
  return G2._Interactions[type];
};

View.prototype.getInteractions = function () {
  var me = this;
  if (!me._interactions) {
    me._interactions = {};
  }
  return me._interactions;
};

View.prototype.setInteraction = function (type, interact) {
  var me = this;
  var interactions = me.getInteractions();
  interactions[type] = interactions[type] || [];
  interactions[type].push(interact);
};

View.prototype.clearInteraction = function (type) {
  var me = this;
  var interactions = me.getInteractions();
  if (type) {
    (interactions[type] || []).forEach(function (interact) {
      interact.destroy();
    });
    delete interactions[type];
  } else {
    Util.each(interactions, function (collection, key) {
      (collection || []).forEach(function (interact) {
        interact.destroy();
      });
      delete interactions[key];
    });
  }
};
View.prototype.interact = function (type, cfg) {
  var me = this;
  var Ctor = G2.getInteraction(type);
  var interact = new Ctor(cfg, me);
  me.setInteraction(type, interact);
  return me;
};

module.exports = Interaction;