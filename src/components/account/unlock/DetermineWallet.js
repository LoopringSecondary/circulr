import React from 'react';
import {Button, Card, Input, Radio} from 'antd'
import {paths} from '../../../common/config/data'
import routeActions from 'common/utils/routeActions'
import {getXPubKey as getTrezorPublicKey} from "LoopringJS/ethereum/trezor";
import {getXPubKey as getLedgerPublicKey,connect} from "../../../common/loopringjs/src/ethereum/ledger";
import intl from 'react-intl-universal'
import Notification from '../../../common/loopringui/components/Notification'

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
    this.props.determineWallet.customChange({customPath:e.target.value})
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
        Notification.open({type:'success',message:intl.get('wallet.notification_unlock_suc')});
        break;
      case 'trezor':
        dispatch({type: 'wallet/unlockTrezorWallet', payload: {dpath: `${dpath}/${pageNum * pageSize + index}`,address}});
        Notification.open({type:'success',message:intl.get('wallet.notification_unlock_suc')});

        break;
      case 'ledger':
        connect().then(res => {
          if(!res.error){
            const ledger = res.result;
            dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger,dpath: `${dpath}/${pageNum * pageSize + index}`}});
            Notification.open({type:'success',message:intl.get('wallet.notification_unlock_suc')});
          }else{
            Notification.open({type:'error',message:intl.get('wallet.notification_unlock_fail'),description:intl.get('wallet.connect_ledger_tip')});
          }
        });
        break;
      default:
    }
    dispatch({type:'sockets/unlocked'});
    determineWallet.reset();
    routeActions.gotoPath('/wallet');
  };

  render() {
    const {determineWallet, hardwareWallet} = this.props;
    const wallet = determineWallet || hardwareWallet;
    const {dpath, addresses, pageNum,customPath} = wallet;
    return (
      <div>
       <div className="d-flex justify-content-between align-items-center">
           <span><Button className="btn">{intl.get('common.back')}</Button></span>
           <h3 className="text-color-dark-1">{intl.get('wallet.title_deter_address')}</h3>
           <span style={{display:"block",width:"62px"}}>&nbsp;</span>
       </div>
       <div className="blk"></div>
       <div className="">
        <div className="dpath">
          <div className="">
            <h4 className="dpath-header">1. {intl.get('wallet_determine.title_select_path')}</h4>
            <div className="dpath-body">
            <Radio.Group className="" onChange={this.handlePathChange} value={dpath}>
              {paths.filter(path => this.isSupported(path.path)).map((item, index) =>
                <Radio className="d-block" value={item.path} key={index}>
                  <span className="">{item.path}</span>
                  <span className="">{item.wallet.join(", ")}</span>
                </Radio>
              )}
              <Radio className="d-block" value={customPath}>
              <div className="d-flex justify-content-between align-items-center">
                <div className="text-color-2">{intl.get('wallet_determine.custom_path')}: </div>
                <Input value={customPath} onChange={this.onCustomPathChange}  />
                </div>
              </Radio>
            </Radio.Group>
          </div>
        </div>
        </div>
        <div className="account-addresses">
          <h4 className="account-addresses-header">2. {intl.get('wallet_determine.title_deter_address')}</h4>
          <ul className="account-addresses-body">
            {addresses.length > 0 && addresses.map((address, index) => {
              return (
                <li key={index}>
                  <span>{address}</span>
                  <Button size="small" onClick={this.confirm.bind(this, index)}>
                    {intl.get('common.import')}</Button>
                </li>)
            })}
            {
              addresses.length <= 0 && <li className="account-addresses-tip">{intl.get('wallet_determine.no_address_tip')}</li>
            }
          </ul>
          <div className="d-flex justify-content-between account-addresses-pagenav">
            <Button onClick={this.previousPage} disabled={pageNum <= 0}>{intl.get('common.previous_page')}</Button>
            <Button onClick={this.nextPage}>{intl.get('common.next_page')}</Button>
          </div>
        </div>
      </div>
      </div>
    )
  }
}
