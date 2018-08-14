function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview The controller of guide
 * @author sima.zhang
 */
var Util = require('../../util');
var Guide = require('../../component/guide');

var GuideController = function () {
  function GuideController(cfg) {
    _classCallCheck(this, GuideController);

    this.guides = [];
    this.options = [];
    this.xScales = null;
    this.yScales = null;
    this.view = null;
    this.viewTheme = null;
    this.frontGroup = null;
    this.backGroup = null;
    Util.mix(this, cfg);
  }

  GuideController.prototype._creatGuides = function _creatGuides() {
    var self = this;
    var options = this.options;
    var xScales = this.xScales;
    var yScales = this.yScales;
    var view = this.view;
    var viewTheme = this.viewTheme;
    if (this.backContainer && view) {
      this.backGroup = this.backContainer.addGroup({
        viewId: view.get('_id')
      });
    }
    if (this.frontContainer && view) {
      this.frontGroup = this.frontContainer.addGroup({
        viewId: view.get('_id')
      });
    }
    options.forEach(function (option) {
      var type = option.type;
      var config = Util.deepMix({
        xScales: xScales,
        yScales: yScales,
        view: view,
        viewTheme: viewTheme
      }, viewTheme ? viewTheme.guide[type] : {}, option);
      type = Util.upperFirst(type);
      var guide = new Guide[type](config);
      self.guides.push(guide);
    });
    return self.guides;
  };

  GuideController.prototype.line = function line() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'line'
    }, cfg));
    return this;
  };

  GuideController.prototype.arc = function arc() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'arc'
    }, cfg));
    return this;
  };

  GuideController.prototype.text = function text() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'text'
    }, cfg));
    return this;
  };

  GuideController.prototype.image = function image() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'image'
    }, cfg));
    return this;
  };

  GuideController.prototype.region = function region() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'region'
    }, cfg));
    return this;
  };

  GuideController.prototype.regionFilter = function regionFilter() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'regionFilter'
    }, cfg));
    return this;
  };

  GuideController.prototype.dataMarker = function dataMarker() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'dataMarker'
    }, cfg));
    return this;
  };

  GuideController.prototype.dataRegion = function dataRegion() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'dataRegion'
    }, cfg));
    return this;
  };

  GuideController.prototype.html = function html() {
    var cfg = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    this.options.push(Util.mix({
      type: 'html'
    }, cfg));
    return this;
  };

  GuideController.prototype.render = function render(coord) {
    var _this = this;

    var self = this;
    var guides = self._creatGuides();
    var container = self.backGroup || this.backContainer;

    Util.each(guides, function (guide) {
      if (guide.top) {
        // 默认 guide 绘制到 backPlot，用户也可以声明 top: true，显示在最上层
        container = self.frontGroup || _this.frontContainer;
      }
      guide.render(coord, container);
    });
  };

  GuideController.prototype.clear = function clear() {
    this.options = [];
    this.reset();
  };

  GuideController.prototype.changeVisible = function changeVisible(visible) {
    var guides = this.guides;
    Util.each(guides, function (guide) {
      guide.setVisible(visible);
    });
  };

  GuideController.prototype.reset = function reset() {
    var guides = this.guides;
    Util.each(guides, function (guide) {
      guide.remove();
    });
    this.guides = [];
    this.backGroup && this.backGroup.remove();
    this.frontGroup && this.frontGroup.remove();
  };

  return GuideController;
}();

module.exports = GuideController;