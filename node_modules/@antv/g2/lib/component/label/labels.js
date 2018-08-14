function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The Label class
 * @author sima.zhang
 */
var Util = require('../../util');
var Group = require('../../renderer').Group;
var DomUtil = Util.DomUtil;

var Labels = function (_Group) {
  _inherits(Labels, _Group);

  function Labels() {
    _classCallCheck(this, Labels);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  Labels.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      zIndex: 6,
      /**
       * 显示的文本集合
       * @type {Array}
       */
      items: null,
      /**
       * 文本样式
       * @type {(Object|Function)}
       */
      textStyle: null,
      /**
       * 文本显示格式化回调函数
       * @type {Function}
       */
      formatter: null,
      /**
       * 使用 html 渲染文本
       * @type {(String|Function)}
      */
      htmlTemplate: null,
      /**
       * html 渲染时用的容器的模板，必须存在 class = "g-labels"
       * @type {String}
       */
      _containerTpl: '<div class="g-labels" style="position:absolute;top:0;left:0;"></div>',
      /**
       * html 渲染时单个 label 的模板，必须存在 class = "g-label"，如果 htmlTemplate 为字符串，则使用 htmlTemplate
       * @type {String}
       */
      _itemTpl: '<div class="g-label" style="position:absolute;">{text}</div>'
    };
  };

  Labels.prototype._renderUI = function _renderUI() {
    this._drawLabels();
  };

  Labels.prototype._drawLabels = function _drawLabels() {
    var self = this;
    var items = self.get('items');
    Util.each(items, function (item, index) {
      self._addLabel(item, index);
    });
  };

  Labels.prototype._addLabel = function _addLabel(item, index) {
    var cfg = this._getLabelCfg(item, index);
    return this._createText(cfg);
  };

  Labels.prototype._getLabelCfg = function _getLabelCfg(item, index) {
    var textStyle = this.get('textStyle') || {};
    var formatter = this.get('formatter');
    var htmlTemplate = this.get('htmlTemplate');

    if (!Util.isObject(item)) {
      var tmp = item;
      item = {};
      item.text = tmp;
    }

    if (Util.isFunction(textStyle)) {
      textStyle = textStyle(item.text, item, index);
    }

    if (formatter) {
      item.text = formatter(item.text, item, index);
    }

    if (Util.isFunction(htmlTemplate)) {
      item.text = htmlTemplate(item.text, item, index);
    }

    if (Util.isNil(item.text)) {
      item.text = '';
    }

    item.text = item.text + ''; // ? 为什么转换为字符串

    var cfg = Util.mix({}, item, textStyle, {
      x: item.x || 0,
      y: item.y || 0
    });

    return cfg;
  };

  Labels.prototype._createText = function _createText(cfg) {
    var htmlTemplate = this.get('htmlTemplate');
    var customDiv = this.get('customDiv');
    var labelShape = void 0;

    if (htmlTemplate) {
      if (!customDiv) {
        var containerTpl = this.get('_containerTpl');
        var wrapper = this.get('canvas').get('el').parentNode;
        customDiv = DomUtil.createDom(containerTpl);
        wrapper.style.position = 'relative';
        wrapper.appendChild(customDiv);
        this.set('customDiv', customDiv);
      }

      var node = this._createDom(cfg);
      customDiv.appendChild(node);
      this._setCustomPosition(cfg, node);
    } else {
      var origin = cfg.point;
      delete cfg.point; // 临时解决，否则影响动画
      labelShape = this.addShape('text', {
        attrs: cfg
      });
      labelShape.setSilent('origin', origin);
      labelShape.name = 'label'; // 用于事件标注
      this.get('appendInfo') && labelShape.setSilent('appendInfo', this.get('appendInfo'));
      return labelShape;
    }
  };

  Labels.prototype._setCustomPosition = function _setCustomPosition(cfg, htmlDom) {
    var textAlign = cfg.textAlign || 'left';
    var top = cfg.y;
    var left = cfg.x;
    var width = DomUtil.getOuterWidth(htmlDom);
    var height = DomUtil.getOuterHeight(htmlDom);

    top = top - height / 2;
    if (textAlign === 'center') {
      left = left - width / 2;
    } else if (textAlign === 'right') {
      left = left - width;
    }

    htmlDom.style.top = parseInt(top, 10) + 'px';
    htmlDom.style.left = parseInt(left, 10) + 'px';
  };

  Labels.prototype._createDom = function _createDom(cfg) {
    var itemTpl = this.get('_itemTpl');
    var htmlTemplate = this.get('htmlTemplate');

    if (Util.isString(htmlTemplate)) {
      cfg.text = Util.substitute(htmlTemplate, { text: cfg.text });
    }

    var str = Util.substitute(itemTpl, { text: cfg.text });

    return DomUtil.createDom(str);
  };

  Labels.prototype.getLabels = function getLabels() {
    var customDiv = this.get('customDiv');
    if (customDiv) {
      return Util.toArray(customDiv.childNodes);
    }
    return this.get('children');
  };

  Labels.prototype.addLabel = function addLabel(item) {
    var items = this.get('items');
    var count = items.length;
    items.push(item);
    return this._addLabel(item, count);
  };

  Labels.prototype.changeLabel = function changeLabel(oldLabel, newLabel) {
    if (!oldLabel) {
      return;
    }
    var htmlTemplate = this.get('htmlTemplate');
    var index = Util.indexOf(this.getLabels(), oldLabel);
    var cfg = this._getLabelCfg(newLabel, index);
    if (htmlTemplate) {
      var node = this._createDom(cfg);
      oldLabel.innerHTML = node.innerHTML;
      this._setCustomPosition(cfg, oldLabel);
    } else {
      oldLabel._id = newLabel._id;
      oldLabel.attr('text', cfg.text);
      if (oldLabel.attr('x') !== cfg.x || oldLabel.attr('y') !== cfg.y) {
        var rotate = oldLabel.get('attrs').rotate;
        if (rotate) {
          oldLabel.rotateAtStart(-rotate);
          oldLabel.attr(cfg);
          oldLabel.rotateAtStart(rotate);
        } else {
          oldLabel.attr(cfg);
        }
      }
    }
  };

  Labels.prototype.clear = function clear() {
    var customDiv = this.get('customDiv');
    if (customDiv) {
      customDiv.innerHTML = '';
    }
    _Group.prototype.clear.call(this);
  };

  Labels.prototype.setItems = function setItems(items) {
    this.clear();
    this.set('items', items);
    this._drawLabels();
  };

  Labels.prototype.remove = function remove() {
    var customDiv = this.get('customDiv');
    if (customDiv) {
      customDiv.parentNode.removeChild(customDiv);
    }
    _Group.prototype.remove.call(this);
  };

  return Labels;
}(Group);

module.exports = Labels;