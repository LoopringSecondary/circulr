import React, { PropTypes } from 'react';
let colors = {}
let icons = {}
const CoinIcon = (props)=>{
  let {symbol='LRC',size='50',color='',className="",style={} } = props
  symbol = symbol.toUpperCase()
  if(!color){
    // color = 'color-'+ colors[symbol] || ''
    color = 'color-grey-900'
  }else{
    color = 'color-'+ color
  }
  if(icons[symbol.toUpperCase()]){
    return <i className={`icon icon-loopring icon-loopring-${symbol} fs${size} ${color} ${className}`} />
  }else{
    return <i className={`icon icon-loopring color-grey-300 icon-loopring-ETH fs${size} ${className}`} />
  }

}
export default CoinIcon
