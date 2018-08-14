"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
var degreeToRadian = exports.degreeToRadian = function degreeToRadian(angle) {
    return angle * Math.PI / 180;
};
var radianToDegree = exports.radianToDegree = function radianToDegree(angleInRadian) {
    return angleInRadian * 180 / Math.PI;
};
var polarToCartesian = exports.polarToCartesian = function polarToCartesian(cx, cy, radius, angle) {
    var radian = degreeToRadian(angle);
    return {
        x: cx + Math.cos(radian) * radius,
        y: cy + Math.sin(radian) * radius
    };
};
//# sourceMappingURL=PolarUtils.js.map