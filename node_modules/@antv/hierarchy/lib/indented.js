function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TreeLayout = require('./layout/base');
var indentedTree = require('./layout/indented');
var separateTree = require('./layout/separate-root');

var VALID_DIRECTIONS = ['LR', // left to right
'RL', // right to left
'H' // horizontal
];
var DEFAULT_DIRECTION = VALID_DIRECTIONS[0];

var IndentedLayout = function (_TreeLayout) {
  _inherits(IndentedLayout, _TreeLayout);

  function IndentedLayout() {
    _classCallCheck(this, IndentedLayout);

    return _possibleConstructorReturn(this, _TreeLayout.apply(this, arguments));
  }

  IndentedLayout.prototype.execute = function execute() {
    var me = this;
    var options = me.options;
    var root = me.rootNode;
    options.isHorizontal = true;
    var indent = options.indent;
    var direction = options.direction || DEFAULT_DIRECTION;
    if (direction && VALID_DIRECTIONS.indexOf(direction) === -1) {
      throw new TypeError('Invalid direction: ' + direction);
    }
    if (direction === VALID_DIRECTIONS[0]) {
      // LR
      indentedTree(root, indent);
    } else if (direction === VALID_DIRECTIONS[1]) {
      // RL
      indentedTree(root, indent);
      root.right2left();
    } else if (direction === VALID_DIRECTIONS[2]) {
      // H
      // separate into left and right trees
      var _separateTree = separateTree(root, options),
          left = _separateTree.left,
          right = _separateTree.right;

      indentedTree(left, indent);
      left.right2left();
      indentedTree(right, indent);
      var bbox = left.getBoundingBox();
      right.translate(bbox.width, 0);
      root.x = right.x - root.width / 2;
    }
    return root;
  };

  return IndentedLayout;
}(TreeLayout);

var DEFAULT_OPTIONS = {};

function indentedLayout(root, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  return new IndentedLayout(root, options).execute();
}

module.exports = indentedLayout;