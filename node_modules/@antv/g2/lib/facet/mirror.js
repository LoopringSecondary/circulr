function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview mirror facets
 * @author dxq613@gmail.com
 */

var List = require('./list');

var Mirror = function (_List) {
  _inherits(Mirror, _List);

  function Mirror() {
    _classCallCheck(this, Mirror);

    return _possibleConstructorReturn(this, _List.apply(this, arguments));
  }

  Mirror.prototype.getDefaultCfg = function getDefaultCfg() {
    var cfg = _List.prototype.getDefaultCfg.call(this);
    cfg.type = 'mirror';
    this.transpose = false;
    return cfg;
  };

  Mirror.prototype.init = function init() {
    var self = this;
    if (self.transpose) {
      self.cols = 2;
      self.rows = 1;
    } else {
      self.cols = 1;
      self.rows = 2;
    }
    _List.prototype.init.call(this);
  };

  Mirror.prototype.beforeProcessView = function beforeProcessView(view, facet) {
    if (this.transpose) {
      if (facet.colIndex % 2 === 0) {
        view.coord().transpose().scale(-1, 1);
      } else {
        view.coord().transpose();
      }
    } else {
      if (facet.rowIndex % 2 !== 0) {
        view.coord().scale(1, -1);
      }
    }
  };

  Mirror.prototype.renderTitle = function renderTitle(view, facet) {
    if (this.transpose) {
      this.drawColTitle(view, facet);
    } else {
      this.drawRowTitle(view, facet);
    }
  };

  Mirror.prototype.setXAxis = function setXAxis(xField, axes, facet) {
    // 当是最后一行或者下面没有 view 时文本不显示
    if (facet.colIndex === 1 || facet.rowIndex === 1) {
      axes[xField].label = null;
      axes[xField].title = null;
    }
  };

  Mirror.prototype.setYAxis = function setYAxis() /* yField, axes, facet */{};

  return Mirror;
}(List);

module.exports = Mirror;