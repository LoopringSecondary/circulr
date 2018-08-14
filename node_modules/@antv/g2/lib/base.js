function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview Chart、View、Geometry 的基类
 * @author dxq613@gmail.com
 */

var EventEmitter = require('wolfy87-eventemitter');
var Util = require('./util');

var Base = function (_EventEmitter) {
  _inherits(Base, _EventEmitter);

  Base.prototype.getDefaultCfg = function getDefaultCfg() {
    return {};
  };

  function Base(cfg) {
    _classCallCheck(this, Base);

    var _this = _possibleConstructorReturn(this, _EventEmitter.call(this));

    var attrs = {
      visible: true
    };
    var defaultCfg = _this.getDefaultCfg();
    _this._attrs = attrs;
    Util.assign(attrs, defaultCfg, cfg);
    return _this;
  }

  Base.prototype.get = function get(name) {
    return this._attrs[name];
  };

  Base.prototype.set = function set(name, value) {
    this._attrs[name] = value;
  };

  Base.prototype.show = function show() {
    var visible = this.get('visible');
    if (!visible) {
      this.set('visible', true);
      this.changeVisible(true);
    }
  };

  Base.prototype.hide = function hide() {
    var visible = this.get('visible');
    if (visible) {
      this.set('visible', false);
      this.changeVisible(false);
    }
  };

  /**
   * @protected
   * @param {Boolean} visible 是否可见
   * 显示、隐藏
   */


  Base.prototype.changeVisible = function changeVisible() /* visible */{};

  Base.prototype.destroy = function destroy() {
    this._attrs = {};
    this.removeAllListeners();
    this.destroyed = true;
  };

  return Base;
}(EventEmitter);

module.exports = Base;