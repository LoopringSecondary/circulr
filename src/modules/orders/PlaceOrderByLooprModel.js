const MODULES = 'placeOrderByLoopr'
export default {
  namespace: MODULES,
  state: {
   step:0, //0:qrcode, 1:waiting for sign 2:result
   orderState:0, //0:not send, 1:send succeed 2:send failed
   generateTime:null,
   qrcode:''
  },
  effects:{
    *init({ payload={} }, { put }) {

    },
    *reset({ payload={} }, { put }) {
      yield put({ type: 'qrcodeChange',payload:{qrcode:''}});
      yield put({ type: 'stepChange',payload:{step:0}});
      yield put({ type: 'generateTimeChange',payload:{generateTime:null}});
    },
  },
  reducers: {
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
    qrcodeChange(state, action) {
      const {payload} = action
      let {qrcode} = payload
      return {
        ...state,
        qrcode
      }
    },
    generateTimeChange(state, action) {
      const {payload} = action
      let {generateTime} = payload
      return {
        ...state,
        generateTime
      }
    },
  },
};


