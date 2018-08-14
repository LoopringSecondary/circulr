function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the helix axis of helix coordinate
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');
var MatrixUtil = Util.MatrixUtil,
    PathUtil = Util.PathUtil;

var vec2 = MatrixUtil.vec2;

var Helix = function (_Base) {
  _inherits(Helix, _Base);

  function Helix() {
    _classCallCheck(this, Helix);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Helix.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      type: 'helix',
      line: { // @type {Attrs} 坐标轴线的图形属性,如果设置成null，则不显示轴线
        lineWidth: 1,
        stroke: '#C0D0E0'
      },
      tickLine: { // @type {Attrs} 标注坐标线的图形属性
        lineWidth: 1,
        stroke: '#C0D0E0',
        length: 5
      },
      startAngle: 1.25 * Math.PI,
      endAngle: 7.25 * Math.PI,
      // 螺旋系数
      a: 0,
      // 画布中心坐标
      center: null,
      // 坐标轴绘制起点
      axisStart: null,
      // 坐标轴的n个坐标点
      crp: []
    });
  };

  Helix.prototype.getLinePath = function getLinePath() {
    var self = this;
    var crp = self.get('crp');
    var axisStart = self.get('axisStart');
    var path = PathUtil.catmullRomToBezier(crp);
    path.unshift(['M', axisStart.x, axisStart.y]);
    return path;
  };

  Helix.prototype.getTickPoint = function getTickPoint(value) {
    var self = this;
    var startAngle = self.get('startAngle');
    var endAngle = self.get('endAngle');
    var angle = startAngle + (endAngle - startAngle) * value;
    return self._getHelixPoint(angle);
  };

  Helix.prototype._getHelixPoint = function _getHelixPoint(angle) {
    var self = this;
    var center = self.get('center');
    var a = self.get('a'); // 螺线系数
    var radius = a * angle + self.get('inner'); // 螺线方程
    return {
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius
    };
  };

  Helix.prototype.getSideVector = function getSideVector(offset, point) {
    var self = this;
    var center = self.get('center');
    var vector = [point.x - center.x, point.y - center.y];
    if (offset) {
      var vecLen = vec2.length(vector);
      vec2.scale(vector, vector, offset / vecLen);
    }
    return vector;
  };

  Helix.prototype.getSidePoint = function getSidePoint(point, offset) {
    var self = this;
    var vector = self.getSideVector(offset, point);

    return {
      x: point.x + vector[0],
      y: point.y + vector[1]
    };
  };

  Helix.prototype.getTickEnd = function getTickEnd(start, length) {
    var self = this;
    var tickLine = self.get('tickLine');
    length = length ? length : tickLine.length;
    return self.getSidePoint(start, length);
  };

  return Helix;
}(Base);

module.exports = Helix;