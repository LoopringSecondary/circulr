import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'
import {getPriceBySymbol} from '../formatter/selectors'

const integerReg = new RegExp("^[0-9]*$")
const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

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
    if(fm.toBig(amountInput).gt(availableAmount)) {
      return  100
    }
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

export function isValidAmount(amount) {
  return amountReg.test(amount)
}

export function isValidInteger(int) {
  return integerReg.test(int)
}

export function formatPriceByMarket(price, marketConfig) {
  const priceArr = price.split(".")
  if(priceArr.length === 2 && priceArr[1].length > marketConfig.pricePrecision){
    return fm.toNumber(fm.toFixed(fm.toNumber(price), marketConfig.pricePrecision), false)
  }
  return price
}

export function formatAmountByMarket(amount, tokenConfig, marketConfig) {
  const amountPrecision = tokenConfig.precision - marketConfig.pricePrecision
  if (amountPrecision > 0) {
    return fm.toNumber(fm.toFixed(amount, amountPrecision, false))
  } else {
    return Math.floor(amount)
  }
}

function calculateWorthInLegalCurrency(symbol, amount) {
  const price = getPriceBySymbol(symbol)
  return amount.times(price)
}

function calculateLrcFeeInEth(totalWorth, milliLrcFee) {
  const price = getPriceBySymbol("ETH")
  return totalWorth.times(milliLrcFee).div(1000).div(fm.toBig(price))
}

function calculateLrcFeeByEth(ethAmount) {
  const ethPrice = getPriceBySymbol("ETH")
  const lrcPrice = getPriceBySymbol("LRC")
  const price = fm.toBig(lrcPrice).div(fm.toBig(ethPrice))
  return fm.toFixed(fm.toBig(ethAmount).div(price), 2, true)
}

export function calculateLrcFee(total, milliLrcFee, tokenR) {
  const totalWorth = calculateWorthInLegalCurrency(tokenR, fm.toBig(total))
  if(totalWorth.lt(0)) {
    return 0
  }
  const percentage = 2; //configs.defaultLrcFeePermillage
  const minimumLrcfeeInEth = 0.034; //configs.minimumLrcfeeInEth
  if (!milliLrcFee) {
    milliLrcFee = Number(percentage)
  }
  let userSetLrcFeeInEth = calculateLrcFeeInEth(totalWorth, milliLrcFee)
  if(userSetLrcFeeInEth.gt(minimumLrcfeeInEth)){
    return calculateLrcFeeByEth(userSetLrcFeeInEth)
  } else {
    return calculateLrcFeeByEth(minimumLrcfeeInEth)
  }
}
