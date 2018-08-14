var Util = require('../../util/index');
var Shape = require('../core/shape');

var CText = function CText(cfg) {
  CText.superclass.constructor.call(this, cfg);
};

var BASELINE_MAP = {
  top: 'before-edge',
  middle: 'central',
  bottom: 'after-edge',
  alphabetic: 'baseline',
  hanging: 'hanging'
};

var ANCHOR_MAP = {
  left: 'left',
  start: 'left',
  center: 'middle',
  right: 'end',
  end: 'end'
};

CText.ATTRS = {
  x: 0,
  y: 0,
  text: null,
  fontSize: 12,
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontWeight: 'normal',
  fontVariant: 'normal',
  textAlign: 'start',
  textBaseline: 'bottom',
  lineHeight: null,
  textArr: null
};

Util.extend(CText, Shape);

Util.augment(CText, {
  canFill: true,
  canStroke: true,
  type: 'text',
  getDefaultAttrs: function getDefaultAttrs() {
    return {
      lineWidth: 1,
      lineCount: 1,
      fontSize: 12,
      fill: '#000',
      fontFamily: 'sans-serif',
      fontStyle: 'normal',
      fontWeight: 'normal',
      fontVariant: 'normal',
      textAlign: 'start',
      textBaseline: 'bottom'
    };
  },
  initTransform: function initTransform() {
    this.attr('matrix', [1, 0, 0, 0, 1, 0, 0, 0, 1]);
    var fontSize = this.__attrs.fontSize;
    if (fontSize && +fontSize < 12) {
      // 小于 12 像素的文本进行 scale 处理
      this.transform([['t', -1 * this.__attrs.x, -1 * this.__attrs.y], ['s', +fontSize / 12, +fontSize / 12], ['t', this.__attrs.x, this.__attrs.y]]);
    }
  },
  _assembleFont: function _assembleFont() {
    var el = this.get('el');
    var attrs = this.__attrs;
    var fontSize = attrs.fontSize;
    var fontFamily = attrs.fontFamily;
    var fontWeight = attrs.fontWeight;
    var fontStyle = attrs.fontStyle; // self.attr('fontStyle');
    var fontVariant = attrs.fontVariant; // self.attr('fontVariant');
    // self.attr('font', [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' '));
    var font = [fontStyle, fontVariant, fontWeight, fontSize + 'px', fontFamily].join(' ');
    attrs.font = font;
    el.setAttribute('font', attrs.font);
  },
  _afterSetAttrFontSize: function _afterSetAttrFontSize() {
    /* this.attr({
      height: this._getTextHeight()
    }); */
    this._assembleFont();
  },
  _afterSetAttrFontFamily: function _afterSetAttrFontFamily() {
    this._assembleFont();
  },
  _afterSetAttrFontWeight: function _afterSetAttrFontWeight() {
    this._assembleFont();
  },
  _afterSetAttrFontStyle: function _afterSetAttrFontStyle() {
    this._assembleFont();
  },
  _afterSetAttrFontVariant: function _afterSetAttrFontVariant() {
    this._assembleFont();
  },
  _afterSetAttrTextAlign: function _afterSetAttrTextAlign() {
    // 由于本身不支持设置direction，所以left = start, right = end。之后看是否需要根据direction判断
    var attr = this.__attrs.textAlign;
    var el = this.get('el');
    el.setAttribute('text-anchor', ANCHOR_MAP[attr]);
  },
  _afterSetAttrTextBaseLine: function _afterSetAttrTextBaseLine() {
    var attr = this.__attrs.textBaseline;
    this.get('el').setAttribute('alignment-baseline', BASELINE_MAP[attr] || 'baseline');
  },
  _afterSetAttrText: function _afterSetAttrText(text) {
    var attrs = this.__attrs;
    var textArr = void 0;
    if (Util.isString(text) && text.indexOf('\n') !== -1) {
      textArr = text.split('\n');
      var lineCount = textArr.length;
      attrs.lineCount = lineCount;
      attrs.textArr = textArr;
    }
    var el = this.get('el');
    if (~['undefined', 'null', 'NaN'].indexOf(String(text)) && el) {
      el.innerHTML = '';
    } else if (~text.indexOf('\n')) {
      textArr = text.split('\n');
      attrs.lineCount = textArr.length;
      attrs.textArr = textArr;
      var arr = '';
      Util.each(textArr, function (segment, i) {
        arr += '<tspan x="0" y="' + (i + 1) + 'em">' + segment + '</tspan>';
      });
      el.innerHTML = arr;
    } else {
      el.innerHTML = text;
    }
  },
  _afterSetAttrOutline: function _afterSetAttrOutline(val) {
    var el = this.get('el');
    if (!val) {
      el.setAttribute('paint-order', 'normal');
    }
    var stroke = val.stroke || '#000';
    var fill = val.fill || this.__attrs.stroke;
    var lineWidth = val.lineWidth || this.__attrs.lineWidth * 2;
    el.setAttribute('paint-order', 'stroke');
    el.setAttribute('style', 'stroke-linecap:butt; stroke-linejoin:miter;');
    el.setAttribute('stroke', stroke);
    el.setAttribute('fill', fill);
    el.setAttribute('stroke-width', lineWidth);
  },

  // 计算浪费，效率低，待优化
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    var self = this;
    if ('fontSize' in objs || 'fontWeight' in objs || 'fontStyle' in objs || 'fontVariant' in objs || 'fontFamily' in objs) {
      self._assembleFont();
    }
    if ('textAlign' in objs) {
      this._afterSetAttrTextAlign();
    }
    if ('textBaseline' in objs) {
      this._afterSetAttrTextBaseLine();
    }
    if ('text' in objs) {
      self._afterSetAttrText(objs.text);
    }
    if ('outline' in objs) {
      self._afterSetAttrOutline(objs.outline);
    }
  }
});

module.exports = CText;