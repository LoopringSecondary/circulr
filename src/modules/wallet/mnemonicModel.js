import {isValidateMnemonic} from "LoopringJS/ethereum/mnemonic";


export default {
  namespace: 'mnemonic',

  state: {
    mnemonic: '',
    password: null,
    isValidMnemonic: false,
    dpath: '',
    pageNum:0,
    pageSize:5
  },

  reducers: {
    reset(state,{paylaod}){
      return {
        ...state,
        mnemonic: '',
        password: null,
        isValidMnemonic: false,
        dpath: '',
        pageNum:0,
      }
    },
    setMnemonic(state, {payload}) {
      const {mnemonic} = payload;
      const isValidMnemonic = isValidateMnemonic(mnemonic);
      return {
        ...state,
        mnemonic,
        isValidMnemonic
      }
    },
    setPassword(state, {payload}) {
      const {password} = payload;
      return {
        ...state,
        password
      }
    },
    setDpath(state,{payload}){
      const {dpath} = payload;
      return {
        ...state,
        dpath
      }
    },
    setPageNum(state,{payload}){
      const {pageNum} = payload;
      return {
        ...state,
        pageNum
      }
    }
  }

}
