function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview list facets, support cols
 */

var Base = require('./base');

/**
 * 用于生成分面的类
 * @class Facets.List
 */

var List = function (_Base) {
  _inherits(List, _Base);

  function List() {
    _classCallCheck(this, List);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  List.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    cfg.type = 'list';
    cfg.cols = null; // 用户不设置时就显示一行
    return cfg;
  };

  List.prototype.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    var colField = fields[0];
    if (!colField) {
      throw 'Please specify for the field for facet!';
    }
    var colValues = self.getFieldValues(colField, data);
    var count = colValues.length;
    var cols = self.cols || count;
    var rows = parseInt((count + cols - 1) / cols);
    var rst = [];
    colValues.forEach(function (xVal, index) {
      var row = parseInt(index / cols);
      var col = index % cols;
      var conditions = [{ field: colField, value: xVal, values: colValues }];
      var filter = self.getFilter(conditions);
      var subData = data.filter(filter);
      var facet = {
        type: self.type,
        count: count,
        colValue: xVal,
        colField: colField,
        rowField: null,
        rowValue: xVal,
        colIndex: col,
        rowIndex: row,
        cols: cols,
        rows: rows,
        data: subData,
        region: self.getRegion(rows, cols, col, row)
      };
      rst.push(facet);
    });
    return rst;
  };

  // 设置 x 坐标轴的文本、title 是否显示


  List.prototype.setXAxis = function setXAxis(xField, axes, facet) {
    // 当是最后一行或者下面没有 view 时文本不显示
    if (facet.rowIndex !== facet.rows - 1 && facet.cols * facet.rowIndex + facet.colIndex + 1 + facet.cols <= facet.count) {
      axes[xField].label = null;
      axes[xField].title = null;
    }
  };

  // 设置 y 坐标轴的文本、title 是否显示


  List.prototype.setYAxis = function setYAxis(yField, axes, facet) {
    if (facet.colIndex !== 0) {
      axes[yField].title = null;
      axes[yField].label = null;
    }
  };

  return List;
}(Base);

module.exports = List;