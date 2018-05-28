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
      let price = 0
      if(state.pair) {
        const l = state.pair.split('-')[0].toUpperCase()
        const r = state.pair.split('-')[1].toUpperCase()
        const marketConfig = config.getMarketBySymbol(l, r)
        if(marketConfig) {
          price = orderFormatter.formatPriceByMarket(priceInput, marketConfig)
        }
      }
      return {
        ...state,
        priceInput : price
      }
    },
    amountChange(state, action) {
      let amount = 0
      if(!action.payload) {
        amount = orderFormatter.sliderChangeEffectAmount(state)
      } else{
        if(state.pair) {
          const l = state.pair.split('-')[0].toUpperCase()
          const r = state.pair.split('-')[1].toUpperCase()
          const tokenRConfig = config.getTokenBySymbol(r)
          const marketConfig = config.getMarketBySymbol(l, r)
          if(tokenRConfig && marketConfig) {
            amount = orderFormatter.formatAmountByMarket(action.payload.amountInput, tokenRConfig, marketConfig)
          }
        }
      }
      return {
        ...state,
        amountInput : amount
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


