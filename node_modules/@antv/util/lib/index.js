
var arrayUtil = require('./array');
var eventUtil = require('./event');
var mathUtil = require('./math');
var stringUtil = require('./string');
var typeUtil = require('./type');
var each = require('./each');
var mix = require('./mix');

var util = {
  // collections
  arrayUtil: arrayUtil,
  eventUtil: eventUtil,
  mathUtil: mathUtil,
  stringUtil: stringUtil,
  typeUtil: typeUtil,
  // others
  augment: require('./augment'),
  clone: require('./clone'),
  deepMix: require('./deepMix'),
  each: each,
  extend: require('./extend'),
  filter: require('./filter'),
  group: require('./group'),
  groupBy: require('./groupBy'),
  groupToMap: require('./groupToMap'),
  indexOf: require('./indexOf'),
  isEmpty: require('./isEmpty'),
  isEqual: require('./isEqual'),
  isEqualWith: require('./isEqualWith'),
  map: require('./map'),
  mix: mix,
  pick: require('./pick'),
  toArray: require('./toArray'),
  toString: require('./toString'),
  uniqueId: require('./uniqueId')
};

each([arrayUtil, eventUtil, mathUtil, stringUtil, typeUtil], function (collection) {
  mix(util, collection);
});

module.exports = util;