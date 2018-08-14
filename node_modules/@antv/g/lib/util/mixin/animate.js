var MatrixUtil = require('../matrix');
var PathUtil = require('../path');
var Util = require('../index');
var d3Ease = require('d3-ease');
var d3Timer = require('d3-timer');

var _require = require('d3-interpolate'),
    interpolate = _require.interpolate,
    interpolateArray = _require.interpolateArray; // 目前整体动画只需要数值和数组的差值计算


var ReservedProps = {
  delay: 'delay'
};
module.exports = {
  stopAnimate: function stopAnimate() {
    var self = this;
    var canvas = self.get('canvas');
    if (self.get('destroyed')) {
      return;
    }
    if (self.get('animating')) {
      var clip = self.attr('clip');
      // 如果 clip 在执行动画
      if (clip && clip.get('animating')) {
        clip.stopAnimate();
      }
      var timer = self.get('animateTimer');
      if (timer) {
        timer.stop();
        self.setSilent('animateTimer', null);
      }
      var animateCfg = self.get('animateCfg');
      if (animateCfg) {
        self.attr(animateCfg.toAttrs);
        if (animateCfg.toM) {
          self.setMatrix(animateCfg.toM);
        }
        if (animateCfg.callback) {
          animateCfg.callback();
        }
        self.setSilent('animateCfg', null);
      }
      self.setSilent('animating', false); // 动画停止
      canvas.draw();
    }
  },

  /**
   * 执行动画
   * @param  {Object}   toProps  动画最终状态
   * @param  {Number}   duration 动画执行时间
   * @param  {String}   easing   动画缓动效果
   * @param  {Function} callback 动画执行后的回调
   * @param  {Number}   delay    动画延迟时间
   */
  animate: function animate(toProps, duration, easing, callback) {
    var delay = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 0;

    var self = this;
    var canvas = self.get('canvas');
    var formatProps = getFormatProps(toProps);
    var toAttrs = formatProps.attrs;
    var toM = formatProps.M;
    var fromAttrs = getfromAttrs(toAttrs);
    var fromM = Util.clone(self.getMatrix());
    var repeat = toProps.repeat;
    var timer = self.get('animateTimer');
    timer && timer.stop();
    // 可能不设置 easing
    if (Util.isNumber(callback)) {
      delay = callback;
      callback = null;
    }
    if (Util.isFunction(easing)) {
      callback = easing;
      easing = 'easeLinear';
    } else {
      easing = easing ? easing : 'easeLinear';
    }

    self.setSilent('animating', true); // 处于动画状态
    self.setSilent('animateCfg', {
      toAttrs: toAttrs,
      toM: toM,
      callback: callback
    });

    // 执行动画
    timer = d3Timer.timer(function (elapsed) {
      if (repeat) {
        excuteRepeat(elapsed);
      } else {
        excuteOnce(elapsed);
      }
    }, delay);

    self.setSilent('animateTimer', timer);

    function excuteRepeat(elapsed) {
      var ratio = elapsed % duration / duration;
      ratio = d3Ease[easing](ratio);
      update(ratio);
    }

    function excuteOnce(elapsed) {
      var ratio = elapsed / duration;
      if (ratio < 1) {
        ratio = d3Ease[easing](ratio);
        update(ratio);
      } else {
        update(1); // 保证最后一帧的绘制
        callback && callback();
        self.setSilent('animating', false); // 动画停止
        self.setSilent('animateCfg', null);
        self.setSilent('animateTimer', null);
        timer.stop();
      }
    }

    function update(ratio) {
      var cProps = {}; // 此刻属性
      if (self.get('destroyed')) {
        return;
      }
      var interf = void 0; //  差值函数

      for (var k in toAttrs) {
        if (!Util.isEqual(fromAttrs[k], toAttrs[k])) {
          if (k === 'path') {
            var toPath = PathUtil.parsePathString(toAttrs[k]); // 终点状态
            var fromPath = PathUtil.parsePathString(fromAttrs[k]); // 起始状态
            cProps[k] = [];
            for (var i = 0; i < toPath.length; i++) {
              var toPathPoint = toPath[i];
              var fromPathPoint = fromPath[i];
              var cPathPoint = [];
              for (var j = 0; j < toPathPoint.length; j++) {
                if (Util.isNumber(toPathPoint[j]) && fromPathPoint) {
                  interf = interpolate(fromPathPoint[j], toPathPoint[j]);
                  cPathPoint.push(interf(ratio));
                } else {
                  cPathPoint.push(toPathPoint[j]);
                }
              }
              cProps[k].push(cPathPoint);
            }
          } else {
            interf = interpolate(fromAttrs[k], toAttrs[k]);
            cProps[k] = interf(ratio);
          }
        }
      }
      if (toM) {
        var mf = interpolateArray(fromM, toM);
        var cM = mf(ratio);
        self.setMatrix(cM);
      }
      self.attr(cProps);
      canvas.draw();
    }

    function getFormatProps(props) {
      var rst = {
        M: null,
        attrs: {}
      };
      for (var k in props) {
        if (k === 'transform') {
          rst.M = MatrixUtil.transform(self.getMatrix(), props[k]);
        } else if (k === 'matrix') {
          rst.M = props[k];
        } else if (!ReservedProps[k]) {
          rst.attrs[k] = props[k];
        }
      }
      return rst;
    }

    function getfromAttrs(toAttrs) {
      var rst = {};
      for (var k in toAttrs) {
        rst[k] = self.attr(k);
      }
      return rst;
    }
  }
};