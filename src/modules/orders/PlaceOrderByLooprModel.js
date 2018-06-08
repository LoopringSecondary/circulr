const MODULES = 'placeOrderByLoopr'
export default {
  namespace: MODULES,
  state: {
    hash:'',
    qrcode:'', //original data. {type:'sign', 'id':hash}
    step:0, //0:qrcode, 1:waiting for sign 2:result
    orderState:0, //0:not send, 1:send succeed 2:send failed
    generateTime:null,
  },
  effects:{
    *init({ payload={} }, { put }) {

    },
    *reset({ payload={} }, { put }) {
      yield put({ type: 'hashChange',payload:{hash:''}});
      yield put({ type: 'qrcodeChange',payload:{qrcode:''}});
      yield put({ type: 'stepChange',payload:{step:0}});
      yield put({ type: 'generateTimeChange',payload:{generateTime:null}});
    },
    *qrcodeGenerated({ payload={} }, { put }) {
      const {qrcode, hash} = payload
      yield put({ type: 'hashChange',payload:{hash}});
      yield put({ type: 'qrcodeChange',payload:{qrcode}});
    },
    *scanned({ payload={} }, { put, select }) {
      const {hash} = payload
      const state = yield select(({ [MODULES]:state }) => state )
      if(state.hash === hash) {
        yield put({ type: 'orderStateChange',payload:{orderState:2}});
        yield put({ type: 'stepChange',payload:{step:1}});
      }
    },
    *submitFailed({ payload={} }, { put, select }) {
      const {hash} = payload
      const state = yield select(({ [MODULES]:state }) => state )
      if(state.hash === hash) {
        yield put({ type: 'orderStateChange',payload:{orderState:2}});
        yield put({ type: 'stepChange',payload:{step:2}});
      }
    },
    *submitSuccessfully({ payload={} }, { put, select }) {
      const {hash} = payload
      const state = yield select(({ [MODULES]:state }) => state )
      if(state.hash === hash) {
        yield put({ type: 'orderStateChange',payload:{orderState:1}});
        yield put({ type: 'stepChange',payload:{step:2}});
      }
    },
  },
  reducers: {
    hashChange(state, action) {
      const {payload} = action
      let {hash} = payload
      return {
        ...state,
        hash
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


