function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview 分面的基类
 * @author dxq613@gmail.com
 */

var Base = require('./base');

/**
 * 矩形的 facet 有以下属性：
 * - colField 列的字段
 * - rowField 行的字段
 * - colValue 列字段的值
 * - rowValue 行字段的值
 * - cols 列数
 * - rows 行数
 * - colIndex 列的序号
 * - rowIndex 行的序号
 */

/**
 * 用于生成分面的类
 * @class Facets.Rect
 */

var Rect = function (_Base) {
  _inherits(Rect, _Base);

  function Rect() {
    _classCallCheck(this, Rect);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Rect.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    cfg.type = 'rect';
    return cfg;
  };

  Rect.prototype.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    // var defs = self.defs;
    var rst = [];
    var rows = 1;
    var cols = 1;
    var colField = fields[0];
    var rowField = fields[1];
    var colValues = [''];
    var rowValues = [''];
    if (colField) {
      colValues = self.getFieldValues(colField, data);
      cols = colValues.length;
    }
    if (rowField) {
      rowValues = self.getFieldValues(rowField, data);
      rows = rowValues.length;
    }

    // 获取每个维度对应的frame
    colValues.forEach(function (xVal, xIndex) {
      rowValues.forEach(function (yVal, yIndex) {
        var conditions = [{ field: colField, value: xVal, values: colValues }, { field: rowField, value: yVal, values: rowValues }];
        var filter = self.getFilter(conditions);
        var subData = data.filter(filter);
        var facet = {
          type: self.type,
          colValue: xVal,
          rowValue: yVal,
          colField: colField,
          rowField: rowField,
          colIndex: xIndex,
          rowIndex: yIndex,
          cols: cols,
          rows: rows,
          data: subData,
          region: self.getRegion(rows, cols, xIndex, yIndex)
        };
        rst.push(facet);
      });
    });

    return rst;
  };

  // 设置 x 坐标轴的文本、title 是否显示


  Rect.prototype.setXAxis = function setXAxis(xField, axes, facet) {
    if (facet.rowIndex !== facet.rows - 1) {
      axes[xField].title = null;
      axes[xField].label = null;
    } else if (facet.colIndex !== parseInt((facet.cols - 1) / 2)) {
      axes[xField].title = null;
    }
  };
  // 设置 y 坐标轴的文本、title 是否显示


  Rect.prototype.setYAxis = function setYAxis(yField, axes, facet) {
    if (facet.colIndex !== 0) {
      axes[yField].title = null;
      axes[yField].label = null;
    } else if (facet.rowIndex !== parseInt((facet.rows - 1) / 2)) {
      axes[yField].title = null;
    }
  };

  Rect.prototype.renderTitle = function renderTitle(view, facet) {
    if (facet.rowIndex === 0) {
      this.drawColTitle(view, facet);
    }
    if (facet.colIndex === facet.cols - 1) {
      this.drawRowTitle(view, facet);
    }
  };

  return Rect;
}(Base);

module.exports = Rect;