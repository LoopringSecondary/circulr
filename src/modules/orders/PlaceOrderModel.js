import config from 'common/config'
import * as datas from 'common/config/data'
import * as orderFormatter from './formatters'
import * as apis from './apis'

const MODULES = 'placeOrder'
export default {
  namespace: MODULES,
  state: {
   side:'buy',
   pair:'LRC-WETH',
   priceInput: '0',
   amountInput:'0',
   submitButtonLoading: false,
   unsigned:null,
   signed:null,
   confirmButtonState : 1, //1:init, 2:loading, 3:submitted
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
    *toConfirm({ payload={} }, { select, put }) {
      const {unsigned, signed} = payload
      yield put({ type: 'unsignedChange',payload:{unsigned}});
      yield put({ type: 'signedChange',payload:{signed}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:1}});
    },
    *sendDone({ payload={} }, { put }) {
      const {signed} = payload
      yield put({ type: 'signedChange',payload:{signed}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:3}});
    },
    *unlock({ payload={} }, { select, put ,call}) {
      const {signed,unsigned} = yield select(({ [MODULES]:state }) => state )
      if(!unsigned || unsigned.length === 0) {
        return
      }
      let actualSigned = signed ? signed.filter(item => item !== undefined) : []
      if(unsigned.length === actualSigned.length) {
        return
      }
      const {account, unlockType, address} = yield select(({ ['wallet']:state }) => state )
      if(!account || unlockType === 'address') {
        return
      }
      const signedNew = yield call(apis.signAll, {signed,unsigned,account,address})
      yield put({ type: 'signedChange',payload:{signed:signedNew}});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:1}});
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
    },
    confirmButtonStateChange(state, action) {
      const {payload} = action
      let {buttonState} = payload
      return {
        ...state,
        confirmButtonState:buttonState
      }
    },
  },
};


