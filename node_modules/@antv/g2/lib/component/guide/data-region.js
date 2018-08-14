function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the data-region guide
 * @author Ye Liu liuye10@yahoo.com
 */
var Util = require('../../util');
var DataMarker = require('./data-marker');

function getFirstScale(scales) {
  var firstScale = void 0;
  Util.each(scales, function (scale) {
    if (scale) {
      firstScale = scale;
      return false;
    }
  });
  return firstScale;
}

var DataRegion = function (_DataMarker) {
  _inherits(DataRegion, _DataMarker);

  function DataRegion() {
    _classCallCheck(this, DataRegion);

    return _possibleConstructorReturn(this, _DataMarker.apply(this, arguments));
  }

  DataRegion.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _DataMarker.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      type: 'dataRegion',
      start: null,
      end: null,
      bbox: null,
      regionStyle: {
        lineWidth: 0,
        fill: '#CCD7EB',
        opacity: 0.4
      }
    });
  };

  DataRegion.prototype.render = function render(coord, group) {
    var self = this;
    // draw region
    var lineLength = self.lineLength;
    var regionData = self._getRegionData(coord);
    self.bbox = self._dataBbox(regionData);
    self._drawRegion(regionData, group);
    var dir = self.direction === 'upward' ? 1 : -1;
    // draw text
    var textStyle = self.style.text;
    textStyle.textBaseline = dir > 0 ? 'bottom' : 'top';
    var textPosition = { x: self.bbox.xMin + (self.bbox.xMax - self.bbox.xMin) / 2, y: self.bbox.yMin - self.lineLength * dir };
    group.addShape('text', {
      attrs: Util.mix({
        text: self.content
      }, textStyle, textPosition)
    });
    // draw marker
    var startLineLength = Math.abs(regionData[0].y - self.bbox.yMin);
    startLineLength += lineLength;
    _DataMarker.prototype.set.call(this, 'lineLength', startLineLength);
    _DataMarker.prototype.set.call(this, 'content', null);
    _DataMarker.prototype.set.call(this, 'position', self.start);
    _DataMarker.prototype.render.call(this, coord, group);
    var endLineLength = 0;
    if (dir > 0) {
      endLineLength = Math.abs(regionData[regionData.length - 1].y - self.bbox.yMin);
      endLineLength += lineLength;
    } else {
      endLineLength = lineLength;
    }
    _DataMarker.prototype.set.call(this, 'lineLength', endLineLength);
    _DataMarker.prototype.set.call(this, 'position', self.end);
    _DataMarker.prototype.render.call(this, coord, group);
  };

  DataRegion.prototype._getRegionData = function _getRegionData(coord) {
    var self = this;
    var arr = [];
    var data = self.view.get('data');
    var xField = getFirstScale(self.xScales).field;
    var yField = getFirstScale(self.yScales).field;
    var startIndex = self._getDataIndex(self.start, data);
    var endIndex = self._getDataIndex(self.end, data);
    for (var i = startIndex; i <= endIndex; i++) {
      var d = data[i];
      var xValue = d[xField];
      var yValue = d[yField];
      var position = self.parsePoint(coord, [xValue, yValue]);
      arr.push(position);
    }
    return arr;
  };

  DataRegion.prototype._getDataIndex = function _getDataIndex(d, data) {
    var self = this;
    var xField = getFirstScale(self.xScales).field;
    var xValue = d[0];
    for (var i = 0; i < data.length; i++) {
      var v = data[i][xField];
      if (v === xValue) {
        return i;
      }
    }
  };

  DataRegion.prototype._dataBbox = function _dataBbox(data) {
    var xs = [];
    var ys = [];
    for (var i = 0; i < data.length; i++) {
      xs.push(data[i].x);
      ys.push(data[i].y);
    }
    var xRange = Util.Array.getRange(xs);
    var yRange = Util.Array.getRange(ys);

    var output = { xMin: xRange.min, xMax: xRange.max, yMin: yRange.min, yMax: yRange.max };

    // adjust by direction
    if (this.direction === 'downward') {
      return { xMin: output.xMax, xMax: output.xMin, yMin: output.yMax, yMax: output.yMin };
    }

    return output;
  };

  DataRegion.prototype._drawRegion = function _drawRegion(regionData, group) {
    var self = this;
    var dir = self.direction === 'upward' ? 1 : -1;
    var bbox = self.bbox;
    var pathes = [];
    pathes.push(['M', regionData[0].x, bbox.yMin - self.lineLength * dir]);
    for (var i = 0; i < regionData.length; i++) {
      var p = ['L', regionData[i].x, regionData[i].y];
      pathes.push(p);
    }
    pathes.push(['L', regionData[regionData.length - 1].x, bbox.yMin - self.lineLength * dir]);
    // draw
    group.addShape('path', {
      attrs: Util.mix({
        path: pathes
      }, self.regionStyle)
    });
  };

  DataRegion.prototype._adjustLineLength = function _adjustLineLength(bbox, position) {
    return Math.abs(bbox.yMin - position.y);
  };

  return DataRegion;
}(DataMarker);

module.exports = DataRegion;