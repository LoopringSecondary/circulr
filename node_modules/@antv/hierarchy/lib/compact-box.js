function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');
var nonLayeredTidyTree = require('./layout/non-layered-tidy');
var doTreeLayout = require('./layout/do-layout');

var CompactBoxTreeLayout = function (_TreeLayout) {
  _inherits(CompactBoxTreeLayout, _TreeLayout);

  function CompactBoxTreeLayout() {
    _classCallCheck(this, CompactBoxTreeLayout);

    return _possibleConstructorReturn(this, _TreeLayout.apply(this, arguments));
  }

  CompactBoxTreeLayout.prototype.execute = function execute() {
    var me = this;
    var root = doTreeLayout(me.rootNode, me.options, nonLayeredTidyTree);
    root.translate(-(root.x + root.width / 2 + root.hgap), -(root.y + root.height / 2 + root.vgap));
    return root;
  };

  return CompactBoxTreeLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function compactBoxLayout(root, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  return new CompactBoxTreeLayout(root, options).execute();
}

module.exports = compactBoxLayout;