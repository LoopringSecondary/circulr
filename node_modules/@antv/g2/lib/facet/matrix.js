function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview Use matrices to compare different fields
 * @author dxq613@gmail.com
 */

var Rect = require('./rect');

var Matrix = function (_Rect) {
  _inherits(Matrix, _Rect);

  function Matrix() {
    _classCallCheck(this, Matrix);

    return _possibleConstructorReturn(this, _Rect.apply(this, arguments));
  }

  Matrix.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Rect.prototype.getDefaultCfg.call(this);
    cfg.type = 'matrix';
    cfg.showTitle = false;
    return cfg;
  };

  Matrix.prototype.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    var rows = fields.length;
    var cols = rows; // 矩阵中行列相等，等于指定的字段个数
    var rst = [];
    for (var i = 0; i < cols; i++) {
      var colField = fields[i];
      for (var j = 0; j < rows; j++) {
        var rowField = fields[j];
        var facet = {
          type: self.type,
          colValue: colField,
          rowValue: rowField,
          colField: colField,
          rowField: rowField,
          colIndex: i,
          rowIndex: j,
          cols: cols,
          rows: rows,
          data: data,
          region: self.getRegion(rows, cols, i, j)
        };
        rst.push(facet);
      }
    }
    return rst;
  };

  // 设置 x 坐标轴的文本、title 是否显示


  Matrix.prototype.setXAxis = function setXAxis(xField, axes, facet) {
    if (facet.rowIndex !== facet.rows - 1) {
      axes[xField].title = null;
      axes[xField].label = null;
    }
  };

  // 设置 y 坐标轴的文本、title 是否显示


  Matrix.prototype.setYAxis = function setYAxis(yField, axes, facet) {
    if (facet.colIndex !== 0) {
      axes[yField].title = null;
      axes[yField].label = null;
    }
  };

  return Matrix;
}(Rect);

module.exports = Matrix;