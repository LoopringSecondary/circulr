function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview the class of Cartesian Coordinate
 * @author sima.zhang
 */
var Util = require('../util');
var Base = require('./base');

var Cartesian = function (_Base) {
  _inherits(Cartesian, _Base);

  /**
   * @override
   */
  Cartesian.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _Base.prototype.getDefaultCfg.call(this);
    return Util.mix({}, cfg, {
      start: {
        x: 0,
        y: 0
      },
      end: {
        x: 0,
        y: 0
      },
      type: 'cartesian',
      isRect: true
    });
  };

  function Cartesian(cfg) {
    _classCallCheck(this, Cartesian);

    var _this = _possibleConstructorReturn(this, _Base.call(this, cfg));

    _this._init();
    return _this;
  }

  Cartesian.prototype._init = function _init() {
    var start = this.start,
        end = this.end;

    var x = {
      start: start.x,
      end: end.x
    };
    var y = {
      start: start.y,
      end: end.y
    };
    this.x = x;
    this.y = y;
  };

  Cartesian.prototype.convertPoint = function convertPoint(point) {
    var x = void 0;
    var y = void 0;
    if (this.isTransposed) {
      x = point.y;
      y = point.x;
    } else {
      x = point.x;
      y = point.y;
    }

    return {
      x: this.convertDim(x, 'x'),
      y: this.convertDim(y, 'y')
    };
  };

  Cartesian.prototype.invertPoint = function invertPoint(point) {
    var x = this.invertDim(point.x, 'x');
    var y = this.invertDim(point.y, 'y');

    if (this.isTransposed) {
      return {
        x: y,
        y: x
      };
    }

    return {
      x: x,
      y: y
    };
  };

  return Cartesian;
}(Base);

module.exports = Cartesian;