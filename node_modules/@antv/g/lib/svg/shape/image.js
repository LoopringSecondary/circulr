var Util = require('../../util/index');
var Shape = require('../core/shape');

var CImage = function CImage(cfg) {
  CImage.superclass.constructor.call(this, cfg);
};

CImage.ATTRS = {
  x: 0,
  y: 0,
  img: undefined,
  width: 0,
  height: 0,
  sx: null,
  sy: null,
  swidth: null,
  sheight: null
};

Util.extend(CImage, Shape);

Util.augment(CImage, {
  type: 'image',
  _afterSetAttrImg: function _afterSetAttrImg(img) {
    this._setAttrImg(img);
  },
  _afterSetAttrAll: function _afterSetAttrAll(params) {
    if (params.img) {
      this._setAttrImg(params.img);
    }
  },
  _setAttrImg: function _setAttrImg(image) {
    var self = this;
    var el = this.get('el');
    var attrs = self.__attrs;
    var img = image;

    if (Util.isString(img)) {
      // 如果传入的
      el.setAttribute('href', img);
    } else if (img instanceof Image) {
      if (!attrs.width) {
        self.attr('width', img.width);
      }
      if (!attrs.height) {
        self.attr('height', img.height);
      }
      el.setAttribute('href', img.src);
    } else if (img instanceof HTMLElement && Util.isString(img.nodeName) && img.nodeName.toUpperCase() === 'CANVAS') {
      el.setAttribute('href', img.toDataURL());
    } else if (img instanceof ImageData) {
      var canvas = document.createElement('canvas');
      canvas.setAttribute('width', img.width);
      canvas.setAttribute('height', img.height);
      canvas.getContext('2d').putImageData(img, 0, 0);
      if (!attrs.width) {
        self.attr('width', img.width);
      }

      if (!attrs.height) {
        self.attr('height', img.height);
      }
      el.setAttribute('href', canvas.toDataURL());
    }
  },
  drawInner: function drawInner() {}
});

module.exports = CImage;