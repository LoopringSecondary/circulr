import config from 'common/config'
import * as datas from 'common/config/data'
import * as orderFormatter from './formatters'

const MODULES = 'placeOrder'
export default {
  namespace: MODULES,
  state: {
   side:'buy',
   pair:'LRC-WETH',
   priceInput: '0',
   amountInput:'0',
   sliderMilliLrcFee:0,
   timeToLivePatternSelect: 'easy',
   timeToLivePopularSetting: true,
   timeToLive: 0,
   timeToLiveUnit: '',
   timeToLiveStart: null,
   timeToLiveEnd: null,
   submitButtonLoading: false,
   unsigned:null,
   signed:null
  },
  effects:{
    *init({ payload={} }, { put }) {
       yield put({ type: 'pairChangeEffects',payload});
    },
    *pairChangeEffects({ payload={} }, { put }) {
      let {pair, price} = payload
      if(pair) {
        yield put({ type: 'pairChange',payload:{pair}});
        if(price) {
          yield put({ type: 'priceChange',payload:{priceInput:price}});
        }
      }
    },
    *sideChangeEffects({ payload={} }, { put }) {
      let {side} = payload
      if(side) {
        yield put({ type: 'sideChange',payload:{side}});
        yield put({ type: 'amountChange',payload:{amountInput:0}});
      }
    },
    *timeToLivePatternChangeEffects({ payload={} }, { select, put }) {
      const {timeToLivePatternSelect} = payload
      if(timeToLivePatternSelect === 'advance') { //[easy, advance]
        let {timeToLiveStart, timeToLiveEnd} = payload
        if(timeToLiveStart && timeToLiveEnd) {
          yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
          yield put({ type: 'timeToLiveStartEndChange',payload:{timeToLiveStart, timeToLiveEnd}});
        }
      } else {
        yield put({ type: 'timeToLivePatternChange',payload:{timeToLivePatternSelect}});
      }
    },
    *timeToLiveEasyTypeChangeEffects({ payload={} }, { select, put }) {
      const {type, timeToLive, timeToLiveUnit} = payload
      if(type === 'popular') {
        yield put({ type: 'timeToLiveEasyPopularSettingChange',payload:{timeToLivePopularSetting:payload.timeToLivePopularSetting}});
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      } else {
        yield put({ type: 'timeToLiveEasyPopularValueChange',payload:{timeToLive, timeToLiveUnit}});
      }
    },
    *toConfirm({ payload={} }, { select, put }) {
      const {unsigned, signed} = payload
      yield put({ type: 'unsignedChange',payload:{unsigned}});
      yield put({ type: 'signedChange',payload:{signed}});
    }
  },
  reducers: {
    sideChange(state, action) {
      let {payload} = action
      let {side} = payload
      return {
        ...state,
        side
      }
    },
    priceChange(state, action) {
      const {priceInput} = action.payload
      return {
        ...state,
        priceInput
      }
    },
    amountChange(state, action) {
      let amountInput = 0
      if(!action.payload) {
        amountInput = orderFormatter.sliderChangeEffectAmount(state)
      } else{
        amountInput = action.payload.amountInput
      }
      return {
        ...state,
        amountInput
      }
    },
    pairChange(state, action) {
      const {pair} = action.payload
      return {
        ...state,
        pair
      }
    },
    milliLrcFeeChange(state, action) {
      const {payload} = action
      let {milliLrcFee} = payload
      return {
        ...state,
        sliderMilliLrcFee:milliLrcFee
      }
    },
    timeToLivePatternChange(state, action) {
      const {payload} = action
      let {timeToLivePatternSelect} = payload
      return {
        ...state,
        timeToLivePatternSelect
      }
    },
    timeToLiveStartEndChange(state, action) {
      const {payload} = action
      let {timeToLiveStart, timeToLiveEnd} = payload
      return {
        ...state,
        timeToLiveStart,
        timeToLiveEnd
      }
    },
    timeToLiveEasyPopularSettingChange(state, action) {
      const {payload} = action
      let {timeToLivePopularSetting} = payload
      return {
        ...state,
        timeToLivePopularSetting
      }
    },
    timeToLiveEasyPopularValueChange(state, action) {
      const {payload} = action
      let {timeToLive, timeToLiveUnit} = payload
      return {
        ...state,
        timeToLive,
        timeToLiveUnit
      }
    },
    submitButtonLoadingChange(state, action) {
      const {payload} = action
      let {submitButtonLoading} = payload
      return {
        ...state,
        submitButtonLoading
      }
    },
    unsignedChange(state, action) {
      const {payload} = action
      let {unsigned} = payload
      return {
        ...state,
        unsigned
      }
    },
    signedChange(state, action) {
      const {payload} = action
      let {signed} = payload
      return {
        ...state,
        signed
      }
    }
  },
};


