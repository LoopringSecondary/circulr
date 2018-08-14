function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the radius axis of polar coordinate and axis of cartesian coordinate
 * @author sima.zhang
 */
var Base = require('./base');
var Util = require('../../util');
var MatrixUtil = Util.MatrixUtil;
var vec2 = MatrixUtil.vec2;

var Line = function (_Base) {
  _inherits(Line, _Base);

  function Line() {
    _classCallCheck(this, Line);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Line.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      x: null, // @type {Number} 距离初始位置的x轴偏移量,仅对于左侧、右侧的纵向坐标有效
      y: null, // @type {Number} 距离初始位置的y轴偏移量，仅对顶部、底部的横向坐标轴有效
      line: { // @type {Attrs} 坐标轴线的图形属性,如果设置成null，则不显示轴线
        lineWidth: 1,
        stroke: '#C0D0E0'
      },
      tickLine: { // @type {Attrs} 标注坐标线的图形属性
        lineWidth: 1,
        stroke: '#C0D0E0',
        length: 5
      },
      isVertical: false,
      start: null, // @type {Object} 起点
      end: null // @type {Object} 终点
    });
  };

  Line.prototype._getAvgLabelLength = function _getAvgLabelLength(labelsGroup) {
    var labels = labelsGroup.get('children');
    return labels[1].attr('x') - labels[0].attr('x');
  };

  /**
   * 获取距离坐标轴的向量
   * @override
   * @param  {Number} offset 偏移值
   * @return {Array}        返回二维向量
   */


  Line.prototype.getSideVector = function getSideVector(offset) {
    var self = this;
    var factor = self.get('factor');
    var isVertical = self.get('isVertical');
    var start = self.get('start');
    var end = self.get('end');
    var axisVector = self.getAxisVector();
    var normal = vec2.normalize([], axisVector);
    var direction = false;
    if (isVertical && start.y < end.y || !isVertical && start.x > end.x) {
      direction = true;
    }
    var verticalVector = vec2.vertical([], normal, direction);
    return vec2.scale([], verticalVector, offset * factor);
  };

  Line.prototype.getAxisVector = function getAxisVector() {
    var start = this.get('start');
    var end = this.get('end');
    return [end.x - start.x, end.y - start.y];
  };

  Line.prototype.getLinePath = function getLinePath() {
    var self = this;
    var start = self.get('start');
    var end = self.get('end');
    var path = [];
    path.push(['M', start.x, start.y]);
    path.push(['L', end.x, end.y]);
    return path;
  };

  Line.prototype.getTickEnd = function getTickEnd(start, value) {
    var self = this;
    var offsetVector = self.getSideVector(value);
    return {
      x: start.x + offsetVector[0],
      y: start.y + offsetVector[1]
    };
  };

  Line.prototype.getTickPoint = function getTickPoint(tickValue) {
    var self = this;
    var start = self.get('start');
    var end = self.get('end');
    var rangeX = end.x - start.x;
    var rangeY = end.y - start.y;
    return {
      x: start.x + rangeX * tickValue,
      y: start.y + rangeY * tickValue
    };
  };

  Line.prototype.renderTitle = function renderTitle() {
    var self = this;
    var title = self.get('title');
    var offsetPoint = self.getTickPoint(0.5);
    var titleOffset = title.offset;
    if (Util.isNil(titleOffset)) {
      // 没有指定 offset 则自动计算
      titleOffset = 20;
      var labelsGroup = self.get('labelsGroup');
      if (labelsGroup) {
        var labelLength = self.getMaxLabelWidth(labelsGroup);
        var labelOffset = self.get('label').offset || self.get('_labelOffset');
        titleOffset += labelLength + labelOffset;
      }
    }

    var textStyle = title.textStyle;
    var cfg = Util.mix({}, textStyle);
    if (title.text) {
      var vector = self.getAxisVector(); // 坐标轴方向的向量
      if (title.autoRotate && Util.isNil(textStyle.rotate)) {
        // 自动旋转并且用户没有指定标题的旋转角度
        var angle = 0;
        if (!Util.snapEqual(vector[1], 0)) {
          // 所有水平坐标轴，文本不转置
          var v1 = [1, 0];
          var v2 = [vector[0], vector[1]];
          angle = vec2.angleTo(v2, v1, true);
        }

        cfg.rotate = angle * (180 / Math.PI);
      } else if (!Util.isNil(textStyle.rotate)) {
        // 用户设置了旋转角度就以用户设置的为准
        cfg.rotate = textStyle.rotate / 180 * Math.PI; // 将角度转换为弧度
      }

      var sideVector = self.getSideVector(titleOffset);
      var point = void 0;
      var position = title.position;
      if (position === 'start') {
        point = {
          x: this.get('start').x + sideVector[0],
          y: this.get('start').y + sideVector[1]
        };
      } else if (position === 'end') {
        point = {
          x: this.get('end').x + sideVector[0],
          y: this.get('end').y + sideVector[1]
        };
      } else {
        point = {
          x: offsetPoint.x + sideVector[0],
          y: offsetPoint.y + sideVector[1]
        };
      }

      cfg.x = point.x;
      cfg.y = point.y;
      cfg.text = title.text;

      var titleShape = self.addShape('Text', {
        zIndex: 2,
        attrs: cfg
      });
      titleShape.name = 'axis-title';
      self.get('appendInfo') && titleShape.setSilent('appendInfo', self.get('appendInfo'));
    }
  };

  Line.prototype.autoRotateLabels = function autoRotateLabels() {
    var self = this;
    var labelsGroup = self.get('labelsGroup');
    var title = self.get('title');
    if (labelsGroup) {
      var offset = self.get('label').offset;
      var append = 12;
      var titleOffset = title ? title.offset : 48;
      if (titleOffset < 0) {
        // 如果是负的的话就不旋转
        return;
      }
      var vector = self.getAxisVector(); // 坐标轴的向量，仅处理水平或者垂直的场景
      var angle = void 0;
      var maxWidth = void 0;
      if (Util.snapEqual(vector[0], 0) && title && title.text) {
        // 坐标轴垂直，由于不知道边距，只能防止跟title重合，如果title不存在，则不自动旋转
        maxWidth = self.getMaxLabelWidth(labelsGroup);
        if (maxWidth > titleOffset - offset - append) {
          angle = Math.acos((titleOffset - offset - append) / maxWidth) * -1;
        }
      } else if (Util.snapEqual(vector[1], 0) && labelsGroup.getCount() > 1) {
        // 坐标轴水平，不考虑边距，根据最长的和平均值进行翻转
        var avgWidth = Math.abs(self._getAvgLabelLength(labelsGroup));
        maxWidth = self.getMaxLabelWidth(labelsGroup);
        if (maxWidth > avgWidth) {
          angle = Math.asin((titleOffset - offset - append) * 1.25 / maxWidth);
        }
      }

      if (angle) {
        var factor = self.get('factor');
        Util.each(labelsGroup.get('children'), function (label) {
          label.rotateAtStart(angle);
          if (Util.snapEqual(vector[1], 0)) {
            if (factor > 0) {
              label.attr('textAlign', 'left');
            } else {
              label.attr('textAlign', 'right');
            }
          }
        });
      }
    }
  };

  return Line;
}(Base);

module.exports = Line;