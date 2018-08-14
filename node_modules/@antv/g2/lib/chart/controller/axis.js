function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview The controller of axis
 * @author sima.zhang
 */
var Util = require('../../util');
var Axis = require('../../component/axis');
var vec2 = Util.MatrixUtil.vec2;


function formatTicks(ticks) {
  var tmp = [];
  if (ticks.length > 0) {
    tmp = ticks.slice(0);
    var first = tmp[0];
    var last = tmp[tmp.length - 1];
    if (first.value !== 0) {
      tmp.unshift({
        value: 0
      });
    }
    if (last.value !== 1) {
      tmp.push({
        value: 1
      });
    }
  }
  return tmp;
}

function fillAxisTicks(ticks, isLinear, gridCentering) {
  var result = [];
  if (ticks.length < 1) return result;

  if (ticks.length >= 2 && isLinear && gridCentering) {
    result.push({
      text: '',
      tickValue: '',
      value: 0
    });
  }
  if (ticks[0].value !== 0) {
    result.push({
      text: '',
      tickValue: '',
      value: 0
    });
  }
  result = result.concat(ticks);
  if (result[result.length - 1].value !== 1) {
    result.push({
      text: '',
      tickValue: '',
      value: 1
    });
  }
  return result;
}

var AxisController = function () {
  function AxisController(cfg) {
    _classCallCheck(this, AxisController);

    this.visible = true;
    this.container = null;
    this.coord = null;
    this.options = null;
    this.axes = [];
    Util.mix(this, cfg);
  }

  AxisController.prototype._isHide = function _isHide(field) {
    // 对应的坐标轴是否隐藏
    var options = this.options;

    if (options && options[field] === false) {
      return true;
    }
    return false;
  };

  AxisController.prototype._getMiddleValue = function _getMiddleValue(curValue, ticks, index, isLinear) {
    if (curValue === 0 && !isLinear) {
      return 0;
    }
    if (curValue === 1) {
      return 1;
    }
    var nextValue = ticks[index + 1].value;
    if (!isLinear && nextValue === 1) {
      return 1;
    }
    return (curValue + nextValue) / 2;
  };

  AxisController.prototype._getLineRange = function _getLineRange(coord, scale, dimType, index) {
    var start = void 0;
    var end = void 0;
    var isVertical = void 0;
    var field = scale.field;
    var options = this.options;
    var position = '';
    if (options[field] && options[field].position) {
      position = options[field].position;
    }

    if (dimType === 'x') {
      // x轴的坐标轴,底部的横坐标
      start = {
        x: 0,
        y: position === 'top' ? 1 : 0
      };
      end = {
        x: 1,
        y: position === 'top' ? 1 : 0
      };
      isVertical = false;
    } else {
      // y轴坐标轴
      if (index) {
        // 多轴的情况
        start = {
          x: position === 'left' ? 0 : 1,
          y: 0
        };
        end = {
          x: position === 'left' ? 0 : 1,
          y: 1
        };
      } else {
        // 单个y轴，或者第一个y轴
        start = {
          x: position === 'right' ? 1 : 0,
          y: 0
        };
        end = {
          x: position === 'right' ? 1 : 0,
          y: 1
        };
      }
      isVertical = true;
    }

    start = coord.convert(start);
    end = coord.convert(end);

    return {
      start: start,
      end: end,
      isVertical: isVertical
    };
  };

  AxisController.prototype._getLineCfg = function _getLineCfg(coord, scale, dimType, index) {
    var factor = void 0;
    var range = this._getLineRange(coord, scale, dimType, index);
    var isVertical = range.isVertical; // 标识该坐标轴是否是纵坐标
    var start = range.start;
    var end = range.end;
    var center = coord.center;

    if (coord.isTransposed) {
      isVertical = !isVertical;
    }

    if (isVertical && start.x > center.x || !isVertical && start.y > center.y) {
      factor = 1;
    } else {
      factor = -1;
    }

    return {
      isVertical: isVertical,
      factor: factor,
      start: start,
      end: end
    };
  };

  // 获取圆弧坐标轴配置项信息


  AxisController.prototype._getCircleCfg = function _getCircleCfg(coord) {
    var circleCfg = {};
    var rangeX = coord.x;
    var rangeY = coord.y;
    var isReflectY = rangeY.start > rangeY.end;
    var start = void 0;
    if (coord.isTransposed) {
      start = {
        x: isReflectY ? 0 : 1,
        y: 0
      };
    } else {
      start = {
        x: 0,
        y: isReflectY ? 0 : 1
      };
    }

    start = coord.convert(start);
    var center = coord.circleCentre;
    var startVector = [start.x - center.x, start.y - center.y];
    var normalVector = [1, 0];
    var startAngle = void 0;
    if (start.y > center.y) {
      startAngle = vec2.angle(startVector, normalVector);
    } else {
      startAngle = vec2.angle(startVector, normalVector) * -1;
    }
    var endAngle = startAngle + (rangeX.end - rangeX.start);

    circleCfg.startAngle = startAngle;
    circleCfg.endAngle = endAngle;
    circleCfg.center = center;
    circleCfg.radius = Math.sqrt(Math.pow(start.x - center.x, 2) + Math.pow(start.y - center.y, 2));
    circleCfg.inner = coord.innerRadius || 0;
    return circleCfg;
  };

  AxisController.prototype._getRadiusCfg = function _getRadiusCfg(coord) {
    var startAngle = coord.x.start;
    var factor = startAngle < 0 ? -1 : 1;
    var start = void 0;
    var end = void 0;
    if (coord.isTransposed) {
      start = {
        x: 0,
        y: 0
      };
      end = {
        x: 1,
        y: 0
      };
    } else {
      start = {
        x: 0,
        y: 0
      };
      end = {
        x: 0,
        y: 1
      };
    }
    return {
      factor: factor,
      start: coord.convert(start),
      end: coord.convert(end)
    };
  };

  // 确定坐标轴的位置


  AxisController.prototype._getAxisPosition = function _getAxisPosition(coord, dimType, index, field) {
    var position = '';
    // 用户自己定义了 position
    var options = this.options;
    if (options[field] && options[field].position) {
      position = options[field].position;
    } else {
      var coordType = coord.type;
      if (coord.isRect) {
        if (dimType === 'x') {
          position = 'bottom';
        } else if (dimType === 'y') {
          if (index) {
            position = 'right';
          } else {
            position = 'left';
          }
        }
      } else if (coordType === 'helix') {
        position = 'helix';
      } else if (dimType === 'x') {
        position = coord.isTransposed ? 'radius' : 'circle';
      } else {
        position = coord.isTransposed ? 'circle' : 'radius';
      }
    }

    return position;
  };

  // 获取坐标轴构成的配置信息


  AxisController.prototype._getAxisDefaultCfg = function _getAxisDefaultCfg(coord, scale, type, position) {
    var self = this;
    var viewTheme = self.viewTheme;
    var cfg = {};
    var options = self.options;
    var field = scale.field;

    cfg = Util.deepMix({}, viewTheme.axis[position], cfg, options[field]);
    if (cfg.title) {
      Util.deepMix(cfg, {
        title: {
          text: scale.alias || field
        }
      });
    }

    cfg.ticks = scale.getTicks();

    if (coord.isPolar && !scale.isCategory) {
      if (type === 'x' && Math.abs(coord.endAngle - coord.startAngle) === Math.PI * 2) {
        cfg.ticks.pop();
      }
    }

    cfg.coord = coord;
    if (cfg.label && Util.isNil(cfg.label.autoRotate)) {
      cfg.label.autoRotate = true; // 允许自动旋转，避免重叠
    }

    if (options.hasOwnProperty('xField') && options.xField.hasOwnProperty('grid')) {
      if (cfg.position === 'left') {
        Util.deepMix(cfg, options.xField);
      }
    }

    return cfg;
  };

  // 确定坐标轴的配置信息


  AxisController.prototype._getAxisCfg = function _getAxisCfg(coord, scale, verticalScale, dimType) {
    var index = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '';
    var viewId = arguments[5];

    var self = this;
    var position = self._getAxisPosition(coord, dimType, index, scale.field);
    var cfg = self._getAxisDefaultCfg(coord, scale, dimType, position);
    if (!Util.isEmpty(cfg.grid) && verticalScale) {
      // 生成 gridPoints
      var gridPoints = [];
      var tickValues = [];
      var verticalTicks = formatTicks(verticalScale.getTicks());
      // 没有垂直的坐标点时不会只栅格
      if (verticalTicks.length) {
        var ticks = fillAxisTicks(cfg.ticks, scale.isLinear, cfg.grid.align === 'center');
        Util.each(ticks, function (tick, idx) {
          tickValues.push(tick.tickValue);
          var subPoints = [];
          var value = tick.value;
          if (cfg.grid.align === 'center') {
            value = self._getMiddleValue(value, ticks, idx, scale.isLinear);
          }
          if (!Util.isNil(value)) {
            var rangeX = coord.x;
            var rangeY = coord.y;
            Util.each(verticalTicks, function (verticalTick) {
              var x = dimType === 'x' ? value : verticalTick.value;
              var y = dimType === 'x' ? verticalTick.value : value;
              var point = coord.convert({
                x: x,
                y: y
              });
              if (coord.isPolar) {
                var center = coord.circleCentre;
                if (rangeY.start > rangeY.end) {
                  y = 1 - y;
                }
                point.flag = rangeX.start > rangeX.end ? 0 : 1;
                point.radius = Math.sqrt(Math.pow(point.x - center.x, 2) + Math.pow(point.y - center.y, 2));
              }
              subPoints.push(point);
            });
            gridPoints.push({
              _id: viewId + '-' + dimType + index + '-grid-' + tick.tickValue,
              points: subPoints
            });
          }
        });
      }
      cfg.grid.items = gridPoints;
      cfg.grid.tickValues = tickValues;
    }
    cfg.type = scale.type;
    return cfg;
  };

  AxisController.prototype._getHelixCfg = function _getHelixCfg(coord) {
    var helixCfg = {};
    var a = coord.a;
    var startAngle = coord.startAngle;
    var endAngle = coord.endAngle;
    var index = 100;
    var crp = [];
    for (var i = 0; i <= index; i++) {
      var point = coord.convert({
        x: i / 100,
        y: 0
      });
      crp.push(point.x);
      crp.push(point.y);
    }
    var axisStart = coord.convert({
      x: 0,
      y: 0
    });
    helixCfg.a = a;
    helixCfg.startAngle = startAngle;
    helixCfg.endAngle = endAngle;
    helixCfg.crp = crp;
    helixCfg.axisStart = axisStart;
    helixCfg.center = coord.center;
    helixCfg.inner = coord.y.start; // 内半径
    return helixCfg;
  };

  AxisController.prototype._drawAxis = function _drawAxis(coord, scale, verticalScale, dimType, viewId, xAxis, index) {
    var container = this.container;
    var C = void 0; // 坐标轴类
    var appendCfg = void 0; // 每个坐标轴 start end 等绘制边界的信息

    if (coord.type === 'cartesian') {
      C = Axis.Line;
      appendCfg = this._getLineCfg(coord, scale, dimType, index);
    } else if (coord.type === 'helix' && dimType === 'x') {
      C = Axis.Helix;
      appendCfg = this._getHelixCfg(coord);
    } else if (dimType === 'x') {
      C = Axis.Circle;
      appendCfg = this._getCircleCfg(coord);
    } else {
      C = Axis.Line;
      appendCfg = this._getRadiusCfg(coord);
    }
    var cfg = this._getAxisCfg(coord, scale, verticalScale, dimType, index, viewId);
    cfg = Util.mix({}, cfg, appendCfg);

    if (dimType === 'y' && xAxis && xAxis.get('type') === 'circle') {
      cfg.circle = xAxis;
    }
    cfg._id = viewId + '-' + dimType;
    if (!Util.isNil(index)) {
      cfg._id = viewId + '-' + dimType + index;
    }

    var axis = container.addGroup(C, cfg);
    this.axes.push(axis);
    return axis;
  };

  AxisController.prototype.createAxis = function createAxis(xScale, yScales, viewId) {
    var self = this;
    var coord = this.coord;
    var coordType = coord.type;

    // theta坐标系默认不绘制坐标轴
    if (coordType !== 'theta' && !(coordType === 'polar' && coord.isTransposed)) {
      var xAxis = void 0;
      if (xScale && !self._isHide(xScale.field)) {
        xAxis = self._drawAxis(coord, xScale, yScales[0], 'x', viewId); // 绘制 x 轴
      }
      if (!Util.isEmpty(yScales) && coordType !== 'helix') {
        Util.each(yScales, function (yScale, index) {
          if (!self._isHide(yScale.field)) {
            self._drawAxis(coord, yScale, xScale, 'y', viewId, xAxis, index);
          }
        });
      }
    }
  };

  AxisController.prototype.changeVisible = function changeVisible(visible) {
    var axes = this.axes;
    Util.each(axes, function (axis) {
      axis.set('visible', visible);
    });
  };

  AxisController.prototype.clear = function clear() {
    var axes = this.axes;
    Util.each(axes, function (axis) {
      axis.remove();
    });
    this.axes = [];
  };

  return AxisController;
}();

module.exports = AxisController;