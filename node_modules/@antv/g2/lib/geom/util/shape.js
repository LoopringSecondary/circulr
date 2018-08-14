/**
 * @fileOverview shape 的辅助方法
 * @author dxq613@gmail.com
 */
var Util = require('../../util');

var ShapeUtil = {
  splitPoints: function splitPoints(obj) {
    var points = [];
    var x = obj.x;
    var y = obj.y;
    y = Util.isArray(y) ? y : [y];
    Util.each(y, function (yItem, index) {
      var point = {
        x: Util.isArray(x) ? x[index] : x,
        y: yItem
      };
      points.push(point);
    });
    return points;
  }
};

module.exports = ShapeUtil;