function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the arc guide
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');

function calculateAngle(point, center) {
  var x = point.x - center.x;
  var y = point.y - center.y;
  var deg = void 0;
  if (y === 0) {
    if (x < 0) {
      deg = Math.PI / 2;
    } else {
      deg = 270 * Math.PI / 180;
    }
  } else if (x >= 0 && y > 0) {
    deg = Math.PI * 2 - Math.atan(x / y);
  } else if (x <= 0 && y < 0) {
    deg = Math.PI - Math.atan(x / y);
  } else if (x > 0 && y < 0) {
    deg = Math.PI + Math.atan(-x / y);
  } else if (x < 0 && y > 0) {
    deg = Math.atan(x / -y);
  }
  return deg;
}

var Arc = function (_Base) {
  _inherits(Arc, _Base);

  function Arc() {
    _classCallCheck(this, Arc);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Arc.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      /**
       * 辅助元素类型
       * @type {String}
       */
      type: 'arc',
      /**
       * 辅助弧线的起始点
       * @type {Object | Function | Array}
       */
      start: null,
      /**
       * 辅助弧线的终止点
       * @type {Object | Function | Array}
       */
      end: null,
      /**
       * 辅助文本的样式配置
       * @type {Object}
       */
      style: {
        stroke: '#999',
        lineWidth: 1
      }
    });
  };

  Arc.prototype.render = function render(coord, group) {
    var self = this;
    var start = self.parsePoint(coord, self.start);
    var end = self.parsePoint(coord, self.end);
    var coordCenter = coord.getCenter();
    var radius = Math.sqrt((start.x - coordCenter.x) * (start.x - coordCenter.x) + (start.y - coordCenter.y) * (start.y - coordCenter.y));
    var startAngle = calculateAngle(start, coordCenter);
    var endAngle = calculateAngle(end, coordCenter);
    var dAngle = (endAngle - startAngle) % (Math.PI * 2);
    var largeArc = dAngle > Math.PI ? 1 : 0;
    var clockwise = endAngle - startAngle >= 0 ? 1 : 0;
    var arcShape = group.addShape('path', {
      zIndex: self.zIndex,
      attrs: Util.mix({
        path: [['M', start.x, start.y], ['A', radius, radius, startAngle, largeArc, clockwise, end.x, end.y]]
      }, self.style)
    });
    arcShape.name = 'guide-arc';
    self.appendInfo && arcShape.setSilent('appendInfo', self.appendInfo);
    self.el = arcShape;
  };

  return Arc;
}(Base);

module.exports = Arc;