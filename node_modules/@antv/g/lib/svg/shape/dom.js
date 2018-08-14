var Util = require('../../util/index');
var Shape = require('../core/shape');

var Dom = function Dom(cfg) {
  Dom.superclass.constructor.call(this, cfg);
};

Util.extend(Dom, Shape);

Util.augment(Dom, {
  canFill: true,
  canStroke: true,
  type: 'dom',
  _afterSetAttrHtml: function _afterSetAttrHtml() {
    var html = this.__attrs.html;
    var el = this.get('el');
    if (typeof html === 'string') {
      el.innerHTML = html;
    } else {
      el.innerHTML = '';
      el.appendChild(html);
    }
  },
  _afterSetAttrAll: function _afterSetAttrAll(objs) {
    if ('html' in objs) {
      this._afterSetAttrHtml();
    }
  }
});

module.exports = Dom;