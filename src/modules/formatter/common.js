import * as moment from 'moment';
import {toBig, toFixed, toNumber} from "LoopringJS/common/formatter";
import intl from 'react-intl-universal';

export function getShortAddress(address) {
  if (typeof address === 'string') {
    return address.slice(0, 8) + '...' + address.slice(-6)
  } else {
    throw new Error('address must be string')
  }
}

export function getFormatTime(seconds, style) {
  style = style || "lll";
  return moment(toNumber(seconds)).format(style);
}

export function getFormattedTime(timestamp = '0', format = "YYYY-MM-DD hh:mm:ss") {
  return moment(timestamp, 'X').format(format)
}

export function getSeconds(value, unit) {
  value = Number(value);
  switch (unit) {
    case 'second':
      return value;
    case 'minute':
      return value * 60;
    case 'hour':
      return value * 3600;
    case 'day':
      return value * 3600 * 24;
    default:
      return value;
  }
}

// locales for number format
export function getFormatNum(number) {
  number = toBig(number).toString(10).split('.');
  let a = number[0];
  let b = number[1];
  a = intl.get('global.amount', {amount: toNumber(a)});
  const symbol = window.locale && window.locale.startsWith('fr') ? ',' : '.';
  return b ? a.concat(symbol).concat(b) : a
}

export function formatLength(value, ceil) {
  value = Number(value)
  // fix bug: value == string
  if (value && typeof value === 'number') {
  } else {
    value = 0
  }
  if (value > 1000) {
    return toFixed(value, 2, ceil)
  }
  if (value <= 1000 && value >= 1) {
    return toFixed(value, 2, ceil)
  }
  if (value < 1 && value >= 0.001) {
    return toFixed(value, 5, ceil)
  }
  if (value < 0.001 && value > 0) {
    return toFixed(value, 8, ceil)
  }
  if (value === 0) {
    return 0.00
  }
}


export default {
  getShortAddress,
  getFormatTime,
  getFormattedTime,
  getSeconds,
  getFormatNum,
  formatLength
}
