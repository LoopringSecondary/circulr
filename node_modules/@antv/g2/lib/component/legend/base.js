function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * @fileOverview The base class of legend
 * @author sima.zhang
 */
var Util = require('../../util');

var _require = require('../../renderer'),
    Group = _require.Group;

var Global = require('../../global');

var Base = function (_Group) {
  _inherits(Base, _Group);

  function Base() {
    _classCallCheck(this, Base);

    return _possibleConstructorReturn(this, _Group.apply(this, arguments));
  }

  Base.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * 图例标题配置
       * @type {Object}
       */
      title: {
        fill: '#333',
        textBaseline: 'middle'
      },
      /**
       * 图例项文本格式化
       * @type {Function}
       */
      itemFormatter: null,
      /**
       * 是否使用 html 进行渲染
       * @type {Boolean}
       */
      useHtml: false,
      /**
       * 图例是否绘制在绘图区域内
       * @type {Boolean}
       */
      inPlot: false,
      /**
       * 鼠标 hover 到图例上的默认交互是否开启
       * @type {Boolean}
       */
      hoverable: true
    };
  };

  Base.prototype._beforeRenderUI = function _beforeRenderUI() {
    var group = this.addGroup();
    group.set('viewId', this.get('viewId'));
    this.set('itemsGroup', group);
  };

  Base.prototype._renderUI = function _renderUI() {
    this._renderTitle();
  };

  Base.prototype._renderTitle = function _renderTitle() {
    var title = this.get('title');
    var viewTheme = this.get('viewTheme') || Global;
    if (title && title.text) {
      var titleShape = this.addShape('text', {
        attrs: Util.mix({
          x: 0,
          y: 0,
          fill: '#333', // 默认样式
          textBaseline: 'middle',
          fontFamily: viewTheme.fontFamily
        }, title)
      });
      titleShape.name = 'legend-title';
      this.get('appendInfo') && titleShape.setSilent('appendInfo', this.get('appendInfo'));
      this.set('titleShape', titleShape);
    }
  };

  Base.prototype.getCheckedCount = function getCheckedCount() {
    var itemsGroup = this.get('itemsGroup');
    var items = itemsGroup.get('children');
    var checkedArr = Util.filter(items, function (item) {
      return item.get('checked');
    });
    return checkedArr.length;
  };

  Base.prototype.setItems = function setItems(items) {
    this.set('items', items);
    this.clearItems();
    this._renderUI();
  };

  Base.prototype.addItem = function addItem(item) {
    var items = this.get('items');
    items.push(item);
    this.clearItems();
    this._renderUI();
  };

  Base.prototype.clearItems = function clearItems() {
    var itemsGroup = this.get('itemsGroup');
    itemsGroup.clear();
  };

  Base.prototype.getWidth = function getWidth() {
    var bbox = this.getBBox();
    return bbox.width;
  };

  Base.prototype.getHeight = function getHeight() {
    var bbox = this.getBBox();
    return bbox.height;
  };

  return Base;
}(Group);

module.exports = Base;