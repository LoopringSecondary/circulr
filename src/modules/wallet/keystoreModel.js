import {isKeystorePassRequired} from "LoopringJS/ethereum/keystore";


export default {
  namespace: 'keystore',
  state: {
    keystore: '',
    isPasswordRequired: false,
    password: ''
  },
  reducers: {
    reset(state, {payload}) {
      return {
        keystore: '',
        isPasswordRequired: false,
        password: ''
      }
    },
    setKeystore(state, {payload}) {
      const {keystore} = payload;
      const isPasswordRequired = isKeystorePassRequired(keystore);
      return {
        keystore,
        isPasswordRequired,
        password: ''
      }
    },
    setPassword(state, {payload}) {
      const {password} = payload;
      return {
        password
      }
    }
  }
}
