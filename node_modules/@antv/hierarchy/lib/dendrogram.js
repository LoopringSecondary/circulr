function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');
var dendrogram = require('./layout/dendrogram');
var doTreeLayout = require('./layout/do-layout');

var DendrogramLayout = function (_TreeLayout) {
  _inherits(DendrogramLayout, _TreeLayout);

  function DendrogramLayout() {
    _classCallCheck(this, DendrogramLayout);

    return _possibleConstructorReturn(this, _TreeLayout.apply(this, arguments));
  }

  DendrogramLayout.prototype.execute = function execute() {
    var me = this;
    me.rootNode.width = 0;
    return doTreeLayout(me.rootNode, me.options, dendrogram);
  };

  return DendrogramLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function dendrogramLayout(root, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  return new DendrogramLayout(root, options).execute();
}

module.exports = dendrogramLayout;