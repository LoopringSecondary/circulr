import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'

export function tokenDisplayBalance(tokenSymbol, rawBalance) {
  const tokenConfig = config.getTokenBySymbol(tokenSymbol)
  if(!tokenConfig) {
    throw new Error('Not support token:'+tokenSymbol)
  }
  return fm.toFixed(fm.toBig(rawBalance).div('1e'+tokenConfig.digits), tokenConfig.precision, false)
}

export function calculateAvailableAmount(side, price, tokenL, tokenR, amountPrecision) {
  if(price && tokenL && tokenR) {
    if(side === 'buy') {
      if(price) {
        return fm.toFixed(fm.toBig(tokenR.balanceDisplay).div(price), amountPrecision, false)
      }
    } else {
      return fm.toFixed(fm.toBig(tokenL.balanceDisplay), amountPrecision, false)
    }
  }
  return 0
}

function sliderEffectAmount(availableAmount, percentage, tokenL, tokenR) {
  if(fm.toBig(availableAmount).gt(0)) {
    const marketConfig = config.getMarketBySymbol(tokenL.symbol, tokenR.symbol)
    const amountPrecision = Math.max(0, tokenR.precision - marketConfig.pricePrecision)
    return fm.toFixed(fm.toBig(availableAmount).times(percentage).div(100), amountPrecision, false)
  }
  return 0
}

function amountEffectSlider(availableAmount, amountInput, tokenL, tokenR) {
  if(fm.toBig(availableAmount).gt(0)) {
    return fm.toFixed(fm.toBig(availableAmount).div(amountInput).times(100), 0, true)
  }
  return 0
}

export function sliderChangeEffectAmount(state) {
  return sliderEffectAmount(state[state.side].availableAmount, state.amountSlider, state.left, state.right)
}

export function amountChangeEffectSlider(state) {
  return amountEffectSlider(state[state.side].availableAmount, state.amountInput, state.left, state.right)
}
