const MODULES = 'placeOrderByLoopr'
export default {
  namespace: MODULES,
  state: {
   step:0, //0:qrcode, 1:waiting for sign 2:result
   generateTime:null,
   qrcode:''
  },
  effects:{
    *init({ payload={} }, { put }) {

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


