import {getAssetsByToken} from "../formatter/selectors";
import {toBig} from "LoopringJS/common/formatter";

export default {
  namespace: 'convert',
  state: {
    token: 'ETH',
    amount: 0,
    isMax: false,
    gasPrice: 10,
    gasLimit:200000,
    outBalance:false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state,
        amount: toBig(0),
        isMax: false,
        outBalance:false
      }
    },
    setOutBalance(state,{payload}){
      const {outBalance} = payload;
      return {
        ...state,
        outBalance
      }
    },
    setAmount(state,{payload}){
      const {amount} = payload;
      return {
        ...state,
        amount
      }
    }
  },
  effects: {
    * amoutChange({payload}, {select, put}) {
      const {amount} = payload;
      const token = this.state.token;
      const assets = yield select((state) => getAssetsByToken(state,token,true));
      const outBalance = assets.balance.lt(toBig(amount));
      yield put({type:"setAmount",payload:{amount}});
      yield put({type:"setOutBalance",payload:{outBalance}})
    },



  },

};


