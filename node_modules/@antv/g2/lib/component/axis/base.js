function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the base class of Axis
 * @author sima.zhang
 */
var Util = require('../../util');

var _require = require('../label/index'),
    LabelsRenderer = _require.LabelsRenderer;

var _require2 = require('../../renderer'),
    Group = _require2.Group;

var Grid = require('./grid');
var Global = require('../../global');

var Base = function (_Group) {
  _inherits(Base, _Group);

  function Base() {
    _classCallCheck(this, Base);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  Base.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * 用于动画，唯一标识的 id
       * @type {[type]}
       */
      _id: null,
      zIndex: 4,
      /**
       * 坐标轴上的坐标点
       * @type {Array}
       */
      ticks: null,
      /**
       * 坐标轴线的配置信息，如果设置成null，则不显示轴线
       * @type {Object}
       */
      line: null,
      /**
       * 坐标轴刻度线的配置,如果设置成null，则不显示刻度线
       * @type {Object}
       */
      tickLine: null,
      /**
       * 次刻度线个数配置
       * @type {Number}
       */
      subTickCount: 0,
      /**
       * 次刻度线样式配置
       * @type {Object}
       */
      subTickLine: null,
      /**
       * 网格线配置，如果值为 null，则不显示
       * @type {Object}
       */
      grid: null,
      /**
       * 坐标轴文本配置
       * @type {Object}
       */
      label: {
        textStyle: {}, // 坐标轴文本样式
        autoRotate: true,
        formatter: null // 坐标轴文本格式化回调函数
      },
      /**
       * 坐标轴标题配置
       * @type {Object}
       */
      title: {
        autoRotate: true, // 文本是否自动旋转
        textStyle: {} // 坐标轴标题样式
      },
      autoPaint: true
    };
  };

  Base.prototype._beforeRenderUI = function _beforeRenderUI() {
    var title = this.get('title');
    var label = this.get('label');
    var grid = this.get('grid');
    var viewTheme = this.get('viewTheme') || Global;
    if (title) {
      this.setSilent('title', Util.deepMix({
        autoRotate: true,
        textStyle: {
          fontSize: 12,
          fill: '#ccc',
          textBaseline: 'middle',
          fontFamily: viewTheme.fontFamily,
          textAlign: 'center'
        },
        offset: 48
      }, title));
    }
    if (label) {
      this.setSilent('label', Util.deepMix({
        autoRotate: true,
        textStyle: {
          fontSize: 12,
          fill: '#ccc',
          textBaseline: 'middle',
          fontFamily: viewTheme.fontFamily
        },
        offset: 10
      }, label));
    }
    if (grid) {
      this.setSilent('grid', Util.deepMix({
        lineStyle: {
          lineWidth: 1,
          stroke: '#C0D0E0'
        }
      }, grid));
    }
  };

  Base.prototype._renderUI = function _renderUI() {
    var labelCfg = this.get('label');
    if (labelCfg) {
      this.renderLabels();
    }
    if (this.get('autoPaint')) {
      this.paint();
    }
    if (!Util.isNil(this.get('title'))) {
      this.renderTitle();
    }
    this.sort();
  };

  Base.prototype._parseTicks = function _parseTicks(ticks) {
    ticks = ticks || [];
    var ticksLength = ticks.length;
    for (var i = 0; i < ticksLength; i++) {
      var item = ticks[i];
      if (!Util.isObject(item)) {
        ticks[i] = this.parseTick(item, i, ticksLength);
      }
    }
    this.set('ticks', ticks);
    return ticks;
  };

  Base.prototype._parseCatTicks = function _parseCatTicks(ticks) {
    ticks = ticks || [];
    var ticksLength = ticks.length;
    for (var i = 0; i < ticksLength; i++) {
      var item = ticks[i];
      if (!Util.isObject(item)) {
        ticks[i] = this.parseTick(item, i, ticksLength);
      }
    }
    this.set('ticks', ticks);
    return ticks;
  };

  Base.prototype._addTickItem = function _addTickItem(index, point, length) {
    var type = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

    var tickItems = this.get('tickItems');
    var subTickItems = this.get('subTickItems');
    var end = this.getTickEnd(point, length, index);

    var cfg = {
      x1: point.x,
      y1: point.y,
      x2: end.x,
      y2: end.y
    };

    if (!tickItems) {
      tickItems = [];
    }

    if (!subTickItems) {
      subTickItems = [];
    }

    if (type === 'sub') {
      subTickItems.push(cfg);
    } else {
      tickItems.push(cfg);
    }

    this.set('tickItems', tickItems);
    this.set('subTickItems', subTickItems);
  };

  Base.prototype._renderLine = function _renderLine() {
    var lineCfg = this.get('line');
    var path = void 0;
    if (lineCfg) {
      path = this.getLinePath();
      lineCfg = Util.mix({
        path: path
      }, lineCfg);
      var lineShape = this.addShape('path', {
        attrs: lineCfg
      });
      lineShape.name = 'axis-line';
      this.get('appendInfo') && lineShape.setSilent('appendInfo', this.get('appendInfo'));
      this.set('lineShape', lineShape);
    }
  };

  Base.prototype._processCatTicks = function _processCatTicks() {
    var self = this;
    var labelCfg = self.get('label');
    var tickLineCfg = self.get('tickLine');
    var ticks = self.get('ticks');
    ticks = self._parseTicks(ticks);
    var new_ticks = self._getNormalizedTicks(ticks);
    for (var i = 0; i < new_ticks.length; i += 3) {
      var p = self.getTickPoint(new_ticks[i]);
      var p0 = self.getTickPoint(new_ticks[i + 1]);
      var p1 = self.getTickPoint(new_ticks[i + 2]);
      var index = Math.floor(i / 3);
      var tick = ticks[index];
      if (tickLineCfg) {
        if (index === 0) {
          self._addTickItem(index, p0, tickLineCfg.length);
        }
        self._addTickItem(index, p1, tickLineCfg.length);
      }
      if (labelCfg) {
        self.addLabel(tick, p, index);
      }
    }
  };

  Base.prototype._getNormalizedTicks = function _getNormalizedTicks(ticks) {
    var tickSeg = 0;
    if (ticks.length > 1) {
      tickSeg = (ticks[1].value - ticks[0].value) / 2;
    }
    var points = [];
    for (var i = 0; i < ticks.length; i++) {
      var tick = ticks[i];
      var p = tick.value;
      var p0 = tick.value - tickSeg;
      var p1 = tick.value + tickSeg;
      points.push(p, p0, p1);
    }
    var range = Util.Array.getRange(points);
    return points.map(function (p) {
      var norm = (p - range.min) / (range.max - range.min);
      return norm;
    });
  };

  Base.prototype._processTicks = function _processTicks() {
    var self = this;
    var labelCfg = self.get('label');
    var subTickCount = self.get('subTickCount');
    var tickLineCfg = self.get('tickLine');
    var ticks = self.get('ticks');
    ticks = self._parseTicks(ticks);

    Util.each(ticks, function (tick, index) {
      var tickPoint = self.getTickPoint(tick.value, index);
      if (tickLineCfg) {
        self._addTickItem(index, tickPoint, tickLineCfg.length);
      }
      if (labelCfg) {
        self.addLabel(tick, tickPoint, index);
      }
    });

    if (subTickCount) {
      // 如果有设置次级分点，添加次级tick
      var subTickLineCfg = self.get('subTickLine');
      Util.each(ticks, function (tick, index) {
        if (index > 0) {
          var diff = tick.value - ticks[index - 1].value;
          diff = diff / (self.get('subTickCount') + 1);

          for (var i = 1; i <= subTickCount; i++) {
            var subTick = {
              text: '',
              value: index ? ticks[index - 1].value + i * diff : i * diff
            };

            var tickPoint = self.getTickPoint(subTick.value);
            var subTickLength = void 0;
            if (subTickLineCfg && subTickLineCfg.length) {
              subTickLength = subTickLineCfg.length;
            } else {
              subTickLength = parseInt(tickLineCfg.length * (3 / 5), 10);
            }
            self._addTickItem(i - 1, tickPoint, subTickLength, 'sub');
          }
        }
      });
    }
  };

  Base.prototype._addTickLine = function _addTickLine(ticks, lineCfg) {
    var self = this;
    var cfg = Util.mix({}, lineCfg);
    var path = [];
    Util.each(ticks, function (item) {
      path.push(['M', item.x1, item.y1]);
      path.push(['L', item.x2, item.y2]);
    });
    delete cfg.length;
    cfg.path = path;
    var tickShape = self.addShape('path', {
      attrs: cfg
    });
    tickShape.name = 'axis-ticks';
    tickShape._id = self.get('_id') + '-ticks';
    tickShape.set('coord', self.get('coord'));
    self.get('appendInfo') && tickShape.setSilent('appendInfo', self.get('appendInfo'));
  };

  Base.prototype._renderTicks = function _renderTicks() {
    var self = this;
    var tickItems = self.get('tickItems');
    var subTickItems = self.get('subTickItems');

    if (!Util.isEmpty(tickItems)) {
      var tickLineCfg = self.get('tickLine');
      self._addTickLine(tickItems, tickLineCfg);
    }

    if (!Util.isEmpty(subTickItems)) {
      var subTickLineCfg = self.get('subTickLine') || self.get('tickLine');
      self._addTickLine(subTickItems, subTickLineCfg);
    }
  };

  Base.prototype._renderGrid = function _renderGrid() {
    var grid = this.get('grid');
    if (!grid) {
      return;
    }
    grid.coord = this.get('coord');
    grid.appendInfo = this.get('appendInfo');
    this.set('gridGroup', this.addGroup(Grid, grid));
  };

  Base.prototype.paint = function paint() {
    var tickLineCfg = this.get('tickLine');
    var alignWithLabel = true;
    if (tickLineCfg && tickLineCfg.hasOwnProperty('alignWithLabel')) {
      alignWithLabel = tickLineCfg.alignWithLabel;
    }
    this._renderLine();
    var type = this.get('type');
    var isCat = type === 'cat' || type === 'timeCat';
    if (isCat && alignWithLabel === false) {
      this._processCatTicks();
    } else {
      this._processTicks();
    }
    this._renderTicks();
    this._renderGrid();
    var labelCfg = this.get('label');
    if (labelCfg && labelCfg.autoRotate) {
      this.autoRotateLabels();
    }
  };

  Base.prototype.parseTick = function parseTick(tick, index, length) {
    return {
      text: tick,
      value: index / (length - 1)
    };
  };

  Base.prototype.getTextAnchor = function getTextAnchor(vector) {
    var ratio = Math.abs(vector[1] / vector[0]);
    var align = void 0;
    if (ratio >= 1) {
      // 上面或者下面
      align = 'center';
    } else {
      if (vector[0] > 0) {
        // 右侧
        align = 'start';
      } else {
        // 左侧
        align = 'end';
      }
    }
    return align;
  };

  Base.prototype.getMaxLabelWidth = function getMaxLabelWidth(labelsGroup) {
    var labels = labelsGroup.get('children');
    var max = 0;
    Util.each(labels, function (label) {
      var bbox = label.getBBox();
      var width = bbox.width;
      if (max < width) {
        max = width;
      }
    });
    return max;
  };

  Base.prototype.remove = function remove() {
    _Group.prototype.remove.call(this);
    var gridGroup = this.get('gridGroup');
    gridGroup && gridGroup.remove();
    this.removeLabels();
  };

  /**
   * 旋转文本
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.autoRotateLabels = function autoRotateLabels() {};

  /**
   * 渲染标题
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.renderTitle = function renderTitle() {};

  /**
   * 获取坐标轴线的 path
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.getLinePath = function getLinePath() {};

  /**
   * 获取 tick 在画布上的位置
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.getTickPoint = function getTickPoint() {};

  /**
   * 获取标示坐标点的线的终点
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.getTickEnd = function getTickEnd() {};

  /**
   * 获取距离坐标轴的向量
   * @abstract
   * @return {[type]} [description]
   */


  Base.prototype.getSideVector = function getSideVector() {};

  return Base;
}(Group);

Util.assign(Base.prototype, LabelsRenderer, {
  addLabel: function addLabel(tick, point, index) {
    var labelsGroup = this.get('labelsGroup');
    var label = {};
    var rst = void 0;

    if (labelsGroup) {
      var offset = this.get('_labelOffset');
      if (!Util.isNil(this.get('label').offset)) {
        offset = this.get('label').offset;
      }
      var vector = this.getSideVector(offset, point, index);
      point = {
        x: point.x + vector[0],
        y: point.y + vector[1]
      };
      label.text = tick.text;
      label.x = point.x;
      label.y = point.y;
      label.textAlign = this.getTextAnchor(vector);
      rst = labelsGroup.addLabel(label);
      if (rst) {
        rst.name = 'axis-label';
        rst._id = this.get('_id') + '-' + tick.tickValue;
        rst.set('coord', this.get('coord'));
        this.get('appendInfo') && rst.setSilent('appendInfo', this.get('appendInfo'));
      }
    }
    return rst;
  }
});

module.exports = Base;