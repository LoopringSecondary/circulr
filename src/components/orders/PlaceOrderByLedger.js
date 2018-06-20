import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderSign from './PlaceOrderSign'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification';
import {getXPubKey as getLedgerPublicKey,connect as connectLedger} from "LoopringJS/ethereum/ledger";
import {wallets} from "../../common/config/data";
import {trimAll} from "LoopringJS/common/utils";
import {LedgerAccount} from "LoopringJS/ethereum/account";

const PlaceOrderByLedger = (props) => {
  const {wallet, hardwareWallet, placeOrderByLedger, dispatch} = props
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  let currentStep = 0
  if(placeOrderByLedger.ledger && placeOrderByLedger.addressConfirmed) {
    currentStep = 1
    if(placeOrderByLedger.orderState >= 1) {
      currentStep = 2
    }
  }

  const unlock = () => {
    dispatch({type:"hardwareWallet/setWalletType",payload:{walletType:'ledger'}});
    const walletConfig = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'ledger(eth)');
    let ledger = null;
    connectLedger().then(res =>{
      if(!res.error){
        ledger = res.result;
        return getLedgerPublicKey(walletConfig.dpath,ledger)
      } else {
        console.log(res.error)
        Notification.open({
          message: 'Connect Ledger Failed',
          type: "error",
          description: intl.get('notifications.message.ledger_connect_failed')
        });
      }
    }).then(resp =>{
      if(!resp.error){
        const {chainCode, publicKey} = resp.result;
        dispatch({type: "hardwareWallet/setKeyAndCode", payload: {chainCode, publicKey}});
        dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger, dpath: `${dpath}/0`}});
        dispatch({type: "placeOrderByLedger/connectedChange", payload: {ledger}});
        dispatch({type: 'placeOrderByLedger/confirmAddressChange', payload: {confirmed:true}});
      } else {
        console.log(resp.error)
        Notification.open({
          message: 'Connect Ledger Failed',
          type: "error",
           description: intl.get('notifications.message.ledger_connect_failed')
        });
      }
    }).catch(error => {
      console.log(error)
      Notification.open({
        message: 'Connect Ledger Failed',
        type: "error",
        description: intl.get('notifications.message.ledger_connect_failed')
      });
    });
  };

  const moreAddress = () => {
    if (address) {
      dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      // dispatch({type: 'hardwareWallet/reset', payload: {}});
      dispatch({type: 'layers/showLayer', payload: {id: 'chooseLedgerAddress', chooseAddress: chooseAddress}});
    } else {
      Notification.open({type: 'error',  description:intl.get('unlock.connect_ledger_tip')})
    }
  };

  const chooseAddress = (path) => {
    connectLedger().then(res => {
      if (!res.error) {
        const ledger = res.result;
        getLedgerPublicKey(path, ledger).then(resp => {
          if (!resp.error) {
            const {address} = resp.result;
            if (address.toLowerCase() === wallet.address.toLowerCase()) {
              dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger, dpath: path}});
              dispatch({type: 'placeOrderByLedger/pathChange', payload: {path}});
              dispatch({type: 'placeOrderByLedger/connectedChange', payload: {ledger}});
              dispatch({type: 'placeOrderByLedger/confirmAddressChange', payload: {confirmed:true}});
            } else {
              Notification.open({type:'warning',description:intl.get('notifications.title.dif_address')});
            }
          }
        });
      }
    });
  };

  const steps = [{
    title: intl.get('place_order_by_ledger.step_connect'),
    content: 'First-content',
  }, {
    title: intl.get('place_order_by_ledger.step_sign'),
    content: 'Second-content',
  }, {
    title: intl.get('place_order_by_ledger.step_result'),
    content: 'Last-content',
  },
  ]
  return (
    <Card className="rs" title={<div className="pl10 ">{intl.get('place_order_by_ledger.title')}</div>}>
      <div className="p15">
        <div className="mb20 mt15">
          <Steps current={currentStep}>
           {steps.map(item => <Steps.Step key={item.title} title={item.title} />)}
          </Steps>
        </div>
        {
          currentStep === 0 &&
          <div className="mt15">
            <div className="zb-b">
              {!placeOrderByLedger.ledger &&
                <div className="text-center p15">
                  <i className={`fs36 icon-ledgerwallet text-primary`}></i>
                  <div className="mt10">{intl.get('place_order_by_ledger.connect')}</div>
                  <Button className="mt15" type="default" onClick={unlock}> {intl.get('unlock.actions_unlock')} </Button>
                </div>
              }
              {placeOrderByLedger.ledger && address !== wallet.address &&
              <div className="text-center p15">
                <i className={`fs36 icon-ledgerwallet text-primary`}></i>
                <div className="mt10">{intl.get('place_order_by_ledger.confirm_unlock_address')}</div>
                <div className="mt10">{address}</div>
                <Button className="mt15" type="default" onClick={moreAddress}> {intl.get('wallet_determine.actions_other_address')} </Button>
              </div>
              }
            </div>
          </div>
        }
        {
          currentStep === 1 &&
          <div className="mt15">
            <PlaceOrderSign />
          </div>
        }
        {
          currentStep === 2 &&
          <div className="mt15">
            <PlaceOrderResult />
          </div>
        }
      </div>
    </Card>
  );
};

function mapToProps(state) {
  return {
    wallet:state.wallet,
    hardwareWallet:state.hardwareWallet,
    placeOrderByLedger:state.placeOrderByLedger
  }
}
export default connect(mapToProps)(PlaceOrderByLedger);


