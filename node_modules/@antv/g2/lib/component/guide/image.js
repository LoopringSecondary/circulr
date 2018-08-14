function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the image guide
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');

var Image = function (_Base) {
  _inherits(Image, _Base);

  function Image() {
    _classCallCheck(this, Image);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Image.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      type: 'image',
      zIndex: 1,
      /**
       * 辅助图片的起点位置
       * @type {Object | Function | Array}
       */
      start: null,
      /**
       * 辅助图片的终点位置
       * @type {Object | Function | Array}
       */
      end: null,
      /**
       * 辅助图片的地址
       * @type {Strinf}
       */
      src: null,
      /**
       * x 方向的偏移量
       * @type {Number}
       */
      offsetX: null,
      /**
       * y 方向的偏移量
       * @type {Number}
       */
      offsetY: null
    });
  };

  Image.prototype.render = function render(coord, group) {
    var self = this;
    var start = self.parsePoint(coord, self.start);

    var cfg = {
      x: start.x,
      y: start.y
    };
    cfg.img = self.src;

    if (!self.end) {
      // 如果咩有指定结束点，则 start 为图片的左上角坐标
      if (self.width) {
        cfg.width = self.width;
      }

      if (self.height) {
        cfg.height = self.height;
      }
    } else {
      var end = self.parsePoint(coord, self.end);
      // cfg.width = Math.abs(end.x - start.x);
      // cfg.height = Math.abs(start.y - end.y);
      cfg.width = end.x - start.x;
      cfg.height = end.y - start.y;
    }

    if (self.offsetX) {
      cfg.x += self.offsetX;
    }

    if (self.offsetY) {
      cfg.y += self.offsetY;
    }

    var imgGuide = group.addShape('Image', {
      zIndex: 1,
      attrs: cfg
    });
    imgGuide.name = 'guide-image';
    self.appendInfo && imgGuide.setSilent('appendInfo', self.appendInfo);
    self.el = imgGuide;
  };

  return Image;
}(Base);

module.exports = Image;