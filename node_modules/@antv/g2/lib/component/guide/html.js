function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the html guide
 * @author sima.zhang
 */
var Util = require('../../util');
var DomUtil = Util.DomUtil;
var Base = require('./base');

var Html = function (_Base) {
  _inherits(Html, _Base);

  function Html() {
    _classCallCheck(this, Html);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Html.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      type: 'html',
      zIndex: 7,
      /**
       * dom 显示位置点
       * @type {Object | Array}
       */
      position: null,
      /**
       * 水平方向对齐方式，可取值 'left'、'middle'、'right'
       * @type {String}
       */
      alignX: 'middle',
      /**
       * 垂直方向对齐方式，可取值 'top'、'middle'、'bottom'
       * @type {String}
       */
      alignY: 'middle',
      /**
       * x 方向的偏移量
       * @type {Number}
       */
      offsetX: null,
      /**
       * y 方向的偏移量
       * @type {Number}
       */
      offsetY: null,
      /**
      * html内容
      *@type {String | Function}
      */
      html: null
    });
  };

  Html.prototype.render = function render(coord, group) {
    var self = this;
    var position = self.parsePoint(coord, self.position);

    var parentNode = group.get('canvas').get('el').parentNode;
    var wrapperNode = DomUtil.createDom('<div class="g-guide"></div>');
    parentNode.appendChild(wrapperNode);

    var html = self.html;
    if (Util.isFunction(html)) {
      html = html(self.xScales, self.yScales);
    }
    var htmlNode = DomUtil.createDom(html);
    wrapperNode.appendChild(htmlNode);
    self._setDomPosition(wrapperNode, htmlNode, position);
    self.el = wrapperNode;
  };

  Html.prototype._setDomPosition = function _setDomPosition(parentDom, childDom, point) {
    var self = this;
    var alignX = self.alignX;
    var alignY = self.alignY;
    var domWidth = DomUtil.getOuterWidth(childDom);
    var domHeight = DomUtil.getOuterHeight(childDom);

    var position = {
      x: point.x,
      y: point.y
    };

    if (alignX === 'middle' && alignY === 'top') {
      position.x -= Math.round(domWidth / 2);
    } else if (alignX === 'middle' && alignY === 'bottom') {
      position.x -= Math.round(domWidth / 2);
      position.y -= Math.round(domHeight);
    } else if (alignX === 'left' && alignY === 'bottom') {
      position.y -= Math.round(domHeight);
    } else if (alignX === 'left' && alignY === 'middle') {
      position.y -= Math.round(domHeight / 2);
    } else if (alignX === 'left' && alignY === 'top') {
      position.x = point.x;
      position.y = point.y;
    } else if (alignX === 'right' && alignY === 'bottom') {
      position.x -= Math.round(domWidth);
      position.y -= Math.round(domHeight);
    } else if (alignX === 'right' && alignY === 'middle') {
      position.x -= Math.round(domWidth);
      position.y -= Math.round(domHeight / 2);
    } else if (alignX === 'right' && alignY === 'top') {
      position.x -= Math.round(domWidth);
    } else {
      // 默认位于中心点
      position.x -= Math.round(domWidth / 2);
      position.y -= Math.round(domHeight / 2);
    }

    if (self.offsetX) {
      position.x += self.offsetX;
    }

    if (self.offsetY) {
      position.y += self.offsetY;
    }

    DomUtil.modifyCSS(parentDom, {
      position: 'absolute',
      top: Math.round(position.y) + 'px',
      left: Math.round(position.x) + 'px',
      visibility: 'visible',
      zIndex: self.zIndex
    });
  };

  Html.prototype.remove = function remove() {
    var self = this;
    var el = self.el;
    if (el) {
      el.parentNode.removeChild(el);
    }
  };

  return Html;
}(Base);

module.exports = Html;