import {isValidateMnemonic} from "LoopringJS/ethereum/mnemonic";
import {fromMnemonic} from "../../common/loopringjs/src/ethereum/account";


export default {
  namespace: 'mnemonic',

  state: {
    mnemonic: '',
    password: null,
    passRequired: false,
    dpath: "m/44'/60'/0'/0",
    address: '',
  },

  reducers: {
    reset(state, {paylaod}) {
      return {
        ...state,
        mnemonic: '',
        password: null,
        passRequired: false,
        dpath: "m/44'/60'/0'/0",
        address: '',
      }
    },
    setMnemonic(state, {payload}) {
      const {mnemonic} = payload;
      const isValidMnemonic = isValidateMnemonic(mnemonic);
      let address = '';
      const {passRequired, dpath, password} = state;
      if (isValidMnemonic && dpath) {
        if ((passRequired && password) || (!passRequired)) {
          const account = fromMnemonic(mnemonic, dpath.concat('/0'), password)
          address = account.getAddress()
        }
      }
      return {
        ...state,
        mnemonic,
        address
      }
    },
    setPassword(state, {payload}) {
      const {password} = payload;
      let address = '';
      const {passRequired, dpath, mnemonic} = state;
      const isValidMnemonic = isValidateMnemonic(mnemonic);
      if (isValidMnemonic && dpath) {
        if ((passRequired && password) || (!passRequired)) {
          const account = fromMnemonic(mnemonic, dpath.concat('/0'), password);
          address = account.getAddress()
        }
      }
      return {
        ...state,
        password,
        address
      }
    },
    setDpath(state, {payload}) {
      const {dpath, passRequired} = payload;
      let address = '';
      let {password, mnemonic} = state;
      const isValidMnemonic = isValidateMnemonic(mnemonic);
      if (isValidMnemonic && dpath) {
        if ((passRequired && password) || (!passRequired)) {
          const account = fromMnemonic(mnemonic, dpath.concat('/0'), password);
          address = account.getAddress()
        }
      }
      password = passRequired ? password : null;
      return {
        ...state,
        dpath,
        passRequired,
        address,
        password
      }
    }
  }

}
