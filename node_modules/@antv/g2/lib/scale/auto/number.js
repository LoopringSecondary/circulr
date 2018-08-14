/**
 * @fileOverview 自动计算数字坐标轴
 * @author dxq613@gmail.com
 */

var Util = require('../../util');
var AutoUtil = require('./util');
var MIN_COUNT = 5;
var MAX_COUNT = 7;
var Global = require('../../global');

module.exports = function (info) {
  var min = info.min;
  var max = info.max;
  var interval = info.interval;
  var ticks = [];
  var minCount = info.minCount || MIN_COUNT;
  var maxCount = info.maxCount || MAX_COUNT;
  var isFixedCount = minCount === maxCount; // 是否限定死了个数
  var minLimit = Util.isNil(info.minLimit) ? -Infinity : info.minLimit; // 限定的最小值
  var maxLimit = Util.isNil(info.maxLimit) ? Infinity : info.maxLimit; // 限定最大值
  var avgCount = (minCount + maxCount) / 2;
  var count = avgCount;
  // 用户传入的逼近数组
  var snapArray = info.snapArray ? info.snapArray : isFixedCount ? Global.snapCountArray : Global.snapArray;

  // 如果限定大小范围，同时大小范围等于用户传入的范围，同时限定了个数，interval 按照个数均分
  if (min === minLimit && max === maxLimit && isFixedCount) {
    interval = (max - min) / (count - 1);
  }

  if (Util.isNil(min)) {
    min = 0;
  }
  if (Util.isNil(max)) {
    max = 0;
  }
  if (max === min) {
    if (min === 0) {
      max = 1;
    } else {
      if (min > 0) {
        min = 0;
      } else {
        max = 0;
      }
    }
    if (max - min < 5 && !interval && max - min >= 1) {
      interval = 1;
    }
  }

  if (Util.isNil(interval)) {
    // 计算间距
    var temp = (max - min) / (avgCount - 1);
    interval = AutoUtil.snapFactorTo(temp, snapArray, 'ceil');
    if (maxCount !== minCount) {
      count = parseInt((max - min) / interval, 10);
      if (count > maxCount) {
        count = maxCount;
      }
      if (count < minCount) {
        count = minCount;
      }
      // 不确定tick的个数时，使得tick偏小
      interval = AutoUtil.snapFactorTo((max - min) / (count - 1), snapArray, 'floor');
    }
  }
  if (info.interval || maxCount !== minCount) {
    // 校正 max 和 min
    max = Math.min(AutoUtil.snapMultiple(max, interval, 'ceil'), maxLimit); // 向上逼近
    min = Math.max(AutoUtil.snapMultiple(min, interval, 'floor'), minLimit); // 向下逼近

    count = Math.round((max - min) / interval);
    min = Util.fixedBase(min, interval);
    max = Util.fixedBase(max, interval);
  } else {
    avgCount = parseInt(avgCount, 10); // 取整
    var avg = (max + min) / 2;
    var avgTick = AutoUtil.snapMultiple(avg, interval, 'ceil');
    var sideCount = Math.floor((avgCount - 2) / 2);
    var maxTick = avgTick + sideCount * interval;
    var minTick = void 0;
    if (avgCount % 2 === 0) {
      minTick = avgTick - sideCount * interval;
    } else {
      minTick = avgTick - (sideCount + 1) * interval;
    }
    if (maxTick < max) {
      maxTick = maxTick + interval;
    }
    if (minTick > min) {
      minTick = minTick - interval;
    }
    max = Util.fixedBase(maxTick, interval);
    min = Util.fixedBase(minTick, interval);
  }

  max = Math.min(max, maxLimit);
  min = Math.max(min, minLimit);

  ticks.push(min);
  for (var i = 1; i < count; i++) {
    var tickValue = Util.fixedBase(interval * i + min, interval);
    if (tickValue < max) {
      ticks.push(tickValue);
    }
  }
  if (ticks[ticks.length - 1] < max) {
    ticks.push(max);
  }
  return {
    min: min,
    max: max,
    interval: interval,
    count: count,
    ticks: ticks
  };
};