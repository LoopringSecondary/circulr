function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the line guide
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');
var vec2 = Util.MatrixUtil.vec2;

var Line = function (_Base) {
  _inherits(Line, _Base);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Line.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      type: 'line',
      /**
       * 辅助线的起点位置
       * @type {Object | Function | Array}
       */
      start: null,
      /**
       * 辅助线的终点位置
       * @type {Object | Function | Array}
       */
      end: null,
      /**
       * 辅助线的图形样式
       * @type {Object}
       */
      lineStyle: {
        stroke: '#000',
        lineWidth: 1
      },
      /**
       * 辅助文本配置
       * @type {Object}
       */
      text: {
        position: 'end', // 文本的显示位置： start / center / end / 百分比
        autoRotate: true, // 文本是否沿着辅助线的方向自动旋转
        style: {
          fill: '#999',
          fontSize: 12,
          fontWeight: 500,
          fontFamily: 'sans-serif'
        }, // 辅助文本的样式
        content: null // 辅助文本的文字
      }
    });
  };

  Line.prototype.render = function render(coord, group) {
    var self = this;
    var start = self.parsePoint(coord, self.start);
    var end = self.parsePoint(coord, self.end);
    var guideLineGroup = group.addGroup();

    self._drawLines(start, end, guideLineGroup);
    if (this.text && this.text.content) {
      self._drawText(start, end, guideLineGroup);
    }
    self.el = guideLineGroup;
  };

  Line.prototype._drawLines = function _drawLines(start, end, group) {
    var path = [['M', start.x, start.y], ['L', end.x, end.y]];
    var guideLine = group.addShape('Path', {
      attrs: Util.mix({
        path: path
      }, this.lineStyle)
    });
    guideLine.name = 'guide-line';
    this.appendInfo && guideLine.setSilent('appendInfo', this.appendInfo);
  };

  Line.prototype._drawText = function _drawText(start, end, group) {
    var textCfg = this.text;
    var position = textCfg.position;
    var textStyle = textCfg.style;

    var percent = void 0;
    if (position === 'start') {
      percent = 0;
    } else if (position === 'center') {
      percent = 0.5;
    } else if (Util.isString(position) && position.indexOf('%') !== -1) {
      percent = parseInt(position, 10) / 100;
    } else if (Util.isNumber(position)) {
      percent = position;
    } else {
      percent = 1;
    }

    if (percent > 1 || percent < 0) {
      percent = 1;
    }

    var cfg = {
      x: start.x + (end.x - start.x) * percent,
      y: start.y + (end.y - start.y) * percent
    };

    if (textCfg.offsetX) {
      // 设置了偏移量
      cfg.x += textCfg.offsetX;
    }

    if (textCfg.offsetY) {
      // 设置了偏移量
      cfg.y += textCfg.offsetY;
    }

    cfg.text = textCfg.content;
    cfg = Util.mix({}, cfg, textStyle);
    if (textCfg.autoRotate && Util.isNil(textStyle.rotate)) {
      // 自动旋转且用户没有设置旋转角度
      var angle = vec2.angleTo([end.x - start.x, end.y - start.y], [1, 0], 1);
      cfg.rotate = angle;
    } else if (!Util.isNil(textStyle.rotate)) {
      // 用户设置了旋转角度
      cfg.rotate = textStyle.rotate * Math.PI / 180;
    }

    var shape = group.addShape('Text', {
      attrs: cfg
    });
    shape.name = 'guide-line-text';
    this.appendInfo && shape.setSilent('appendInfo', this.appendInfo);
  };

  return Line;
}(Base);

module.exports = Line;