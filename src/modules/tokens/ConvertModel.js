import {getAssetsByToken} from "../formatter/selectors";
import {toBig} from "LoopringJS/common/formatter";

export default {
  namespace: 'convert',
  state: {
    amount: toBig(0),
    isMax: false,
    gasPrice: 10,
    gasLimit: 200000,
    outBalance: false,
    loading:false,
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state,
        amount: toBig(0),
        isMax: false,
        outBalance: false,
        loading:false,
      }
    },
    setOutBalance(state, {payload}) {
      const {outBalance} = payload;
      return {
        ...state,
        outBalance
      }
    },
    setAmount(state, {payload}) {
      const {amount} = payload;
      return {
        ...state,
        amount
      }
    },
    setIsMax(state, {payload}) {
      const {isMax} = payload;
      return {
        ...state,
        isMax
      }
    },
    setGasPrice(state, {payload}) {
      const {gasPrice} = payload;
      return {
        ...state,
        gasPrice
      }
    },
    setToken(state, {payload}) {
      const {token} = payload;
      return {
        ...state,
        token
      }
    },
    setLoading(state,{payload}){
      const {loading} = payload;
      return {
        ...state,
        loading
      }
    }
  },
  effects: {
    * amountChange({payload}, {put}) {
      const {amount} = payload;
      yield put({type: "setAmount", payload: {amount:toBig(amount)}});
    },
    * gasPriceChange({payload}, {select, put}) {
      const {gasPrice,token,gasLimit,balance} = payload;
      const {isMax} = yield select((state) => state.convert);
      if (isMax && token.toLowerCase() === 'eth') {
        const gas = toBig(gasPrice).times(gasLimit).div(1e9);
        const amount = balance.minus(gas).minus(0.1).gt(0) ? balance.minus(gas).minus(0.1) : toBig(0);
        yield put({type: 'amountChange', payload: {amount}})
      }
      yield put({type: 'setGasPrice', payload: {gasPrice}})
    },
    * tokenChange({payload}, {put}) {
      yield put({type: 'reset', payload});
      yield put({type: 'setToken', payload});
    },
    * setMax({payload}, {put}) {
      const {amount} = payload;
      yield put({type:"setIsMax",payload:{isMax:true}});
      yield put({type:"setAmount",payload:{amount:toBig(amount)}})
    }
  }

};


