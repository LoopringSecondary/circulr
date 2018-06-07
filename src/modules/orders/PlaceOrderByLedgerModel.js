const MODULES = 'placeOrderByLedger'
export default {
  namespace: MODULES,
  state: {
   step:0, //0:connect, 1:sign 2:send result

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
  },
};


