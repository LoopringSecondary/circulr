
var DEFAULT_INDENT = 20;
function positionNode(node, previousNode, dx) {
  node.x += dx * node.depth;
  node.y = previousNode ? previousNode.y + previousNode.height : 0;
}
module.exports = function (root) {
  var indent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : DEFAULT_INDENT;

  var previousNode = null;
  root.eachNode(function (node) {
    positionNode(node, previousNode, indent);
    previousNode = node;
  });
};