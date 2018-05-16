import {getAssetsByToken} from "../formatter/selectors";
import {toBig} from "LoopringJS/common/formatter";

export default {
  namespace: 'transfer',
  state: {
    token:'',
    to:"",
    amount: 0,
    data:'0x',
    isMax: false,
    outBalance:false
  },
  reducers: {
    reset(state, {payload}) {
      return {
        ...state,
        amount: toBig(0),
        isMax: false,
        outBalance:false,
        data:'0x',
        to:""
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
    },
    setIsMax(state,{payload}){
      const {isMax} = payload;
      return {
        ...state,
        isMax
      }
    },
    setToken(state,{payload}){
      const {token} = payload;
      return {
        ...state,
        token
      }
    },
    setData(state,{payload}){
      const {data} = payload;
      return {
        ...state,
        data
      }
    },
    setTo(state,{payload}){
      const {to} = payload;
      return {
        ...state,
        to
      }
    }
  },
  effects:{
    * amountChange({payload}, {select, put}) {
      const {amount} = payload;
      const {token} = yield select((state) =>state.transfer);
      const assets = yield select((state) => getAssetsByToken(state,token,true));
      const outBalance = assets.balance.lt(toBig(amount));
      yield put({type:"setAmount",payload:{amount}});
      yield put({type:"setOutBalance",payload:{outBalance}})
    },
    * gasChange({payload},{select,put}){
      let {token,isMax,gasLimit,gasPrice} = yield select((state) => state.transfer);
      gasLimit = payload.gasLimit || gasLimit;
      gasPrice = payload.gasPrice ||  gasPrice;
      if(isMax && token.toLowerCase() === 'eth'){
        const assets = yield select((state) => getAssetsByToken(state,token));
        const gas = toBig(gasPrice).times(gasLimit).times(1e9);
        const amount = assets.balance.minus(gas).isPositive() ? assets.balance.minus(gas) : toBig(0);
        yield put({type:'amountChange',payload:{amount}})
      }
      yield put({type:'setGasPrice',payload:{gasPrice}})
    },
    * tokenChange({payload},{select,put}){
      yield put({type:"reset",payload});
      yield put({type:'setToken',payload});
    }
  }
};


