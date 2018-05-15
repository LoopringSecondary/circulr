

export default {
  namespace:'backup',
  state:{
    keystore:'',
    mnemonic:'',
    privateKey:'',
    address:''
  },

  reducers:{
    reset(state,{payload}){
      return {
        keystore:'',
        mnemonic:'',
        privateKey:''
      }
    },
    set(state,{payload}){
      return {
        ...state,
        ...payload
      }
    }
  }
}
