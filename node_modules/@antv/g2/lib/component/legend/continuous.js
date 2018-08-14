function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The base class of continuous legend
 * @author sima.zhang
 */
var Util = require('../../util');
var Global = require('../../global');
var Base = require('./base');

var _require = require('../../renderer'),
    Event = _require.Event,
    Group = _require.Group;

var Slider = require('./slider');
var TRIGGER_WIDTH = 12;

var Continuous = function (_Base) {
  _inherits(Continuous, _Base);

  function Continuous() {
    _classCallCheck(this, Continuous);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Continuous.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 类型
       * @type {String}
       */
      type: 'continuous-legend',
      /**
       * 子项
       * @type {Array}
       */
      items: null,
      /**
       * 布局方式
       * horizontal 水平
       * vertical 垂直
       * @type {String}
       */
      layout: 'vertical',
      /**
       * 宽度
       * @type {Number}
       */
      width: 156,
      /**
       * 高度
       * @type {Number}
       */
      height: 20,
      /**
       * 标题偏移量
       * @type {Number}
       */
      titleGap: 22,
      /**
       * 默认文本图形属性
       * @type {ATTRS}
       */
      textStyle: {
        fill: '#333',
        textAlign: 'center',
        textBaseline: 'middle',
        fontFamily: Global.fontFamily
      },
      /**
       * 连续图例是否可滑动
       * @type {Boolean}
       */
      slidable: true,
      /**
       * 范围内颜色
       * @type {ATTRS}
       */
      inRange: {
        fill: '#4E7CCC'
      },
      _range: [0, 100],
      /**
       * 中滑块属性
       * @type {ATTRS}
       */
      middleAttr: {
        fill: '#fff',
        fillOpacity: 0
      },
      outRangeStyle: {
        fill: '#D9D9D9'
      },
      numberFormatter: null, // 如果数字已经有格式化函数，从外部传入
      labelOffset: 10 // ToDO: 文本同渐变背景的距离
    });
  };

  Continuous.prototype._calStartPoint = function _calStartPoint() {
    var start = {
      x: 0,
      y: this.get('titleGap') - TRIGGER_WIDTH
    };
    var titleShape = this.get('titleShape');
    if (titleShape) {
      var titleBox = titleShape.getBBox();
      start.y += titleBox.height;
    }

    return start;
  };

  Continuous.prototype._beforeRenderUI = function _beforeRenderUI() {
    var items = this.get('items');
    if (!Util.isArray(items) || Util.isEmpty(items)) {
      return;
    }

    _Base.prototype._beforeRenderUI.call(this);
    this.set('firstItem', items[0]);
    this.set('lastItem', items[items.length - 1]);
  };

  Continuous.prototype._formatItemValue = function _formatItemValue(value) {
    var numberFormatter = this.get('numberFormatter');
    if (numberFormatter) {
      value = numberFormatter(value);
    }
    var formatter = this.get('itemFormatter');
    if (formatter) {
      value = formatter.call(this, value);
    }
    return value;
  };

  Continuous.prototype._renderUI = function _renderUI() {
    _Base.prototype._renderUI.call(this);

    if (this.get('slidable')) {
      this._renderSlider();
    } else {
      this._renderBackground();
    }
  };

  Continuous.prototype._renderSlider = function _renderSlider() {
    var minHandleElement = new Group();
    var maxHandleElement = new Group();
    var backgroundElement = new Group();
    var start = this._calStartPoint();
    var slider = this.addGroup(Slider, {
      minHandleElement: minHandleElement,
      maxHandleElement: maxHandleElement,
      backgroundElement: backgroundElement,
      middleAttr: this.get('middleAttr'),
      layout: this.get('layout'),
      range: this.get('_range'),
      width: this.get('width'),
      height: this.get('height')
    });
    slider.translate(start.x, start.y);
    this.set('slider', slider);

    var shape = this._renderSliderShape();
    shape.attr('clip', slider.get('middleHandleElement'));
    this._renderTrigger();
  };

  Continuous.prototype._addBackground = function _addBackground(parent, name, attrs) {
    parent.addShape(name, {
      attrs: Util.mix({}, attrs, this.get('outRangeStyle'))
    });
    return parent.addShape(name, {
      attrs: attrs
    });
  };

  Continuous.prototype._renderTrigger = function _renderTrigger() {
    var min = this.get('firstItem');
    var max = this.get('lastItem');
    var layout = this.get('layout');
    var textStyle = this.get('textStyle');
    var inRange = this.get('inRange');
    var attrType = this.get('type');
    var minBlockAttr = void 0;
    var maxBlockAttr = void 0;

    if (attrType === 'color-legend') {
      minBlockAttr = {
        fill: min.attrValue
      };
      maxBlockAttr = {
        fill: max.attrValue
      };
    } else {
      minBlockAttr = Util.mix({}, inRange);
      maxBlockAttr = Util.mix({}, inRange);
    }
    var minTextAttr = Util.mix({
      text: this._formatItemValue(min.value) + ''
    }, textStyle);
    var maxTextAttr = Util.mix({
      text: this._formatItemValue(max.value) + ''
    }, textStyle);
    if (layout === 'vertical') {
      this._addVerticalTrigger('min', minBlockAttr, minTextAttr);
      this._addVerticalTrigger('max', maxBlockAttr, maxTextAttr);
    } else {
      this._addHorizontalTrigger('min', minBlockAttr, minTextAttr);
      this._addHorizontalTrigger('max', maxBlockAttr, maxTextAttr);
    }
  };

  Continuous.prototype._addVerticalTrigger = function _addVerticalTrigger(type, blockAttr, textAttr) {
    var slider = this.get('slider');
    var trigger = slider.get(type + 'HandleElement');
    var width = this.get('width');
    var button = trigger.addShape('polygon', {
      attrs: Util.mix({
        points: [[width / 2 + TRIGGER_WIDTH, 0], [width / 2 + 1, 0], [width / 2 + TRIGGER_WIDTH, type === 'min' ? TRIGGER_WIDTH : -TRIGGER_WIDTH]]
      }, blockAttr)
    });
    var text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: width + 8,
        y: type === 'max' ? -4 : 4,
        textAlign: 'start',
        lineHeight: 1,
        textBaseline: 'middle'
      })
    });
    var layout = this.get('layout');
    var trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  };

  Continuous.prototype._addHorizontalTrigger = function _addHorizontalTrigger(type, blockAttr, textAttr) {
    var slider = this.get('slider');
    var trigger = slider.get(type + 'HandleElement');
    var button = trigger.addShape('polygon', {
      attrs: Util.mix({
        points: [[0, 0], [0, TRIGGER_WIDTH], [type === 'min' ? -TRIGGER_WIDTH : TRIGGER_WIDTH, TRIGGER_WIDTH]]
      }, blockAttr)
    });
    var text = trigger.addShape('text', {
      attrs: Util.mix(textAttr, {
        x: type === 'min' ? -TRIGGER_WIDTH - 4 : TRIGGER_WIDTH + 4,
        y: TRIGGER_WIDTH / 2,
        textAlign: type === 'min' ? 'end' : 'start',
        textBaseline: 'middle'
      })
    });
    var layout = this.get('layout');
    var trigerCursor = layout === 'vertical' ? 'ns-resize' : 'ew-resize';
    button.attr('cursor', trigerCursor);
    text.attr('cursor', trigerCursor);
    this.set(type + 'ButtonElement', button);
    this.set(type + 'TextElement', text);
  };

  Continuous.prototype._bindUI = function _bindUI() {
    var self = this;
    if (self.get('slidable')) {
      // const canvas = self.get('canvas');
      var slider = self.get('slider');
      slider.on('sliderchange', function (ev) {
        var range = ev.range;
        var firstItemValue = self.get('firstItem').value * 1;
        var lastItemValue = self.get('lastItem').value * 1;
        var minValue = firstItemValue + range[0] / 100 * (lastItemValue - firstItemValue);
        var maxValue = firstItemValue + range[1] / 100 * (lastItemValue - firstItemValue);
        self._updateElement(minValue, maxValue);
        var itemFiltered = new Event('itemfilter', ev, true, true);
        itemFiltered.range = [minValue, maxValue];
        self.emit('itemfilter', itemFiltered);
      });
    }
  };

  Continuous.prototype._updateElement = function _updateElement(min, max) {
    var minTextElement = this.get('minTextElement');
    var maxTextElement = this.get('maxTextElement');
    if (max > 1) {
      // 对于大于 1 的值，默认显示为整数
      min = parseInt(min, 10);
      max = parseInt(max, 10);
    }
    minTextElement.attr('text', this._formatItemValue(min) + '');
    maxTextElement.attr('text', this._formatItemValue(max) + '');
    if (this.get('type') === 'color-legend' && this.get('attr')) {
      var attr = this.get('attr'); // 图形属性，为了更新滑块颜色
      var minButtonElement = this.get('minButtonElement');
      var maxButtonElement = this.get('maxButtonElement');
      minButtonElement.attr('fill', attr.mapping(min).join(''));
      maxButtonElement.attr('fill', attr.mapping(max).join(''));
    }
  };

  return Continuous;
}(Base);

module.exports = Continuous;