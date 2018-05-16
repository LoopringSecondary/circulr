import validator from 'LoopringJS/common/validator'
import config from 'common/config'
import * as selectors from 'modules/formatter/selectors'

export function validateEthAddress(value) {
  try {
    validator.validate({value: value, type: 'ADDRESS'})
    return true;
  } catch (e) {
    return false;
  }
}

function getToken(tokenItems, symbol) {
  return selectors.getAssetByToken(tokenItems, symbol, true)
}

export const sorter = (tokenA,tokenB)=>{
  const pa = Number(tokenA.balance);
  const pb = Number(tokenB.balance);
  if(pa === pb){
    return tokenA.symbol.toUpperCase() < tokenB.symbol.toUpperCase() ? -1 : 1;
  }else {
    return pb - pa;
  }
};

