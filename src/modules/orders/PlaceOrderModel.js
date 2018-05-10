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
   trade:{
     side:'buy',
     pair:'LRC-WETH',
     priceInput: 0,
     amountInput:0,
     total:0,
     timeToLivePatternSelect: 'easy',
     timeToLivePopularSetting: true,
     sliderMilliLrcFee:0,
     timeToLive:0,
     timeToLiveUnit:'',
     timeToLiveStart: null,
     timeToLiveEnd: null,
     loading: false,
   }
  },
  effects:{
    *pairChangeEffects({ payload={} }, { put }) {
      let {pair} = payload
      if(pair) {
        yield put({ type: 'pairChange',payload:{pair}});
        const priceInput = 0.001
        yield put({ type: 'priceChange',payload:{priceInput}});

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
      const {pair, side} = state.trade
      if(pair && side) {
        const tokenL = config.getTokenBySymbol(pair.split('-')[0].toUpperCase())
        const tokenR = config.getTokenBySymbol(pair.split('-')[1].toUpperCase())
        if(tokenL && tokenR && (side === 'buy' || side === 'sell')) {
          if(side === 'buy') {
            const buy = {...tokenL, balance:100000000000000000000}
            const sell = {...tokenR, balance:100000000000000000000}
            yield put({ type: 'buyAndSellChange',payload:{buy, sell}});
            const priceInput = state.trade.priceInput
            if(priceInput >0) {
              let availableAmount = Math.floor(sell.balance / priceInput * ("1e"+sell.precision)) / ("1e"+sell.precision)
              availableAmount = orderFormatter.formatAvaliableAmount(availableAmount, tokenL, tokenR)
              yield put({ type: 'availableAmountChange',payload:{side, availableAmount}});
            }
          } else {
            const buy = {...tokenR, balance:100000000000000000000}
            const sell = {...tokenL, balance:100000000000000000000}
            yield put({ type: 'buyAndSellChange',payload:{buy, sell}});
            let availableAmount = Math.floor(sell.balance * ("1e"+buy.precision)) / ("1e"+buy.precision)
            availableAmount = orderFormatter.formatAvaliableAmount(availableAmount, tokenL, tokenR)
            yield put({ type: 'availableAmountChange',payload:{side, availableAmount}});
          }
        } else {
          throw new Error('Not supported market:'+pair)
        }
      }
    }
  },
  reducers: {
    sideChange(state, action) {
      let {payload} = action
      let {side} = payload
      return {
        ...state,
        trade:{
          ...state.trade,
          side
        }
      }
    },
    priceChange(state, action) {
      const {priceInput} = action.payload
      return {
        ...state,
        trade:{
          ...state.trade,
          priceInput
        }
      }
    },
    pairChange(state, action) {
      const {pair} = action.payload
      return {
        ...state,
        trade:{
          ...state.trade,
          pair
        }
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


