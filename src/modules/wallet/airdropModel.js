export default {
  namespace: 'airdrop',
  state: {
    projectId: 1,
    address: '',
    gasPrice: 10,
    gasLimit: 200000
  },
  reducers: {
    setProjectId(state, {payload}) {
      const {projectId} = payload;
      return {
        ...state,
        projectId
      }
    },
    setAddress(state,{payload}){
      const {address} = payload;
      return {
        ...state,
        address
      }
    },
    setGasPrice(state,{payload}){
      const {gasPrice} = payload;
      return {
        ...state,
        gasPrice
      }
    },
    setGasLimit(state,{payload}){
      const {gasLimit} = payload;
      return {
        ...state,
        gasLimit
      }
    },
    reset(state,{payload}){
      return {
        projectId: 1,
        address: '',
        gasPrice: 10,
        gasLimit: 200000
      }
    }
  }
}
