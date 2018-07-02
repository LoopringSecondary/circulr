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
    tradeInfo:null,
    unsigned:null,
    signed:null,
    payWith:'', //ledger, metaMask, loopr
    resultMsg: '',
    confirmButtonState : 1, //1:init, 2:loading, 3:submitted
  },
  effects:{
    *init({ payload={} }, { put }) {
      yield put({ type: 'pairChangeEffects',payload});
      yield put({ type: 'confirmButtonStateChange',payload:{buttonState:1}});
      yield put({ type: 'payWithChange',payload:{payWith:''}});
      yield put({ type: 'tradeInfoChange',payload:{tradeInfo:null}});
      //yield put({ type: 'unsignedChange',payload:{unsigned:null}});
      //yield put({ type: 'signedChange',payload:{signed:null}});
      yield put({ type: 'resultMsgChange',payload:{resultMsg:''}});
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
      const {tradeInfo, unsigned, signed} = payload
      yield put({ type: 'tradeInfoChange',payload:{tradeInfo}});
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
      if(!account || (unlockType !== 'keystore' && unlockType !== 'mnemonic' && unlockType !== 'privateKey')) {
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
    tradeInfoChange(state, action) {
      const {payload} = action
      let {tradeInfo} = payload
      return {
        ...state,
        tradeInfo
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
    payWithChange(state, action) {
      const {payload} = action
      let {payWith} = payload
      return {
        ...state,
        payWith
      }
    },
    resultMsgChange(state, {payload}) {
      let {resultMsg} = payload
      return {
        ...state,
        resultMsg
      }
    },
  },
};


