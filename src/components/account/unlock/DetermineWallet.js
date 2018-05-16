import React from 'react';
import {Button, Card, Input, Radio} from 'antd'
import {paths} from '../../../common/config/data'
import routeActions from 'common/utils/routeActions'
import {getXPubKey as getTrezorPublicKey} from "LoopringJS/ethereum/trezor";
import {getXPubKey as getLedgerPublicKey,connect} from "../../../common/loopringjs/src/ethereum/ledger";


const ledgerPaths = ["m/44'/60'/0'/0", "m/44'/60'/0'", "m/44'/61'/0'/0", "m/44'/60'/160720'/0'", "m/44'/1'/0'/0"];

export default class DetermineWallet extends React.Component {

  nextPage = () => {
    const {determineWallet} = this.props;
    const {pageNum} = determineWallet;
    determineWallet.pageNumChange({pageNum: pageNum + 1})
  };
  previousPage = () => {
    const {determineWallet} = this.props;
    const {pageNum} = determineWallet;
    determineWallet.pageNumChange({pageNum: pageNum - 1})
  };

  handlePathChange = async (e) => {
    const {determineWallet} = this.props;
    const {walletType, mnemonic} = determineWallet;
    const dpath = e.target.value;
    switch (walletType) {
      case 'mnemonic':
        determineWallet.setMnemonicWallet({dpath, mnemonic});
        break;
      case 'trezor':
        await getTrezorPublicKey(dpath).then(res => {
          if (!res.error) {
           const {chainCode,publicKey}  = res.result;
            determineWallet.setHardwareWallet({dpath, publicKey, chainCode, walletType})
          }
        });
        break;
      case 'ledger':
        connect().then(res =>{
          if(!res.error) {
            const ledger = res.result;
            getLedgerPublicKey(dpath, ledger).then(resp => {
              if (!resp.error) {
                const {chainCode, publicKey} = resp.result;
                determineWallet.setHardwareWallet({dpath, publicKey, chainCode, walletType})
              }
            });
          }});
        break;

    }
  };
  onCustomPathChange = (e) => {
    this.props.determineWallet.CustomChange({customPath:e.target.value})
  };

  isSupported = (path) => {
    const {determineWallet, hardwareWallet} = this.props;
    const wallet = determineWallet || hardwareWallet;
    const {walletType} = wallet;
    if (walletType === 'ledger') {
      return !!ledgerPaths.find(dpath => dpath === path);
    }
    return true;
  };

  confirm = (index) => {
    const {determineWallet, dispatch} = this.props;
    const {dpath, walletType, mnemonic,pageNum,pageSize,addresses} = determineWallet;
    const address = addresses[index];
    switch (walletType) {
      case 'mnemonic':
        dispatch({type: 'wallet/unlockMnemonicWallet', payload: {mnemonic, dpath: `${dpath}/${pageNum * pageSize + index}`}});
        break;
      case 'trezor':
        dispatch({type: 'wallet/unlockTrezorWallet', payload: {dpath: `${dpath}/${pageNum * pageSize + index}`,address}});
        break;
      case 'ledger':
        connect().then(res => {
          if(!res.error){
            const ledger = res.result;
            dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger,dpath: `${dpath}/${pageNum * pageSize + index}`}});
          }
        });
        break;
      default:
    }
    determineWallet.reset();
    routeActions.gotoPath('/wallet')
  };

  render() {
    const {determineWallet, hardwareWallet} = this.props;
    const wallet = determineWallet || hardwareWallet;
    const {dpath, addresses, pageNum,customPath} = wallet;
    return (
      <Card title={<div className="fs1 color-black-1">选择账户</div>}>
        <div className='bg-grey-50'>
          <div className="bg-white zb-b">
            <div className="zb-b-b fs16 color-primary-1 p10 zb-b-b bg-grey-50">
              1. Select Dpath
            </div>
            <Radio.Group className="" onChange={this.handlePathChange} value={dpath}>
              {paths.filter(path => this.isSupported(path.path)).map((item, index) =>
                <Radio className="d-block zb-b-b p10" value={item.path} key={index}>
                  <span className="color-black-2 fs14 lh20">{item.path}</span>
                  <span className="color-black-3 fs12 ml10">{item.wallet.join(", ")}</span>
                </Radio>
              )}
              <Radio className="d-block p10" value={customPath}>
                Custom Path:
                <Input
                  className="d-inline ml10"
                  style={{width: '200px'}}
                  value={customPath} onChange={this.onCustomPathChange}
                />
              </Radio>
            </Radio.Group>
          </div>
        </div>
        <div className='mb10 zb-b'>
          <div className="fs2 color-primary-1 p10 zb-b-b bg-grey-50">2. 选择地址</div>
          <div className="pl10 pr10">
            {addresses.length > 0 && addresses.map((address, index) => {
              return (
                <div key={index} className="pt10 pb10 zb-b-b fs14 color-black-2 d-flex justify-content-between row">
                  <span className='col-6'>{address}</span>
                  <Button className='col-auto mr15' size="small" onClick={this.confirm.bind(this, index)}>
                    Import</Button>
                </div>)
            })}
            {
              addresses.length <= 0 && <span className='col-6'>没有合法的地址</span>
            }
          </div>
          <div className="d-flex justify-content-between zb-b-t p10">
            <Button onClick={this.previousPage} disabled={pageNum <= 0}>Previous Page</Button>
            <Button onClick={this.nextPage}> Next Page</Button>
          </div>
        </div>
      </Card>
    )
  }
}
