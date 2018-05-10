import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'

export function formatAvaliableAmount(availableAmount, tokenL, tokenR) {
  if(availableAmount >0) {
    const marketConfig = config.getMarketBySymbol(tokenL.symbol, tokenR.symbol)
    const amountPrecision = tokenR.precision - marketConfig.pricePrecision
    if (amountPrecision > 0) {
      availableAmount = fm.toNumber(fm.toFixed(availableAmount, amountPrecision))
    } else {
      availableAmount = Math.floor(availableAmount)
    }
    return availableAmount
  }
}
