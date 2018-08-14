'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
var G2 = require('@antv/g2');
var registerShape = exports.registerShape = function registerShape(geoName, shapeName, shapeFun) {
    G2.Shape.registerShape(geoName, shapeName, shapeFun);
};
var registerAnimation = exports.registerAnimation = function registerAnimation(animationType, animationName, animationFun) {
    G2.Animate.registerAnimation(animationType, animationName, animationFun);
};
//# sourceMappingURL=CustomizeUtils.js.map