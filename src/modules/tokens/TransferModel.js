import {getAssetsByToken} from "../formatter/selectors";
import {toBig} from "LoopringJS/common/formatter";
import * as datas from 'common/config/data'

export default {
  namespace: 'transfer',
  state: {
    assignedToken:'',
    token:'',
    to:"",
    amount: toBig(0),
    data:'0x',
    isMax: false,
    gasPopularSetting: true,
    sliderGasPrice:datas.configs.defaultGasPrice, //TODO read from relay
    selectedGasPrice: datas.configs.defaultGasPrice,
    selectedGasLimit: 0,
    advance: false
  },
  reducers: {
    reset(state, {payload}) {
      const assignedToken = payload && payload.assignedToken ? payload.assignedToken : ''
      return {
        ...state,
        assignedToken: assignedToken || '',
        token: assignedToken || '',
        to:"",
        amount: toBig(0),
        data:'0x',
        isMax: false,
        advance:false,
      }
    },
    setAssignedToken(state,{payload}){
      const {assignedToken} = payload;
      return {
        ...state,
        assignedToken,
        token:assignedToken
      }
    },
    setAmount(state,{payload}){
      const {amount} = payload;
      return {
        ...state,
        amount,
        isMax:false
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
    },
    setGasPopularSetting(state,{payload}){
      const {gasPopularSetting} = payload;
      return {
        ...state,
        gasPopularSetting
      }
    },
    setSliderGasPrice(state,{payload}){
      const {sliderGasPrice} = payload;
      return {
        ...state,
        sliderGasPrice
      }
    },
    setSelectedGasPrice(state,{payload}){
      const {selectedGasPrice} = payload;
      return {
        ...state,
        selectedGasPrice
      }
    },
    setSelectedGasLimit(state,{payload}){
      const {selectedGasLimit} = payload;
      return {
        ...state,
        selectedGasLimit
      }
    },
    setAdvance(state,{payload}){
      const {advance} = payload;
      return {
        ...state,
        advance
      }
    },
  },
  effects:{
    *init({ payload={} }, { put }) {
      //yield put({type:"reset",payload});
    },
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
        const amount = assets.balance.minus(gas).gt(0) ? assets.balance.minus(gas) : toBig(0);
        yield put({type:'amountChange',payload:{amount}})
      }
      yield put({type:'setGasPrice',payload:{gasPrice}})
    },
    * tokenChange({payload},{select,put}){
      yield put({type:'setToken',payload});
    },
    * assignedtokenChange({payload},{select,put}){
      yield put({type:'setAssignedToken',payload});
      yield put({type:'setIsMax',payload:{isMax:false}});
    },
  }
};


