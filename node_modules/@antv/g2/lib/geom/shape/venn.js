/**
 * @fileOverview venn shapes
 * @author leungwensen@gmail.com
 */
var Util = require('../../util');
var Shape = require('./shape');
var Global = require('../../global');
var PathUtil = Util.PathUtil;

function getAttrs(cfg) {
  var defaultCfg = Global.shape.venn;
  var shapeCfg = Util.mix({}, defaultCfg, {
    stroke: cfg.color,
    fill: cfg.color,
    fillOpacity: cfg.opacity
  }, cfg.style);
  return shapeCfg;
}

function getHollowAttrs(cfg) {
  var defaultCfg = Global.shape.hollowVenn;
  var shapeCfg = Util.mix({}, defaultCfg, {
    stroke: cfg.color,
    strokeOpacity: cfg.opacity
  }, cfg.style);
  return shapeCfg;
}

// register venn geom
var Venn = Shape.registerFactory('venn', {
  defaultShapeType: 'venn',
  getDefaultPoints: function getDefaultPoints(pointInfo) {
    var points = [];
    Util.each(pointInfo.x, function (subX, index) {
      var subY = pointInfo.y[index];
      points.push({
        x: subX,
        y: subY
      });
    });
    return points;
  },
  getActiveCfg: function getActiveCfg(type, cfg) {
    var lineWidth = cfg.lineWidth || 1;
    if (type === 'hollow') {
      return {
        lineWidth: lineWidth + 1
      };
    }

    var opacity = cfg.fillOpacity || cfg.opacity || 1;
    return {
      // lineWidth,
      fillOpacity: opacity - 0.08
    };
  },
  getSelectedCfg: function getSelectedCfg(type, cfg) {
    if (cfg && cfg.style) {
      return cfg.style;
    }
    return this.getActiveCfg(type, cfg);
  }
});

Shape.registerShape('venn', 'venn', {
  draw: function draw(cfg, container) {
    var origin = cfg.origin._origin;
    var path = origin.path;
    var attrs = getAttrs(cfg);
    var segments = PathUtil.parsePathString(path);

    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: segments
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getAttrs(cfg));
  }
});

Shape.registerShape('venn', 'hollow', {
  draw: function draw(cfg, container) {
    var origin = cfg.origin._origin;
    var path = origin.path;
    var attrs = getHollowAttrs(cfg);
    var segments = PathUtil.parsePathString(path);

    var pathShape = container.addShape('path', {
      attrs: Util.mix(attrs, {
        path: segments
      })
    });
    return pathShape;
  },
  getMarkerCfg: function getMarkerCfg(cfg) {
    return Util.mix({
      symbol: 'circle',
      radius: 4
    }, getAttrs(cfg));
  }
});

module.exports = Venn;