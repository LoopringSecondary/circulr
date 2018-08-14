function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _require = require('../../renderer'),
    Group = _require.Group;

var Labels = require('../../component/label/index');
var Global = require('../../global');
var Util = require('../../util');
var IGNORE_ARR = ['line', 'point', 'path'];
var ORIGIN = '_origin';

function avg(arr) {
  var sum = 0;
  Util.each(arr, function (value) {
    sum += value;
  });
  return sum / arr.length;
}

var GeomLabels = function (_Group) {
  _inherits(GeomLabels, _Group);

  function GeomLabels() {
    _classCallCheck(this, GeomLabels);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  GeomLabels.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      label: Global.label,
      /**
       * 用户传入的文本配置信息
       * @type {Object}
       */
      labelCfg: null,
      /**
       * 所在的坐标系
       * @type {Object}
       */
      coord: null,
      /**
       * 图表的类型
       * @type {String}
       */
      geomType: null,
      zIndex: 6
    };
  };

  GeomLabels.prototype._renderUI = function _renderUI() {
    _Group.prototype._renderUI.call(this);
    this.initLabelsCfg();
    this.renderLabels(); // 调用入口文件
  };

  // 获取显示的 label 文本值


  GeomLabels.prototype._getLabelValue = function _getLabelValue(record) {
    var self = this;
    var originRecord = record[ORIGIN];
    var labelCfg = self.get('labelCfg');
    var scales = labelCfg.scales;
    var callback = labelCfg.cfg && labelCfg.cfg.content;
    var value = void 0;
    if (callback) {
      var params = [];
      Util.each(scales, function (scale) {
        params.push(originRecord[scale.field]);
      });
      value = callback.apply(null, params);
    } else {
      var scale = scales[0];
      value = originRecord[scale.field];
      if (Util.isArray(value)) {
        var tmp = [];
        Util.each(value, function (subVal) {
          tmp.push(scale.getText(subVal));
        });
        value = tmp;
      } else {
        value = scale.getText(value);
      }
    }
    return value;
  };

  // 初始化labels的配置项


  GeomLabels.prototype.initLabelsCfg = function initLabelsCfg() {
    var self = this;
    var labels = self.getDefaultLabelCfg();
    var labelCfg = self.get('labelCfg');
    // Util.merge(labels, labelCfg.cfg);
    Util.deepMix(labels, labelCfg.cfg);
    self.set('label', labels);
  };

  /**
   * @protected
   * 默认的文本样式
   * @return {Object} default label config
   */


  GeomLabels.prototype.getDefaultLabelCfg = function getDefaultLabelCfg() {
    var self = this;
    var labelCfg = self.get('labelCfg').cfg;
    var geomType = self.get('geomType');
    var viewTheme = self.get('viewTheme') || Global;
    if (geomType === 'polygon' || labelCfg && labelCfg.offset < 0 && Util.indexOf(IGNORE_ARR, geomType) === -1) {
      return Util.deepMix({}, self.get('label'), viewTheme.innerLabels);
    }
    return Util.deepMix({}, viewTheme.label, self.get('label'));
  };

  /**
   * @protected
   * 获取labels
   * @param {Array} points points
   * @return {Array} label items
   */


  GeomLabels.prototype.getLabelsItems = function getLabelsItems(points) {
    var self = this;
    var items = [];
    var labels = self.get('label');
    var geom = self.get('geom');
    var origin = void 0;

    // 获取label相关的x，y的值，获取具体的x,y,防止存在数组
    Util.each(points, function (point) {
      origin = point._origin;
      var label = self._getLabelValue(point);
      if (!Util.isArray(label)) {
        label = [label];
      }
      var total = label.length;

      Util.each(label, function (sub, subIdx) {
        var obj = self.getLabelPoint(label, point, subIdx);
        // 文本为 null, undefined, 空字符串时不显示
        // 但是文本为 0 时，需要显示
        if (obj && !Util.isNil(obj.text) && obj.text !== '') {
          obj = Util.mix({}, origin, obj); // 为了格式化输出
          var align = void 0;
          if (labels && labels.label && labels.label.textAlign) {
            align = labels.label.textAlign;
          } else {
            align = self.getLabelAlign(obj, subIdx, total);
          }
          obj.textAlign = align;
          if (geom) {
            obj._id = geom._getShapeId(origin) + '-glabel-' + subIdx + '-' + obj.text;
          }
          obj.coord = self.get('coord');
          items.push(obj);
        }
      });
    });
    return items;
  };

  /**
   * @protected
   * 如果发生冲突则会调整文本的位置
   * @param {Array} items 文本的集合
   * @return {Array} adjusted items
   */


  GeomLabels.prototype.adjustItems = function adjustItems(items) {
    return items;
  };

  /**
   * drawing lines to labels
   * @param  {Array} items labels
   * @param  {Object} labelLine configuration for label lines
   */


  GeomLabels.prototype.drawLines = function drawLines(items, labelLine) {
    var self = this;
    var offset = self.getDefaultOffset();
    if (offset > 0) {
      Util.each(items, function (point) {
        self.lineToLabel(point, labelLine);
      });
    }
  };

  // 连接线


  GeomLabels.prototype.lineToLabel = function lineToLabel(label, labelLine) {
    var self = this;
    var coord = self.get('coord');
    var start = {
      x: label.x - label._offset.x,
      y: label.y - label._offset.y
    };
    var inner = {
      x: (start.x + label.x) / 2,
      y: (start.y + label.y) / 2
    };
    var lineGroup = self.get('lineGroup');
    // var lineShape;
    if (!lineGroup) {
      lineGroup = self.addGroup({
        elCls: 'x-line-group'
      });
      self.set('lineGroup', lineGroup);
    }
    var lineShape = lineGroup.addShape('path', {
      attrs: Util.mix({
        path: ['M' + start.x, start.y + ' Q' + inner.x, inner.y + ' ' + label.x, label.y].join(','),
        fill: null,
        stroke: label.color
      }, labelLine)
    });
    // label 对应线的动画关闭
    lineShape.name = 'labelLine';
    // generate labelLine id according to label id
    lineShape._id = label._id && label._id.replace('glabel', 'glabelline');
    lineShape.set('coord', coord);
  };

  /**
   * @protected
   * 获取文本的位置信息
   * @param {Array} labels labels
   * @param {Object} point point
   * @param {Number} index index
   * @return {Object} point
   */


  GeomLabels.prototype.getLabelPoint = function getLabelPoint(labels, point, index) {
    var self = this;
    var coord = self.get('coord');

    function getDimValue(value, idx) {
      if (Util.isArray(value)) {
        if (labels.length === 1) {
          // 如果仅一个label,多个y,取最后一个y
          if (value.length <= 2) {
            value = value[value.length - 1];
            // value = value[0];
          } else {
            value = avg(value);
          }
        } else {
          value = value[idx];
        }
      }
      return value;
    }

    var labelPoint = {
      x: getDimValue(point.x, index),
      y: getDimValue(point.y, index),
      text: labels[index]
    };

    // get nearest point of the shape as the label line start point
    if (point && point.nextPoints && (point.shape === 'funnel' || point.shape === 'pyramid')) {
      var maxX = -Infinity;
      point.nextPoints.forEach(function (p) {
        p = coord.convert(p);
        if (p.x > maxX) {
          maxX = p.x;
        }
      });
      labelPoint.x = (labelPoint.x + maxX) / 2;
    }
    // sharp edge of the pyramid
    if (point.shape === 'pyramid' && !point.nextPoints && point.points) {
      point.points.forEach(function (p) {
        p = coord.convert(p);
        if (Util.isArray(p.x) && point.x.indexOf(p.x) === -1 || Util.isNumber(p.x) && point.x !== p.x) {
          labelPoint.x = (labelPoint.x + p.x) / 2;
        }
      });
    }

    var offsetPoint = self.getLabelOffset(labelPoint, index, labels.length);
    self.transLabelPoint(labelPoint);
    labelPoint.x += offsetPoint.x;
    labelPoint.y += offsetPoint.y;
    labelPoint.color = point.color;
    labelPoint._offset = offsetPoint;
    return labelPoint;
  };

  GeomLabels.prototype.transLabelPoint = function transLabelPoint(point) {
    var self = this;
    var coord = self.get('coord');
    var tmpPoint = coord.applyMatrix(point.x, point.y, 1);
    point.x = tmpPoint[0];
    point.y = tmpPoint[1];
  };

  GeomLabels.prototype.getOffsetVector = function getOffsetVector() {
    var self = this;
    var labelCfg = self.get('label');
    var offset = labelCfg.offset || 0;
    var coord = self.get('coord');
    var vector = void 0;
    if (coord.isTransposed) {
      // 如果x,y翻转，则偏移x
      vector = coord.applyMatrix(offset, 0);
    } else {
      // 否则，偏转y
      vector = coord.applyMatrix(0, offset);
    }
    return vector;
  };

  // 获取默认的偏移量


  GeomLabels.prototype.getDefaultOffset = function getDefaultOffset() {
    var self = this;
    var offset = 0;

    var coord = self.get('coord');
    var vector = self.getOffsetVector();
    if (coord.isTransposed) {
      // 如果x,y翻转，则偏移x
      offset = vector[0];
    } else {
      // 否则，偏转y
      offset = vector[1];
    }
    return offset;
  };

  // 获取文本的偏移位置，x,y


  GeomLabels.prototype.getLabelOffset = function getLabelOffset(point, index, total) {
    var self = this;
    var offset = self.getDefaultOffset();
    var coord = self.get('coord');
    var transposed = coord.isTransposed;
    var yField = transposed ? 'x' : 'y';
    var factor = transposed ? 1 : -1; // y 方向上越大，像素的坐标越小，所以transposed时将系数变成
    var offsetPoint = {
      x: 0,
      y: 0
    };
    if (index > 0 || total === 1) {
      // 判断是否小于0
      offsetPoint[yField] = offset * factor;
    } else {
      offsetPoint[yField] = offset * factor * -1;
    }
    return offsetPoint;
  };

  GeomLabels.prototype.getLabelAlign = function getLabelAlign(point, index, total) {
    var self = this;
    var align = 'center';
    var coord = self.get('coord');
    if (coord.isTransposed) {
      var offset = self.getDefaultOffset();
      // var vector = coord.applyMatrix(offset,0);
      if (offset < 0) {
        align = 'right';
      } else if (offset === 0) {
        align = 'center';
      } else {
        align = 'left';
      }
      if (total > 1 && index === 0) {
        if (align === 'right') {
          align = 'left';
        } else if (align === 'left') {
          align = 'right';
        }
      }
    }
    return align;
  };

  GeomLabels.prototype.showLabels = function showLabels(points) {
    var self = this;
    var items = self.getLabelsItems(points);
    var labels = self.get('label');
    items = self.adjustItems(items);
    self.resetLabels(items);
    if (labels.labelLine) {
      self.drawLines(items, labels.labelLine);
    }
  };

  GeomLabels.prototype.destroy = function destroy() {
    this.removeLabels(); // 清理文本
    _Group.prototype.destroy.call(this);
  };

  return GeomLabels;
}(Group);

Util.assign(GeomLabels.prototype, Labels.LabelsRenderer);

module.exports = GeomLabels;