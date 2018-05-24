import {getAssetsByToken} from "../formatter/selectors";
import {toBig} from "LoopringJS/common/formatter";

export default {
  namespace: 'convert',
  state: {
    amount: toBig(0),
    isMax: false,
    gasPrice: 10,
    gasLimit: 200000,
    outBalance: false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state,
        amount: toBig(0),
        isMax: false,
        outBalance: false
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
    }
  },
  effects: {
    * amountChange({payload}, {select, put}) {
      const {amount} = payload;
      const {token} = yield select((state) => state.convert);
      const assets = yield select((state) => getAssetsByToken(state, token, true));
      const outBalance = assets.balance.lt(toBig(amount));
      yield put({type: "setAmount", payload: {amount:toBig(amount)}});
      yield put({type: "setOutBalance", payload: {outBalance}})
    },
    * gasPriceChange({payload}, {select, put}) {
      const {gasPrice,token,gasLimit} = payload;
      const {isMax} = yield select((state) => state.convert);
      if (isMax && token.toLowerCase() === 'eth') {
        const assets = yield select((state) => getAssetsByToken(state, token));
        const gas = toBig(gasPrice).times(gasLimit).times(1e9);
        const amount = assets.balance.minus(gas).minus(0.1).isPositive() ? assets.balance.minus(gas).minus(0.1) : toBig(0);
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


