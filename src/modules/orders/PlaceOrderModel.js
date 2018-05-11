import config from 'common/config'
import * as fm from 'LoopringJS/common/formatter'
import * as orderFormatter from './formatters'

const MODULES = 'placeOrder'
export default {
  namespace: MODULES,
  state: {
   sell:{
     token:null,
     availableAmount: 0,
   },
   buy:{
     token:null,
     availableAmount: 0,
   },
   side:'buy',
   pair:'LRC-WETH',
   left: null,
   right: null,
   priceInput: '',
   amountInput:'',
   total:'',
   sliderMilliLrcFee:0,
   timeToLivePatternSelect: 'easy',
   timeToLivePopularSetting: true,
   timeToLive:0,
   timeToLiveUnit:'',
   timeToLiveStart: null,
   timeToLiveEnd: null,
   loading: false,
  },
  effects:{
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
        yield put({ type: 'sideOrPairChange' });
      }
    },
    *sideOrPairChange({ payload={} }, { select, put }) {
      const state = yield select(({ [MODULES]:data }) => data );
      const {pair, side} = state
      if(pair && side) {
        if(side === 'buy' || side === 'sell'){
          const tokenL = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
          const tokenR = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
          const marketConfig = config.getMarketBySymbol(tokenL.symbol, tokenR.symbol)
          if(!marketConfig || !(tokenL && tokenR)) {
            throw new Error('Not supported market:'+pair)
          }
          // TODO mock
          const balanceL = fm.toBig('100000000000000000000')
          const balanceR = fm.toBig('100000000000000000000')
          const balanceLDisplay = orderFormatter.tokenDisplayBalance(tokenL.symbol, balanceL)
          const balanceRDisplay = orderFormatter.tokenDisplayBalance(tokenR.symbol, balanceR)
          const l = {...tokenL, balance:balanceL, balanceDisplay:balanceLDisplay}
          const r = {...tokenR, balance:balanceR, balanceDisplay:balanceRDisplay}
          yield put({ type: 'leftAndRightChange',payload:{tokenL:l, tokenR:r}});
          const amountPrecision = Math.max(0, tokenR.precision - marketConfig.pricePrecision)
          if(side === 'buy') {
            yield put({ type: 'buyAndSellChange',payload:{buy:l, sell:r}});
            const priceInput = state.priceInput
            if(priceInput) {
              let availableAmount = fm.toFixed(r.balance.times(priceInput), amountPrecision, false)
              yield put({ type: 'availableAmountChange',payload:{side, availableAmount}});
            }
          } else {
            yield put({ type: 'buyAndSellChange',payload:{buy:r, sell:l}});
            let availableAmount = fm.toFixed(l.balance, amountPrecision, false)
            yield put({ type: 'availableAmountChange',payload:{side, availableAmount}});
          }
        } else {
          throw new Error('Not supported side change:'+side)
        }
      }
    },
    *priceChangeEffects({ payload={} }, { select, put }) {
      let {priceInput} = payload
      const state = yield select(({ [MODULES]:data }) => data );
      const {amountInput} = state
      if(priceInput) {
        if(amountInput){
          const total = fm.toBig(amountInput).times(priceInput)
          yield put({ type: 'totalChange',payload:{total}});
        }
        yield put({ type: 'priceChange',payload:{priceInput}});
      }
    },
    *amountChangeEffects({ payload={} }, { select, put }) {
      let {amountInput} = payload
      const state = yield select(({ [MODULES]:data }) => data );
      const {priceInput} = state
      if(amountInput) {
        if(priceInput){
          const total = fm.toBig(amountInput).times(priceInput)
          yield put({ type: 'totalChange',payload:{total}});
        }
        yield put({ type: 'amountChange',payload:{amountInput}});
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
      const {amountInput} = action.payload
      return {
        ...state,
        amountInput
      }
    },
    totalChange(state, action) {
      const {total} = action.payload
      return {
        ...state,
        total
      }
    },
    pairChange(state, action) {
      const {pair} = action.payload
      return {
        ...state,
        pair,
        left : pair.split('-')[0],
        right : pair.split('-')[1],
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
      const {side, availableAmount} = payload
      return {
        ...state,
        [side]:{
          ...state[side],
          availableAmount
        }
      }
    }
  },
};


