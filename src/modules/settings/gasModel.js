import storage from 'modules/storage'

const namespace = 'gas'

export default {
  namespace,
  state: {
    ...storage.settings.getGas(),
    tabSelected:'easy',
    fixedGasLimit:0,
    visible:false
  },
  effects:{
  },
  reducers: {
    init(state, { payload }) {
      const {gasLimit} = payload
      return  {
        ...state,
        fixedGasLimit : gasLimit || state.fixedGasLimit,
        gasLimit:0,
        tabSelected:'easy'
      };
    },
    gasChange(state, { payload }) {
      const {gasPrice, gasLimit, estimate} = payload
      let newState =  {
        ...state,
        gasPrice: {
          last : gasPrice ? gasPrice : state.gasPrice.last,
          estimate : estimate || state.gasPrice.estimate,
        },
        gasLimit: gasLimit || state.gasLimit,
      };
      storage.settings.setGas(newState)
      return newState
    },
    tabChange(state, { payload }) {
      const {tabSelected} = payload
      return  {
        ...state,
        tabSelected
      };
    },
    visibleChange(state, { payload }) {
      const {visible} = payload
      return  {
        ...state,
        visible
      };
    },
  }
}
