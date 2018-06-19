const MODULES = 'placeOrderByLedger'
export default {
  namespace: MODULES,
  state: {
    ledger:null,
    addressConfirmed:false,
    step:0, //0:connect, 1:sign 2:send result
    orderState:0, //0:not send, 1:send succeed 2:send failed
    path: ''
  },
  effects:{
    *init({ payload={} }, { put }) {
      // yield put({ type: 'confirmAddressChange',payload:{confirmed:false}});
      // yield put({ type: 'stepChange',payload:{step:0}});
    },
    *reset({ payload={} }, { put }) {
      yield put({ type: 'confirmAddressChange',payload:{confirmed:false}});
      yield put({ type: 'stepChange',payload:{step:0}});
      yield put({ type: 'orderStateChange',payload:{orderState:0}});
    },
  },
  reducers: {
    connectedChange(state, action) {
      const {payload} = action
      let {ledger} = payload
      return {
        ...state,
        ledger
      }
    },
    confirmAddressChange(state, action) {
      const {payload} = action
      let {confirmed} = payload
      return {
        ...state,
        addressConfirmed:confirmed
      }
    },
    stepChange(state, action) {
      const {payload} = action
      let {step} = payload
      return {
        ...state,
        step
      }
    },
    orderStateChange(state, action) {
      const {payload} = action
      let {orderState} = payload
      return {
        ...state,
        orderState
      }
    },
    pathChange(state, action) {
      const {payload} = action
      let {path} = payload
      return {
        ...state,
        path
      }
    },
  },
};


