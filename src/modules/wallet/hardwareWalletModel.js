import {wallets} from "../../common/config/data";
import {trimAll} from "LoopringJS/common/utils";
import {getAddresses} from "LoopringJS/ethereum/account";

export default {
  namespace: 'hardwareWallet',
  state: {
    publicKey: "",
    chainCode: "",
    dpath: "",
    walletType: '',
    address: ''
  },
  reducers: {
    setPublicKey(state, {payload}) {
      const {publicKey} = payload;
      return {
        ...state,
        publicKey
      }
    },
    setChainCode(state, {payload}) {
      const {chainCode} = payload;
      return {
        ...state,
        chainCode
      }
    },
    setWalletType(state, {payload}) {
      let {walletType,dpath} = payload;
      const wallet = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === walletType.toLowerCase().concat('(eth)'));
      dpath = dpath || wallet.dpath;
      return {
        ...state,
        dpath,
        walletType
      }
    },
    setAddress(state, {payload}) {
      const {address} = payload;
      return {
        ...state,
        address
      }
    },
    reset(state, {payload}) {
      return {
        ...state,
        publicKey: "",
        chainCode: "",
        dpath: "",
        walletType: '',
        address:''
      }
    }
  },
  effects: {
    * setKeyAndCode({payload}, {put}) {
      const {publicKey, chainCode} = payload;
      const address = getAddresses({publicKey, chainCode, pageNum: 0, pageSize: 1})[0];
      yield  put({type: "setPublicKey", payload});
      yield  put({type: "setChainCode", payload});
      yield  put({type: 'setAddress', payload: {address}})
    },
  }
}
