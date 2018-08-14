function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the text guide
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');

var Text = function (_Base) {
  _inherits(Text, _Base);

  function Text() {
    _classCallCheck(this, Text);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Text.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      type: 'text',
      /**
       * 辅助文本的位置
       * @type {Object | Function | Array}
       */
      position: null,
      /**
       * 辅助文本的显示文字
       * @type {String}
       */
      content: null,
      /**
       * 辅助文本的样式配置
       * @type {Object}
       */
      style: {
        fill: '#999',
        fontSize: 12,
        fontWeight: 500,
        textAlign: 'center'
      },
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
      top: true
    });
  };

  Text.prototype.render = function render(coord, group) {
    var self = this;
    var position = self.position;
    var point = self.parsePoint(coord, position);
    var textStyle = Util.mix({}, this.style);
    if (self.offsetX) {
      point.x += self.offsetX;
    }

    if (self.offsetY) {
      point.y += self.offsetY;
    }

    if (textStyle.rotate) {
      textStyle.rotate = textStyle.rotate * Math.PI / 180; // 将角度转换为弧度
    }

    var guideText = group.addShape('Text', {
      zIndex: self.zIndex,
      attrs: Util.mix({
        text: self.content
      }, textStyle, point)
    });
    guideText.name = 'guide-text';
    self.appendInfo && guideText.setSilent('appendInfo', self.appendInfo);
    self.el = guideText;
  };

  return Text;
}(Base);

module.exports = Text;