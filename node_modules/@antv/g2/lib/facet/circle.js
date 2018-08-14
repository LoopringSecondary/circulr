function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview circle facets
 * @author dxq613@gmail.com
 */

var Base = require('./base');

function getPoint(center, r, angle) {
  return {
    x: center.x + r * Math.cos(angle),
    y: center.y + r * Math.sin(angle)
  };
}

var Circle = function (_Base) {
  _inherits(Circle, _Base);

  function Circle() {
    _classCallCheck(this, Circle);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  Circle.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    cfg.type = 'circle';
    return cfg;
  };

  Circle.prototype.getRegion = function getRegion(count, index) {
    var r = 1 / 2; // 画布半径
    var avgAngle = Math.PI * 2 / count;
    var angle = -1 * Math.PI / 2 + avgAngle * index; // 当前分面所在的弧度
    var facetR = r / (1 + 1 / Math.sin(avgAngle / 2));
    var center = { x: 0.5, y: 0.5 }; // 画布圆心
    var middle = getPoint(center, r - facetR, angle); // 分面的中心点
    var startAngle = Math.PI * 5 / 4; // 右上角
    var endAngle = Math.PI * 1 / 4; // 左下角

    return {
      start: getPoint(middle, facetR, startAngle),
      end: getPoint(middle, facetR, endAngle)
    };
  };

  Circle.prototype.generateFacets = function generateFacets(data) {
    var self = this;
    var fields = self.fields;
    var field = fields[0];
    if (!field) {
      throw 'Please specify for the field for facet!';
    }
    var values = self.getFieldValues(field, data);
    var count = values.length;
    var rst = [];
    values.forEach(function (value, index) {
      var conditions = [{ field: field, value: value, values: values }];
      var filter = self.getFilter(conditions);
      var subData = data.filter(filter);
      var facet = {
        type: self.type,
        colValue: value,
        colField: field,
        colIndex: index,
        cols: count,
        rows: 1,
        rowIndex: 0,
        data: subData,
        region: self.getRegion(count, index)
      };
      rst.push(facet);
    });
    return rst;
  };

  return Circle;
}(Base);

module.exports = Circle;