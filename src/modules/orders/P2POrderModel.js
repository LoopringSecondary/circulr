import config from 'common/config'
import {toBig} from 'LoopringJS/common/formatter'

const MODULES = 'p2pOrder'
export default {
  namespace: MODULES,
  state: {
   tokenS:'LRC',
   tokenB:'WETH',
   amountS:toBig(0),
   amountB:toBig(0),
   loading:false
  },
  effects:{
    *init({ payload={} }, { put }) {
      //yield put({ type: 'tokenChange',payload});
    },
  },
  reducers: {
    tokenChange(state, action) {
      let {payload} = action
      const {tokenS, tokenB} = payload
      return {
        ...state,
        tokenS: tokenS || state.tokenS,
        tokenB: tokenB || state.tokenB
      }
    },
    amountChange(state, action) {
      let {payload} = action
      const {amountS, amountB} = payload
      return {
        ...state,
        amountS: amountS || state.amountS,
        amountB: amountB || state.amountB,
      }
    },
    loadingChange(state, action) {
      let {payload} = action
      const {loading} = payload
      return {
        ...state,
        loading
      }
    },
  },
};


