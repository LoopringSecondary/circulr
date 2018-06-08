const MODULES = 'placeOrderByLedger'
export default {
  namespace: MODULES,
  state: {
    ledger:null,
    addressConfirmed:false,
    step:0, //0:connect, 1:sign 2:send result

  },
  effects:{
    *init({ payload={} }, { put }) {
      // yield put({ type: 'confirmAddressChange',payload:{confirmed:false}});
      // yield put({ type: 'stepChange',payload:{step:0}});
    },
    *reset({ payload={} }, { put }) {
      yield put({ type: 'confirmAddressChange',payload:{confirmed:false}});
      yield put({ type: 'stepChange',payload:{step:0}});
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
  },
};


