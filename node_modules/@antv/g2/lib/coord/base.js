function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * @fileOverview the base class of Coordinate
 * @author sima.zhang
 */
var Util = require('../util');
var MatrixUtil = Util.MatrixUtil;
var mat3 = MatrixUtil.mat3;
var vec3 = MatrixUtil.vec3;

var Coord = function () {
  /**
   * 获取默认的配置属性
   * @protected
   * @return {Object} 默认属性
   */
  Coord.prototype.getDefaultCfg = function getDefaultCfg() {
    return {
      /**
       * Mark x y is transposed.
       * @type {Boolean}
       */
      isTransposed: false,
      /**
       * The matrix of coordinate
       * @type {Array}
       */
      matrix: [1, 0, 0, 0, 1, 0, 0, 0, 1]
    };
  };

  function Coord(cfg) {
    _classCallCheck(this, Coord);

    var defaultCfg = this.getDefaultCfg();
    Util.mix(this, defaultCfg, cfg);
    this.init();
  }

  Coord.prototype.init = function init() {
    var start = this.start;
    var end = this.end;
    var center = {
      x: (start.x + end.x) / 2,
      y: (start.y + end.y) / 2
    };

    this.center = center;
    this.width = Math.abs(end.x - start.x);
    this.height = Math.abs(end.y - start.y);
  };

  Coord.prototype._swapDim = function _swapDim(dim) {
    var dimRange = this[dim];
    if (dimRange) {
      var tmp = dimRange.start;
      dimRange.start = dimRange.end;
      dimRange.end = tmp;
    }
  };

  Coord.prototype.getCenter = function getCenter() {
    return this.center;
  };

  Coord.prototype.getWidth = function getWidth() {
    return this.width;
  };

  Coord.prototype.getHeight = function getHeight() {
    return this.height;
  };

  Coord.prototype.convertDim = function convertDim(percent, dim) {
    var _dim = this[dim],
        start = _dim.start,
        end = _dim.end;

    return start + percent * (end - start);
  };

  Coord.prototype.invertDim = function invertDim(value, dim) {
    var _dim2 = this[dim],
        start = _dim2.start,
        end = _dim2.end;

    return (value - start) / (end - start);
  };

  /**
   * 将归一化的坐标点数据转换为画布坐标
   * @override
   * @param  {Object} point 归一化的坐标点
   * @return {Object}       返回画布坐标
   */


  Coord.prototype.convertPoint = function convertPoint(point) {
    return point;
  };

  /**
   * 将画布坐标转换为归一化的坐标点数据
   * @override
   * @param  {Object} point 画布坐标点数据
   * @return {Object}       归一化后的数据点
   */


  Coord.prototype.invertPoint = function invertPoint(point) {
    return point;
  };

  /**
   * 将坐标点进行矩阵变换
   * @param  {Number} x   对应 x 轴画布坐标
   * @param  {Number} y   对应 y 轴画布坐标
   * @param  {Number} tag 默认为 0，可取值 0, 1
   * @return {Array}     返回变换后的三阶向量 [x, y, z]
   */


  Coord.prototype.applyMatrix = function applyMatrix(x, y) {
    var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var matrix = this.matrix;
    var vector = [x, y, tag];
    vec3.transformMat3(vector, vector, matrix);
    return vector;
  };

  /**
   * 将坐标点进行矩阵逆变换
   * @param  {Number} x   对应 x 轴画布坐标
   * @param  {Number} y   对应 y 轴画布坐标
   * @param  {Number} tag 默认为 0，可取值 0, 1
   * @return {Array}     返回矩阵逆变换后的三阶向量 [x, y, z]
   */


  Coord.prototype.invertMatrix = function invertMatrix(x, y) {
    var tag = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

    var matrix = this.matrix;
    var inversedMatrix = mat3.invert([], matrix);
    var vector = [x, y, tag];
    vec3.transformMat3(vector, vector, inversedMatrix);
    return vector;
  };

  /**
   * 将归一化的坐标点数据转换为画布坐标，并根据坐标系当前矩阵进行变换
   * @param  {Object} point 归一化的坐标点
   * @return {Object}       返回进行矩阵变换后的画布坐标
   */


  Coord.prototype.convert = function convert(point) {
    var _convertPoint = this.convertPoint(point),
        x = _convertPoint.x,
        y = _convertPoint.y;

    var vector = this.applyMatrix(x, y, 1);
    return {
      x: vector[0],
      y: vector[1]
    };
  };

  /**
   * 将进行过矩阵变换画布坐标转换为归一化坐标
   * @param  {Object} point 画布坐标
   * @return {Object}       返回归一化的坐标点
   */


  Coord.prototype.invert = function invert(point) {
    var vector = this.invertMatrix(point.x, point.y, 1);
    return this.invertPoint({
      x: vector[0],
      y: vector[1]
    });
  };

  /**
   * 坐标系旋转变换
   * @param  {Number} radian 旋转弧度
   * @return {Object}        返回坐标系对象
   */


  Coord.prototype.rotate = function rotate(radian) {
    var matrix = this.matrix;
    var center = this.center;
    mat3.translate(matrix, matrix, [-center.x, -center.y]);
    mat3.rotate(matrix, matrix, radian);
    mat3.translate(matrix, matrix, [center.x, center.y]);
    return this;
  };

  /**
   * 坐标系反射变换
   * @param  {String} dim 反射维度
   * @return {Object}     返回坐标系对象
   */


  Coord.prototype.reflect = function reflect(dim) {
    switch (dim) {
      case 'x':
        this._swapDim('x');
        break;
      case 'y':
        this._swapDim('y');
        break;
      default:
        this._swapDim('y');
    }
    return this;
  };

  /**
   * 坐标系比例变换
   * @param  {Number} s1 x 方向缩放比例
   * @param  {Number} s2 y 方向缩放比例
   * @return {Object}    返回坐标系对象
   */


  Coord.prototype.scale = function scale(s1, s2) {
    var matrix = this.matrix;
    var center = this.center;
    mat3.translate(matrix, matrix, [-center.x, -center.y]);
    mat3.scale(matrix, matrix, [s1, s2]);
    mat3.translate(matrix, matrix, [center.x, center.y]);
    return this;
  };

  /**
   * 坐标系平移变换
   * @param  {Number} x x 方向平移像素
   * @param  {Number} y y 方向平移像素
   * @return {Object}   返回坐标系对象
   */


  Coord.prototype.translate = function translate(x, y) {
    var matrix = this.matrix;
    mat3.translate(matrix, matrix, [x, y]);
    return this;
  };

  /**
   * 将坐标系 x y 两个轴进行转置
   * @return {Object} 返回坐标系对象
   */


  Coord.prototype.transpose = function transpose() {
    this.isTransposed = !this.isTransposed;
    return this;
  };

  return Coord;
}();

module.exports = Coord;