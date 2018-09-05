import {fromMnemonic, getAddresses} from "LoopringJS/ethereum/account";
import {getXPubKey as getTrezorPublicKey} from "LoopringJS/ethereum/trezor";
import {getXPubKey as getLedgerPublicKey, connect} from "LoopringJS/ethereum/ledger";

export default {
  namespace: 'determineWallet',
  state: {
    pageSize: 5,
    pageNum: 0,
    publicKey: '',
    chainCode: '',
    walletType: '',
    mnemonic: '',
    dpath: '',
    customPath: "m/44'/60'/1'/0",
    addresses: []
  },
  reducers: {
    reset(state, {payload}) {
      return {
        pageSize: 5,
        pageNum: 0,
        publicKey: '',
        chainCode: '',
        walletType: '',
        mnemonic: '',
        dpath: '',
        addresses: [],
        customPath: "m/44'/60'/1'/0",
      }
    },
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
    setAddresses(state, {payload}) {
      const {addresses} = payload;
      return {
        ...state,
        addresses
      }
    },
    setWalletType(state, {payload}) {
      const {walletType} = payload;
      return {
        ...state,
        walletType
      }
    },
    setMnemonic(state, {payload}) {
      const {mnemonic} = payload;
      return {
        ...state,
        mnemonic
      }
    },
    setDpath(state, {payload}) {
      const {dpath} = payload;
      return {
        ...state,
        dpath,
      }
    },
    setPageNum(state, {payload}) {
      const {pageNum} = payload;
      return {
        ...state,
        pageNum,
      }
    },
    setCustomChange(state, {payload}) {
      const {customPath} = payload;
      return {
        ...state,
        customPath,
      }
    }
  },
  effects: {
    * setMnemonicWallet({payload}, {put, select}) {
      const {mnemonic, dpath} = payload;
      const {pageSize} = yield select((state) => state.determineWallet);
      const addresses = [];
      if (dpath.substr(dpath.length - 1, 1) !== '/') {
        for (let i = 0; i < pageSize; i++) {
          addresses.push(fromMnemonic(mnemonic, dpath.concat(`/${i}`)).getAddress())
        }
      }
      yield put({type: 'setMnemonic', payload: {mnemonic}});
      yield put({type: 'setWalletType', payload: {walletType: 'mnemonic'}});
      yield put({type: 'setDpath', payload: {dpath}});
      yield put({type: 'setAddresses', payload: {addresses}});
      yield put({type: 'setPageNum', payload: {pageNum: 0}});
    },

    * changeDpath({payload}, {put}) {
      const {dpath, publicKey, chainCode} = payload;
      yield put({type: 'setPublicKey', payload: {publicKey}});
      yield put({type: 'setChainCode', payload: {chainCode}});
      yield put({type: 'setDpath', payload: {dpath}});
    },

    * setHardwareWallet({payload}, {put, select}) {
      const {pageSize} = yield select((state) => state.determineWallet);
      const pageNum = 0;
      const {publicKey, chainCode, walletType, dpath} = payload;
      if (publicKey && chainCode) {
        const addresses = getAddresses({pageSize, publicKey, chainCode, pageNum});
        yield put({type: 'setAddresses', payload: {addresses}});
      } else {
        yield put({type: 'setAddresses', payload: {addresses: []}});
      }
      yield put({type: 'setPublicKey', payload: {publicKey}});
      yield put({type: 'setChainCode', payload: {chainCode}});
      yield put({type: 'setWalletType', payload: {walletType}});
      yield put({type: 'setDpath', payload: {dpath}});
      yield put({type: 'setPageNum', payload: {pageNum}});
    },
    * pageNumChange({payload}, {put, select}) {
      const {walletType, pageSize, mnemonic, dpath, publicKey, chainCode} = yield select((state) => state.determineWallet);
      const {pageNum} = payload;
      const addresses = [];
      switch (walletType) {
        case 'mnemonic' :
          if (dpath.substr(dpath.length - 1, 1) !== '/') {
            for (let i = 0; i < pageSize; i++) {
              addresses.push(fromMnemonic(mnemonic, dpath.concat(`/${pageSize * pageNum + i}`)).getAddress())
            }
          }
          break;
        case 'trezor':
        case 'ledger':
          addresses.push(...getAddresses({pageSize, publicKey, chainCode, pageNum}));
          break;
        default:
      }
      yield put({type: 'setPageNum', payload: {pageNum}});
      yield put({type: 'setAddresses', payload: {addresses}})
    },
    * customChange({payload}, {put, select}) {
      const {customPath, dpath, walletType, mnemonic} = yield select((state) => state.determineWallet);
      const path = payload.customPath;
      debugger;
      if (customPath === dpath) {
        if (path) {
          switch (walletType) {
            case 'mnemonic':
              yield put({type: 'setMnemonicWallet', payload: {mnemonic, dpath: path}});
              break;
            case 'trezor': {
              const {publicKey, chainCode} = yield getTrezorPublicKey(path).then(res => {
                return res.result
              });
              yield put({type: 'setHardwareWallet', payload: {publicKey, chainCode, dpath: path, walletType}});
              break;
            }
            case 'ledger':
              const res = yield connect().then(res => {
                if (!res.error) {
                  const ledger = res.result;
                  return getLedgerPublicKey(path, ledger).then(resp => {
                    if (!resp.error) {
                      return resp.result;
                    }
                  });
                }
              });
              if (res) {
                const {publicKey, chainCode} = res;
                yield put({type: 'setHardwareWallet', payload: {publicKey, chainCode, dpath: path, walletType}});
              } else {
                yield put({type: 'setHardwareWallet', payload: {dpath: path, walletType}});
              }
              break;
            default:
              yield put({type: 'setDpath', payload: {dpath: path}});
          }
        } else {
          yield put({type: 'setDpath', payload: {dpath: path}});
        }
      }
      yield put({type: 'setCustomChange', payload: {customPath: path}})
    }
  }
}
