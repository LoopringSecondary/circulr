function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview The controller of coordinate
 * @author sima.zhang
 */
var Util = require('../../util');
var Coord = require('../../coord/index');

var CoordController = function () {
  function CoordController(option) {
    _classCallCheck(this, CoordController);

    this.type = 'rect';
    this.actions = [];
    this.cfg = {};
    Util.mix(this, option);
    this.option = option || {};
  }

  CoordController.prototype.reset = function reset(coordOption) {
    this.actions = coordOption.actions || [];
    this.type = coordOption.type;
    this.cfg = coordOption.cfg;
    this.option.actions = this.actions;
    this.option.type = this.type;
    this.option.cfg = this.cfg;
    return this;
  };

  CoordController.prototype._execActions = function _execActions(coord) {
    var actions = this.actions;
    Util.each(actions, function (action) {
      var m = action[0];
      coord[m](action[1], action[2]);
    });
  };

  CoordController.prototype.hasAction = function hasAction(actionName) {
    var actions = this.actions;
    var rst = false;
    Util.each(actions, function (action) {
      if (actionName === action[0]) {
        rst = true;
        return false;
      }
    });
    return rst;
  };
  /**
   * 创建坐标系对象
   * @param  {Object} start 坐标系起始点
   * @param  {Object} end   坐标系结束点
   * @return {Function} 坐标系的构造函数
   */


  CoordController.prototype.createCoord = function createCoord(start, end) {
    var self = this;
    var type = self.type;
    var cfg = self.cfg;
    var C = void 0; // 构造函数
    var coord = void 0;

    var coordCfg = Util.mix({
      start: start,
      end: end
    }, cfg);

    if (type === 'theta') {
      // definition of theta coord
      C = Coord.Polar;

      if (!self.hasAction('transpose')) {
        self.transpose(); // 极坐标，同时transpose
      }
      coord = new C(coordCfg);
      coord.type = type;
    } else {
      C = Coord[Util.upperFirst(type || '')] || Coord.Rect;
      coord = new C(coordCfg);
    }

    self._execActions(coord);
    return coord;
  };

  CoordController.prototype.rotate = function rotate(angle) {
    angle = angle * Math.PI / 180;
    this.actions.push(['rotate', angle]);
    return this;
  };

  CoordController.prototype.reflect = function reflect(dim) {
    this.actions.push(['reflect', dim]);
    return this;
  };

  CoordController.prototype.scale = function scale(sx, sy) {
    this.actions.push(['scale', sx, sy]);
    return this;
  };

  CoordController.prototype.transpose = function transpose() {
    this.actions.push(['transpose']);
    return this;
  };

  return CoordController;
}();

module.exports = CoordController;