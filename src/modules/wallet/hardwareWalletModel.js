


export default {
  namespace:'hardwareWallet',
  state:{
    publicKey:"",
    chainCode:"",
    dpath:"",
    index:0,
    pageNum:0,
    pageSize:5
  },
  reducers:{
    setPublicKey(state,{payload}){
      const {publicKey} = payload;
      return {
        ...state,
        publicKey
      }
    },
    setChainCode(state,{payload}){
      const {chainCode} = payload;
      return {
        ...state,
        chainCode
      }
    },
    setDpath(state,{payload}){
      const {dpath} = payload;
      return {
        ...state,
        dpath
      }
    },
    setIndex(state,{payload}){
      const {index} = payload;
      return {
        ...state,
        index
      }
    },
    setPageNum(state,{payload}) {
      const {pageNum} = payload;
      return {
        ...state,
        pageNum
      }
    },
    reset(state,{payload}){
      return {
        ...state,
        publicKey:"",
        chainCode:"",
        dpath:"",
        index:0,
        pageNum:0
      }
    }
  },
  effects:{
    * setKeyAndCode({payload},{put}){
      yield  put({type:"setPublicKey",payload});
      yield  put({type:"setChainCode",payload})
    }

  }
}
