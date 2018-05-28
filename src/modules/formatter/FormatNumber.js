import React, { PropTypes } from 'react';
import {toBig, toFixed} from 'LoopringJS/common/formatter'
import {getFormatNum} from './common'
import { Button, Tooltip } from 'antd';

export const FormatAmount = ({value, precision = 4, tooptip = true})=>{

  const format = (value) => {
    if(isNaN(value)) return {d:0, o:0, s:false};
    const x = toBig(value)
    if(x.lt(9999)) {
      return {d:getFormatNum(toFixed(x, precision)), o:x.toString(10), s:false};
    }
    if(x.lt(1000000)) {
      const shortNumber = toFixed(x.div(1000), precision)
      return {d:`${getFormatNum(shortNumber)}K`, o:x.toString(10), s:true};
    }
    if(x.lt(10000000)) {
      const shortNumber = toFixed(x.div(1000000), precision)
      return {d:`${getFormatNum(shortNumber)}M`, o:x.toString(10), s:true};
    }
    if(x.lt(1000000000000)) {
      const shortNumber = toFixed(x.div(1000000000), precision)
      return {d:`${getFormatNum(shortNumber)}B`, o:x.toString(10), s:true};
    }
    return {d:"1T+", o:x.toString(10), s:true};
  }

  const formatted = format(value)

  return (
    <span>
      {tooptip &&
      <Tooltip placement="top" title={formatted.o}>
        {formatted.d}
      </Tooltip>
      }
      {!tooptip &&
        formatted.d
      }
    </span>
  )
}

