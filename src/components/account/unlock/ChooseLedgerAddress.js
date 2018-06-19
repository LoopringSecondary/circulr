import React from 'react';
import {connect} from "dva";
import {Card, Radio, Button, Input} from 'antd';
import intl from 'react-intl-universal';
import {getXPubKey, connect as connectLedger} from "LoopringJS/ethereum/ledger";
import {paths} from '../../../common/config/data'
import Notification from '../../../common/loopringui/components/Notification'


const ledgerPaths = ["m/44'/60'/0'/0", "m/44'/60'/0'", "m/44'/61'/0'/0", "m/44'/60'/160720'/0'", "m/44'/1'/0'/0"];

const supportPaths = paths.filter(item => !!ledgerPaths.find(dpath => dpath === item.path));

function ChooseLedgerAddress({dispatch, pageNum, dpath, customPath, addresses,chooseLedgerAddress,wallet}) {

  const nextPage = () => {
    dispatch({type: 'determineWallet/pageNumChange', payload: {pageNum: pageNum + 1}})
  };
  const previousPage = () => {
    dispatch({type: 'determineWallet/pageNumChange', payload: {pageNum: pageNum - 1}})
  };

  const handlePathChange = async (e) => {
    const dpath = e.target.value;
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getXPubKey(dpath, ledger).then(resp => {
          if (!resp.error) {
            const {chainCode, publicKey} = resp.result;
            dispatch({
              type: 'determineWallet/setHardwareWallet',
              payload: {dpath, publicKey, chainCode, walletType: 'ledger'}
            });
          }
        });
      }
    });
  };
  const onCustomPathChange = (e) => {
    dispatch({type: 'determineWallet/customChange', payload: {customPath: e.target.value}})
  };

  const confirm = (index) => {
    const {chooseAddress} = chooseLedgerAddress;

    if(addresses[index].toLowerCase() !== wallet.address.toLowerCase()){
      Notification.open({type:'warning',description:intl.get('notifications.title.dif_address')});
      return;
    }
    if(chooseAddress){
      chooseAddress(dpath.concat(`/${index}`))
    }
    dispatch({type: 'layers/hideLayer', payload: {id: 'chooseLedgerAddress'}});
    dispatch({type:'determineWallet/reset'})
  };

  return (
    <Card title={intl.get('ledger_sign.unlock.title')}>
      <div className="">
        <div className="dpath">
          <div className="">
            <h4 className="dpath-header">1. {intl.get('wallet_determine.title_select_path')}</h4>
            <div className="dpath-body">
              <Radio.Group className="" onChange={handlePathChange} value={dpath}>
                {supportPaths.map((item, index) =>
                  <Radio className="d-block" value={item.path} key={index}>
                    <span className="">{item.path}</span>
                    <span className="">{item.wallet.join(", ")}</span>
                  </Radio>
                )}
                <Radio className="d-block" value={customPath}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-color-2">{intl.get('wallet_determine.custom_path')}:</div>
                    <Input value={customPath} onChange={onCustomPathChange}/>
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
                  <Button size="small" onClick={() => confirm(index)}>
                    {intl.get('common.import')}</Button>
                </li>)
            })}
            {
              addresses.length <= 0 &&
              <li className="account-addresses-tip">{intl.get('wallet_determine.no_address_tip')}</li>
            }
          </ul>
          <div className="d-flex justify-content-between account-addresses-pagenav">
            <Button onClick={previousPage} disabled={pageNum <= 0}>{intl.get('common.previous_page')}</Button>
            <Button onClick={nextPage}>{intl.get('common.next_page')}</Button>
          </div>
        </div>
      </div>


    </Card>
  )

}


function mapStateToProps(state) {

  return {
    pageSize: state.determineWallet.pageSize,
    pageNum: state.determineWallet.pageNum,
    dpath: state.determineWallet.dpath,
    customPath:state.determineWallet.customPath,
    addresses: state.determineWallet.addresses,
    wallet:state.wallet
  }

}

export default connect(mapStateToProps)(ChooseLedgerAddress)
