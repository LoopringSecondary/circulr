function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = require('./node');

var Layout = function () {
  function Layout(root) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, Layout);

    var me = this;
    me.options = options;
    me.rootNode = new Node(root, options);
  }

  Layout.prototype.execute = function execute() {
    throw new Error('please override this method');
  };

  return Layout;
}();

module.exports = Layout;