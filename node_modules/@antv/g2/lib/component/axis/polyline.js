function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the axis of map coodinate
 * @author sima.zhang
 */
var Util = require('../../util');
var Base = require('./base');
var MatrixUtil = Util.MatrixUtil,
    PathUtil = Util.PathUtil;

var vec2 = MatrixUtil.vec2;

var Polyline = function (_Base) {
  _inherits(Polyline, _Base);

  function Polyline() {
    _classCallCheck(this, Polyline);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Polyline.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      type: 'polyline'
    });
  };

  Polyline.prototype.getLinePath = function getLinePath() {
    var self = this;
    var tickPoints = self.get('tickPoints');
    var start = self.get('start');
    var end = self.get('end');
    var points = [];
    points.push(start.x);
    points.push(start.y);
    Util.each(tickPoints, function (tick) {
      points.push(tick.x);
      points.push(tick.y);
    });
    points.push(end.x);
    points.push(end.y);

    var path = PathUtil.catmullRomToBezier(points);
    path.unshift(['M', start.x, start.y]);
    return path;
  };

  Polyline.prototype.getTickPoint = function getTickPoint(value, index) {
    var tickPoints = this.get('tickPoints');
    return tickPoints[index];
  };

  Polyline.prototype.getTickEnd = function getTickEnd(start, value, index) {
    var self = this;
    var lineAttrs = self.get('tickLine');
    var tickLength = value ? value : lineAttrs.length;
    var offsetVector = self.getSideVector(tickLength, start, index);
    return {
      x: start.x + offsetVector[0],
      y: start.y + offsetVector[1]
    };
  };

  Polyline.prototype.getSideVector = function getSideVector(offset, point, index) {
    var self = this;
    var preTickPoint = void 0;
    if (index === 0) {
      preTickPoint = self.get('start');
      if (preTickPoint.x === point.x && preTickPoint.y === point.y) {
        return [0, 0];
      }
    } else {
      var tickPoints = self.get('tickPoints');
      preTickPoint = tickPoints[index - 1];
    }

    var vector = [point.x - preTickPoint.x, point.y - preTickPoint.y];
    var normal = vec2.normalize([], vector);
    var verticalVector = vec2.vertical([], normal, false);
    return vec2.scale([], verticalVector, offset);
  };

  return Polyline;
}(Base);

module.exports = Polyline;