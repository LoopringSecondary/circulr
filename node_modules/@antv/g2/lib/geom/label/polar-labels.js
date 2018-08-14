function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Labels = require('./geom-labels');
var PathUtil = require('../util/path');
var Util = require('../../util');

var PolarLabels = function (_Labels) {
  _inherits(PolarLabels, _Labels);

  function PolarLabels() {
    _classCallCheck(this, PolarLabels);

    return _possibleConstructorReturn(this, _Labels.apply(this, arguments));
  }

  PolarLabels.prototype.getPointRauis = function getPointRauis(coord, point) {
    return PathUtil.getPointRadius(coord, point);
  };

  PolarLabels.prototype.getCirclePoint = function getCirclePoint(angle, offset, point) {
    var self = this;
    var coord = self.get('coord');
    var center = coord.getCenter();
    var labelEmit = self._isEmitLabels();
    var r = self.getPointRauis(coord, point);
    if (coord.isTransposed && r > offset && !labelEmit) {
      var appendAngle = Math.asin(offset / (2 * r));
      angle = angle + appendAngle * 2;
    } else {
      r = r + offset;
    }

    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle),
      angle: angle,
      r: r
    };
  };

  PolarLabels.prototype.getArcPoint = function getArcPoint(point, index) {
    var self = this;

    var outerPoint = void 0; // 圆弧上的中点
    // var coord = self.get('coord');
    index = index || 0;
    if (Util.isArray(point.x) || Util.isArray(point.y)) {
      outerPoint = {
        x: Util.isArray(point.x) ? point.x[index] : point.x,
        y: Util.isArray(point.y) ? point.y[index] : point.y
      };
    } else {
      outerPoint = point;
    }
    self.transLabelPoint(outerPoint);
    return outerPoint;
  };

  // 获取点所在的角度


  PolarLabels.prototype.getPointAngle = function getPointAngle(point) {
    var self = this;
    var coord = self.get('coord');
    return PathUtil.getPointAngle(coord, point);
  };

  // 获取中心的位置


  PolarLabels.prototype.getMiddlePoint = function getMiddlePoint(points) {
    var self = this;
    var coord = self.get('coord');
    var count = points.length;
    var middlePoint = {
      x: 0,
      y: 0
    };
    Util.each(points, function (point) {
      middlePoint.x += point.x;
      middlePoint.y += point.y;
    });
    middlePoint.x /= count;
    middlePoint.y /= count;

    middlePoint = coord.convert(middlePoint);
    return middlePoint;
  };

  // 是否居中


  PolarLabels.prototype._isToMiddle = function _isToMiddle(point) {
    return point.x.length > 2;
  };

  /**
   * @protected
   * 获取文本的位置信息
   * @param {Array} labels labels
   * @param {Object} point point
   * @param {Number} index index
   * @return {Object} point
   */


  PolarLabels.prototype.getLabelPoint = function getLabelPoint(labels, point, index) {
    var self = this;
    var text = labels[index];
    var factor = 1;
    var arcPoint = void 0;
    if (self._isToMiddle(point)) {
      arcPoint = self.getMiddlePoint(point.points);
    } else {
      if (labels.length === 1 && index === 0) {
        index = 1;
      } else if (index === 0) {
        factor = -1;
      }
      arcPoint = self.getArcPoint(point, index);
    }

    var offset = self.getDefaultOffset();
    offset = offset * factor;
    var middleAngle = self.getPointAngle(arcPoint);
    var labelPoint = self.getCirclePoint(middleAngle, offset, arcPoint);
    labelPoint.text = text;
    labelPoint.angle = middleAngle;
    labelPoint.color = point.color;

    labelPoint.rotate = self.getLabelRotate(middleAngle, offset, point);
    return labelPoint;
  };

  PolarLabels.prototype._isEmitLabels = function _isEmitLabels() {
    var labels = this.get('label');
    return labels.labelEmit;
  };

  /**
   * @protected
   * 获取文本旋转的方向
   * @param {Number} angle angle
   * @return {Number} angle
   */


  PolarLabels.prototype.getLabelRotate = function getLabelRotate(angle) {
    var self = this;
    var rotate = void 0;
    rotate = angle * 180 / Math.PI;
    rotate += 90;

    if (self._isEmitLabels()) {
      rotate -= 90;
    }
    if (rotate) {
      if (rotate > 90) {
        rotate = rotate - 180;
      } else if (rotate < -90) {
        rotate = rotate + 180;
      }
    }
    return rotate / 180 * Math.PI;
  };

  // override


  PolarLabels.prototype.getLabelAlign = function getLabelAlign(point) {
    var self = this;
    var coord = self.get('coord');
    var align = void 0;
    if (self._isEmitLabels()) {
      if (point.angle <= Math.PI / 2 && point.angle > -Math.PI / 2) {
        align = 'left';
      } else {
        align = 'right';
      }
    } else if (!coord.isTransposed) {
      align = 'center';
    } else {
      var center = coord.getCenter();
      var offset = self.getDefaultOffset();
      if (Math.abs(point.x - center.x) < 1) {
        align = 'center';
      } else if (point.angle > Math.PI || point.angle <= 0) {
        if (offset > 0) {
          align = 'left';
        } else {
          align = 'right';
        }
      } else {
        if (offset > 0) {
          align = 'right';
        } else {
          align = 'left';
        }
      }
    }
    return align;
  };

  return PolarLabels;
}(Labels);

module.exports = PolarLabels;