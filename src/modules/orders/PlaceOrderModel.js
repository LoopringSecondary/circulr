import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'
import * as orderFormatter from './formatters'
const MODULES = 'placeOrder'

export default {
  namespace: MODULES,
  state: {
   sell:{
     token:{},
     availableAmount: 0,
   },
   buy:{
     token:{},
     availableAmount: 0,
   },
   side:'buy',
   pair:'LRC-WETH',
   left: {},
   right: {},
   priceInput: '0',
   amountInput:'0',
   amountSlider:0,
   total:'',
   sliderMilliLrcFee:0,
   lrcFee:0,
   timeToLivePatternSelect: 'easy',
   timeToLivePopularSetting: true,
   timeToLive:0,
   timeToLiveUnit:'',
   timeToLiveStart: null,
   timeToLiveEnd: null,
   loading: false,
  },
  effects:{
    *init({ payload={} }, { put }) {
       yield put({ type: 'pairChangeEffects',payload});
    },
    *pairChangeEffects({ payload={} }, { put }) {
      let {pair} = payload
      if(pair) {
        yield put({ type: 'pairChange',payload:{pair}});
        const priceInput = '0.001'
        yield put({ type: 'priceChangeEffects',payload:{priceInput}});
        yield put({ type: 'sideOrPairChange' });
      }
    },
    *sideChangeEffects({ payload={} }, { put }) {
      let {side} = payload
      if(side) {
        yield put({ type: 'sideChange',payload:{side}});
        yield put({ type: 'amountChange',payload:{amountInput:0}});
        yield put({ type: 'amountSliderChange',payload:{amountSlider:0}});
        yield put({ type: 'totalChange',payload:{total:0}});
        yield put({ type: 'sideOrPairChange' });
      }
    },
    *sideOrPairChange({ payload={} }, { select, put }) {
      const state = yield select(({ [MODULES]:data }) => data );
      const {pair, side} = state
      if(pair && side) {
        if(side === 'buy' || side === 'sell'){
          const l = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
          const r = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
          const marketConfig = config.getMarketBySymbol(l.symbol, r.symbol)
          if(!marketConfig || !(l && r)) {
            throw new Error('Not supported market:'+pair)
          }
          // TODO mock
          const balanceL = fm.toBig('100000000000000000000')
          const balanceR = fm.toBig('200000000000000000000')
          const balanceLDisplay = orderFormatter.tokenDisplayBalance(l.symbol, balanceL)
          const balanceRDisplay = orderFormatter.tokenDisplayBalance(r.symbol, balanceR)
          const tokenL = {...l, balance:balanceL, balanceDisplay:balanceLDisplay}
          const tokenR = {...r, balance:balanceR, balanceDisplay:balanceRDisplay}
          yield put({ type: 'leftAndRightChange',payload:{tokenL, tokenR}});
          if(side === 'buy') {
            yield put({ type: 'buyAndSellChange',payload:{buy:tokenL, sell:tokenR}});
          } else {
            yield put({ type: 'buyAndSellChange',payload:{buy:tokenR, sell:tokenL}});
          }
          yield put({ type: 'availableAmountChange' });
        } else {
          throw new Error('Not supported side change:'+side)
        }
      }
    },
    *priceChangeEffects({ payload={} }, { select, put }) {
      let {priceInput} = payload
      yield put({ type: 'priceChange',payload:{priceInput}});
      yield put({ type: 'totalChange' });
      yield put({ type: 'availableAmountChange' });
      yield put({ type: 'lrcFeeChangeEffects' });
    },
    *amountChangeEffects({ payload={} }, { select, put }) {
      let {amountInput} = payload
      yield put({ type: 'amountChange',payload:{amountInput}});
      yield put({ type: 'amountSliderChange' });
      yield put({ type: 'totalChange' });
      yield put({ type: 'lrcFeeChangeEffects' });
    },
    *amountSliderChangeEffects({ payload={} }, { select, put }) {
      let {amountSlider} = payload
      yield put({ type: 'amountSliderChange',payload:{amountSlider}});
      yield put({ type: 'amountChange' });
      yield put({ type: 'totalChange' });
    },
    *milliLrcFeeChangeEffects({ payload={} }, { select, put }) {
      let {milliLrcFee} = payload
      yield put({ type: 'milliLrcFeeChange',payload:{milliLrcFee}});
      yield put({ type: 'lrcFeeChangeEffects' });
    },
    *lrcFeeChangeEffects({ payload={} }, { select, put }) {
      if(payload.lrcFee) {
        let {lrcFee} = payload
        yield put({ type: 'lrcFeeChange',payload:{lrcFee}});
      } else {
        const state = yield select(({ [MODULES]:data }) => data );
        const {amountInput, priceInput, sliderMilliLrcFee, right} = state
        const amount = fm.toBig(amountInput)
        const price = fm.toBig(priceInput)
        if(amount.gt(0) && price.gt(0) && sliderMilliLrcFee) {
          const total = price.times(amount)
          const lrcFee = orderFormatter.calculateLrcFee(total, sliderMilliLrcFee, right.symbol)
          yield put({ type: 'lrcFeeChange',payload:{lrcFee}});
        }
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
    amountSliderChange(state, action) {
      let amountSlider = 0
      if(!action.payload) {
        amountSlider = orderFormatter.amountChangeEffectSlider(state)
      } else {
        amountSlider = action.payload.amountSlider
      }
      return {
        ...state,
        amountSlider
      }
    },
    totalChange(state, action) {
      let total = 0
      if(!action.payload) {
        if(!state.amountInput || !state.priceInput) {
          total = 0
        } else {
          total = fm.toBig(state.amountInput).times(state.priceInput).toString(10)
        }
      } else {
        total = action.payload.total
      }
      return {
        ...state,
        total
      }
    },
    pairChange(state, action) {
      const {pair} = action.payload
      return {
        ...state,
        pair
      }
    },
    leftAndRightChange(state, action) {
      const {payload} = action
      const {tokenL, tokenR} = payload
      return {
        ...state,
        left : tokenL,
        right : tokenR
      }
    },
    buyAndSellChange(state, action) {
      const {payload} = action
      const {sell, buy} = payload
      return {
        ...state,
        sell: {
          ...state.sell,
          token:sell
        },
        buy: {
          ...state.buy,
          token:buy
        }
      }
    },
    availableAmountChange(state, action) {
      const {payload} = action
      const side = state.side
      const marketConfig = config.getMarketBySymbol(state.left.symbol, state.right.symbol)
      const amountPrecision = Math.max(0, state.right.precision - marketConfig.pricePrecision)
      const availableAmount = orderFormatter.calculateAvailableAmount(side, state.priceInput, state.left, state.right, amountPrecision)
      return {
        ...state,
        [side]:{
          ...state[side],
          availableAmount
        }
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
    lrcFeeChange(state, action) {
      const {payload} = action
      let {lrcFee} = payload
      return {
        ...state,
        lrcFee:lrcFee
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
    }
  },
};


