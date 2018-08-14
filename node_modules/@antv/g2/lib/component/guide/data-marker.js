function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the data-marker guide
 * @author Ye Liu liuye10@yahoo.com
 */
var Text = require('./text');
var Util = require('../../util');

var DataMarker = function (_Text) {
  _inherits(DataMarker, _Text);

  function DataMarker() {
    _classCallCheck(this, DataMarker);

    return _possibleConstructorReturn(this, _Text.apply(this, arguments));
  }

  DataMarker.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Text.prototype.getDefaultCfg.call(this);

    return Util.mix({}, cfg, {
      type: 'dataMarker',
      zIndex: 1,
      top: true,
      position: null,
      style: {
        point: {
          r: 4,
          fill: '#FFFFFF',
          stroke: '#1890FF',
          lineWidth: 2
        },
        line: {
          stroke: '#000000',
          lineWidth: 1,
          opacity: 0.25
        },
        text: {
          fill: '#000000',
          opacity: 0.65,
          fontSize: 14,
          fontWeight: 500,
          textAlign: 'center'
        }
      }, // end of style
      display: {
        point: true,
        line: true,
        text: true
      },
      lineLength: 30,
      direction: 'upward'
    });
  };

  DataMarker.prototype.render = function render(coord, group) {
    var self = this;
    var position = self.position;
    var point = self.parsePoint(coord, position);
    // container
    var markerGroup = group.addGroup();
    markerGroup.name = 'marker-group';
    markerGroup.translate(point.x, point.y);
    var positions = self._getElementPosition();
    // add line
    if (self.display.line) {
      var lineData = positions.line;
      self._drawLine(lineData, markerGroup);
    }
    // add text
    if (self.display.text && self.content) {
      var textPosition = positions.text;
      self._drawText(textPosition, markerGroup);
    }
    // add circle
    if (self.display.point) {
      var pointPoisition = positions.point;
      self._drawPoint(pointPoisition, markerGroup);
    }
    self.appendInfo && markerGroup.setSilent('marker-group', self.appendInfo);
    self.el = markerGroup;
  };

  DataMarker.prototype.set = function set(field, v) {
    this[field] = v;
  };

  DataMarker.prototype._getElementPosition = function _getElementPosition() {
    var self = this;
    var lineLength = self.display.line ? self.lineLength : 5;
    self.style.text.textBaseline = self.direction === 'upward' ? 'bottom' : 'top';
    var dir = self.direction === 'upward' ? -1 : 1;
    var pointPoisition = { x: 0, y: 0 };
    var lineStart = { x: 0, y: 0 };
    var lineEnd = { x: 0, y: lineLength * dir };
    var textPosition = { x: 0, y: lineLength * dir };

    return { point: pointPoisition, line: [lineStart, lineEnd], text: textPosition };
  };

  DataMarker.prototype._drawLine = function _drawLine(lineData, g) {
    var self = this;
    var lineStyle = self.style.line;
    var linePath = [['M', lineData[0].x, lineData[0].y], ['L', lineData[1].x, lineData[1].y]];
    g.addShape('path', {
      attrs: Util.mix({
        path: linePath
      }, lineStyle)
    });
  };

  DataMarker.prototype._drawText = function _drawText(position, g) {
    var self = this;
    var textStyle = this.style.text;
    g.addShape('text', {
      attrs: Util.mix({
        text: self.content
      }, textStyle, position)
    });
  };

  DataMarker.prototype._drawPoint = function _drawPoint(position, g) {
    var self = this;
    var pointStyle = self.style.point;
    g.addShape('circle', {
      attrs: Util.mix({}, pointStyle, position)
    });
  };

  return DataMarker;
}(Text);

module.exports = DataMarker;