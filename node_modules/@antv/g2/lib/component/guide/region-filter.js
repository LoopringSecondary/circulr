function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the region guide
 * @author Ye Liu liuye10@yahoo.com
 */
var Util = require('../../util');
var Base = require('./base');

var RegionFilter = function (_Base) {
  _inherits(RegionFilter, _Base);

  function RegionFilter() {
    _classCallCheck(this, RegionFilter);

    return _possibleConstructorReturn(this, _Base.apply(this, arguments));
  }

  RegionFilter.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      type: 'regionFilter',
      zIndex: 1,
      top: true,
      start: null,
      end: null,
      color: null,
      apply: null,
      style: {
        opacity: 1
      }
    });
  };

  RegionFilter.prototype.render = function render(coord, group) {
    var self = this;
    var view = self.view;
    var layer = group.addGroup();
    view.once('afterpaint', function () {
      self._drawShapes(view, layer);
      var clip = self._drawClip(coord, group);
      layer.attr({ clip: clip });
    });

    self.appendInfo && layer.setSilent('appendInfo', self.appendInfo);
    self.el = layer;
  };

  RegionFilter.prototype._drawShapes = function _drawShapes(view, layer) {
    var self = this;
    var output = [];
    var geoms = view.getAllGeoms();
    geoms.map(function (geom) {
      var shapes = geom.getShapes();
      var geomType = geom.get('type');
      var filter = self._geomFilter(geomType);
      if (filter) {
        shapes.map(function (shape) {
          var shapeType = shape.type;
          var shapeAttr = Util.cloneDeep(shape.get('attrs'));
          self._adjustDisplay(shapeAttr);
          var s = layer.addShape(shapeType, {
            attrs: shapeAttr
          });
          output.push(s);
          return shape;
        });
      }
      return geom;
    });
    return output;
  };

  RegionFilter.prototype._drawClip = function _drawClip(coord, group) {
    var self = this;
    var start = self.parsePoint(coord, self.start);
    var end = self.parsePoint(coord, self.end);
    var c = group.addShape('rect', {
      attrs: {
        x: start.x,
        y: start.y,
        width: end.x - start.x,
        height: end.y - start.y,
        opacity: 1
      }
    });
    return c;
  };

  RegionFilter.prototype._adjustDisplay = function _adjustDisplay(attr) {
    var self = this;
    var color = self.color;
    if (attr.fill) {
      attr.fill = color;
    }
    attr.stroke = color;
  };

  RegionFilter.prototype._geomFilter = function _geomFilter(geomType) {
    var self = this;
    if (self.apply) {
      return Util.inArray(self.apply, geomType);
    }
    return true;
  };

  return RegionFilter;
}(Base);

module.exports = RegionFilter;