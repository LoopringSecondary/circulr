import {keccakHash} from 'LoopringJS/common/utils'
import {toHex, toNumber} from "LoopringJS/common/formatter";
import config from '../../common/config'


export default {

  namespace: 'flexCancelOrder',
  state: {
    type: '',
    tokenS: '',
    tokenB: '',
    orderHash: '',
    market:''
  },
  reducers: {
    reset(state, {payload}) {
      return {
        type: '',
        tokenS: '',
        tokenB: '',
        orderHash: '',
        market:''
      }
    },
    setType(state, {payload}) {
      const {type} = payload;
      return {
        ...state,
        type
      }
    },
    setMarket(state, {payload}) {
      const {market} = payload;
      let tokenS = '';
      let tokenB = '';
      if (market) {
        const tokens = market.split('-');
        tokenS = config.getTokenBySymbol(tokens[0]).address;
        tokenB = config.getTokenBySymbol(tokens[1]).address;
      }
      return {
        ...state,
        tokenS,
        tokenB,
        market
      }
    },
    setOrderHash(state, {payload}) {
      const {orderHash} = payload;
      return {
        ...state,
        orderHash
      }
    }
  },

  effects: {
    * init({payload}, {put}) {
      const {market, orderHash, type} = payload;
      yield put({type: 'setType', payload: {type}});
      yield put({type: 'setMarket', payload: {market}});
      yield put({type: 'setOrderHash', payload: {orderHash}})
    }
  }


}
