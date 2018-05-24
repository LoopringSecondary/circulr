import {calculateGas} from 'LoopringJS/common/utils'

const integerReg = new RegExp("^[0-9]*$")
const amountReg = new RegExp("^(([0-9]+\\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\\.[0-9]+)|([0-9]*[1-9][0-9]*))$")

export function isValidAmount(amount) {
  return amountReg.test(amount)
}

export function isValidInteger(int) {
  return int && integerReg.test(int)
}

export function getLastGas(gasStore){
  const gasPriceStore = gasStore.gasPrice
  const gasLimitStore = gasStore.gasLimit
  const gasPrice = gasPriceStore.last
  const totalGas = calculateGas(gasPrice, gasLimitStore)
  return {gasPrice, gasLimit:gasLimitStore, gas:totalGas}
}

export function getEstimateGas(gasStore, gasLimit){
  const gasPriceStore = gasStore.gasPrice
  const gasPrice = gasPriceStore.estimate
  const totalGas = calculateGas(gasPrice, gasLimit)
  return {gasPrice, gasLimit, gas:totalGas}
}
