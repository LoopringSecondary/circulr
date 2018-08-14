/* eslint-disable no-cond-assign, no-loop-func */
var assign = require('lodash/assign');
var View = require('../view');

assign(View.prototype, {
  getAllNodes: function getAllNodes() {
    var nodes = [];
    this.root.each(function (node) {
      nodes.push(node);
    });
    return nodes;
  },
  getAllLinks: function getAllLinks() {
    var links = [];
    var nodes = [this.root];
    var node = void 0;
    while (node = nodes.pop()) {
      var children = node.children;
      if (children) {
        children.forEach(function (child) {
          links.push({
            source: node,
            target: child
          });
          nodes.push(child);
        });
      }
    }
    return links;
  }
});

assign(View.prototype, {
  getAllEdges: View.prototype.getAllLinks
});