var Util = require('../util/index');
var Event = require('./event');
var Group = require('./core/group');
var Defs = require('./core/defs');
var Timeline = require('../util/mixin/timeline');

var Canvas = function Canvas(cfg) {
  Canvas.superclass.constructor.call(this, cfg);
};

Canvas.CFG = {
  eventEnable: true,
  /**
   * 像素宽度
   * @type {Number}
   */
  width: null,
  /**
   * 像素高度
   * @type {Number}
   */
  height: null,
  /**
   * 画布宽度
   * @type {Number}
   */
  widthCanvas: null,
  /**
   * 画布高度
   * @type {Number}
   */
  heightCanvas: null,
  /**
   * CSS宽
   * CSS宽
   * @type {String}
   */
  widthStyle: null,
  /**
   * CSS高
   * @type {String}
   */
  heightStyle: null,
  /**
   * 容器DOM
   * @type {Object}
   */
  containerDOM: null,
  /**
   * 当前Canvas的DOM
   * @type {Object}
   */
  canvasDOM: null,
  /**
   * 屏幕像素比
   * @type {Number}
   */
  pixelRatio: Util.getRatio()
};

Util.extend(Canvas, Group);

Util.augment(Canvas, {
  init: function init() {
    Canvas.superclass.init.call(this);
    this._setDOM();
    this._setInitSize();
    // this._scale();
    if (this.get('eventEnable')) {
      this._registEvents();
    }
  },
  getEmitter: function getEmitter(element, event) {
    if (element) {
      if (Util.isEmpty(element._getEvents())) {
        var parent = element.get('parent');
        if (parent && !event.propagationStopped) {
          return this.getEmitter(parent, event);
        }
      } else {
        return element;
      }
    }
  },
  _getEventObj: function _getEventObj(type, e, point, target) {
    var event = new Event(type, e, true, true);
    event.x = point.x;
    event.y = point.y;
    event.clientX = e.clientX;
    event.clientY = e.clientY;
    event.currentTarget = target;
    event.target = target;
    return event;
  },
  _triggerEvent: function _triggerEvent(type, e) {
    var point = this.getPointByClient(e.clientX, e.clientY);
    var shape = this.findShape(e.srcElement);
    var emitObj = void 0;
    if (type === 'mousemove') {
      var preShape = this.get('preShape');
      if (preShape && preShape !== shape) {
        var mouseleave = this._getEventObj('mouseleave', e, point, preShape);
        emitObj = this.getEmitter(preShape, e);
        emitObj && emitObj.emit('mouseleave', mouseleave);
      }

      if (shape) {
        var mousemove = this._getEventObj('mousemove', e, point, shape);
        emitObj = this.getEmitter(shape, e);
        emitObj && emitObj.emit('mousemove', mousemove);

        if (preShape !== shape) {
          var mouseenter = this._getEventObj('mouseenter', e, point, shape);
          emitObj && emitObj.emit('mouseenter', mouseenter, e);
        }
      } else {
        var canvasmousemove = this._getEventObj('mousemove', e, point, this);
        this.emit('mousemove', canvasmousemove);
      }
      this.set('preShape', shape);
    } else {
      var event = this._getEventObj(type, e, point, shape || this);
      emitObj = this.getEmitter(shape, e);
      if (emitObj && emitObj !== this) {
        emitObj.emit(type, event);
      }
      this.emit(type, event);
    }

    var el = this.get('el');
    if (shape && !shape.get('destroyed')) {
      el.style.cursor = shape.attr('cursor') || 'default';
    }
  },
  _registEvents: function _registEvents() {
    var self = this;
    var el = self.get('el');
    var events = ['mouseout', 'mouseover', 'mousemove', 'mousedown', 'mouseup', 'click', 'dblclick'];

    Util.each(events, function (event) {
      el.addEventListener(event, function (e) {
        self._triggerEvent(event, e);
      }, false);
    });
    el.addEventListener('touchstart', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchstart', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchmove', function (e) {
      if (!Util.isEmpty(e.touches)) {
        self._triggerEvent('touchmove', e.touches[0]);
      }
    }, false);

    el.addEventListener('touchend', function (e) {
      if (!Util.isEmpty(e.changedTouches)) {
        self._triggerEvent('touchend', e.changedTouches[0]);
      }
    }, false);
  },
  _setDOM: function _setDOM() {
    this._setContainer();
    this._setLayer();
  },
  _setContainer: function _setContainer() {
    var containerId = this.get('containerId');
    var containerDOM = this.get('containerDOM');
    if (!containerDOM) {
      containerDOM = document.getElementById(containerId);
      this.set('containerDOM', containerDOM);
    }
    Util.modifyCSS(containerDOM, {
      position: 'relative'
    });
  },
  _setLayer: function _setLayer() {
    var containerDOM = this.get('containerDOM');
    var canvasId = Util.uniqueId('svg_');
    if (containerDOM) {
      var _canvasDOM = Util.createDom('<svg id="' + canvasId + '"></svg>');
      containerDOM.appendChild(_canvasDOM);
      var defs = new Defs();
      _canvasDOM.appendChild(defs.get('el'));
      this.set('canvasDOM', _canvasDOM);
      this.set('el', _canvasDOM);
      this.set('defs', defs);
      this.set('canvas', this);
    }
    var canvasDOM = this.get('canvasDOM');
    var timeline = new Timeline();
    this.setSilent('timeline', timeline);
    this.set('context', canvasDOM);
  },
  _setInitSize: function _setInitSize() {
    this.changeSize(this.get('width'), this.get('height'));
    this.set('pixelRatio', 1);
  },
  _resize: function _resize() {
    var canvasDOM = this.get('canvasDOM');
    var widthCanvas = this.get('widthCanvas');
    var heightCanvas = this.get('heightCanvas');
    var widthStyle = this.get('widthStyle');
    var heightStyle = this.get('heightStyle');

    canvasDOM.style.width = widthStyle;
    canvasDOM.style.height = heightStyle;
    canvasDOM.setAttribute('width', widthCanvas);
    canvasDOM.setAttribute('height', heightCanvas);
  },
  getWidth: function getWidth() {
    return this.get('width');
  },
  getHeight: function getHeight() {
    return this.get('height');
  },
  changeSize: function changeSize(width, height) {
    this.set('widthCanvas', width);
    this.set('heightCanvas', height);
    this.set('widthStyle', width + 'px');
    this.set('heightStyle', height + 'px');
    this.set('width', width);
    this.set('height', height);
    this._resize();
  },

  /**
   * 将窗口坐标转变成 canvas 坐标
   * @param  {Number} clientX 窗口x坐标
   * @param  {Number} clientY 窗口y坐标
   * @return {Object} canvas坐标
   */
  getPointByClient: function getPointByClient(clientX, clientY) {
    var el = this.get('el');
    var bbox = el.getBoundingClientRect();
    return {
      x: clientX - bbox.left,
      y: clientY - bbox.top
    };
  },
  getClientByPoint: function getClientByPoint(x, y) {
    var el = this.get('el');
    var bbox = el.getBoundingClientRect();
    return {
      clientX: x + bbox.left,
      clientY: y + bbox.top
    };
  },
  beforeDraw: function beforeDraw() {
    var el = this.get('el');
    // canvas版本用盖一个canvas大小的矩阵清空画布，svg换成清空html
    el.innerHTML = '';
  },
  _beginDraw: function _beginDraw() {
    this.setSilent('toDraw', true);
  },
  _endDraw: function _endDraw() {
    this.setSilent('toDraw', false);
  },

  // svg实时渲染，兼容canvas版本留个空接口
  draw: function draw() {},
  destroy: function destroy() {
    var containerDOM = this.get('containerDOM');
    var canvasDOM = this.get('canvasDOM');
    if (canvasDOM && containerDOM) {
      containerDOM.removeChild(canvasDOM);
    }
    Canvas.superclass.destroy.call(this);
  }
});

module.exports = Canvas;