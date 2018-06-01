import storage from 'modules/storage'
import {configs} from 'common/config/data'

const namespace = 'gas'

export default {
  namespace,
  state: {
    ...storage.settings.getGas(),
    tabSelected:'easy',
  },
  effects:{
  },
  reducers: {
    init(state, { payload }) {
      return  {
        ...state,
        gasPrice:{
          ...state.gasPrice,
          current:state.gasPrice.last
        },
        gasLimit:0,
        tabSelected:'easy'
      };
    },
    estimateGasChange(state, { payload }) {
      const {gasPrice} = payload
      let newState =  {
        ...state,
        gasPrice: {
          ...state.gasPrice,
          estimate : gasPrice || state.gasPrice.estimate,
        },
      };
      //do not need to store in localStorage
      return newState
    },
    currentGasChange(state, { payload }) {
      const {gasPrice, gasLimit} = payload
      let newState =  {
        ...state,
        gasPrice: {
          ...state.gasPrice,
          current : gasPrice ? gasPrice : state.gasPrice.current,
        },
        gasLimit: gasLimit || state.gasLimit,
      };
      //do not need to store in localStorage
      return newState
    },
    selectedGasChange(state, { payload }) {
      const {gasPrice, gasLimit} = payload
      let newState =  {
        ...state,
        gasPrice: {
          ...state.gasPrice,
          last : gasPrice ? gasPrice : state.gasPrice.last,
          current : 0,
        },
        gasLimit: gasLimit || state.gasLimit,
      };
      storage.settings.setGas(newState)
      return newState
    },
    fixedGasLimitChange(state, { payload }) {
      const {fixedGasLimit} = payload
      let newState =  {
        ...state,
        fixedGasLimit,
      };
      storage.settings.setGas(newState)
      return newState
    },
    gasLimitChange(state, { payload }) {
      const {gasLimit} = payload
      let newState =  {
        ...state,
        gasLimit,
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
  }
}
