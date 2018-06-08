const MODULES = 'placeOrderByMetaMask'
export default {
  namespace: MODULES,
  state: {
    orderState:0, //0:not send, 1:send succeed 2:send failed
  },
  effects:{
    *init({ payload={} }, { put }) {
      // yield put({ type: 'confirmAddressChange',payload:{confirmed:false}});
      // yield put({ type: 'stepChange',payload:{step:0}});
    },
    *reset({ payload={} }, { put }) {
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
    orderStateChange(state, action) {
      const {payload} = action
      let {orderState} = payload
      return {
        ...state,
        orderState
      }
    },
  },
};


