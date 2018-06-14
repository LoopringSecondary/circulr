export default {
  namespace: 'signByMetaMask',
  state: {
    value: '',
    sig: ''
  },
  reducers: {
    reset(state,{payload}){
      return {
        value: '',
        sig:''
      }
    },
    setValue(state,{payload}){
      const {value} = payload;
      return {
        value,
        sig:''
      }
    },
    setSig(state,{payload}){
      const {sig} = payload;
      return {
        ...state,
        sig
      }
    }
  }
}
