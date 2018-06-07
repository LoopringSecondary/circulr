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

const PlaceOrderByLedger = (props) => {
  const {wallet, hardwareWallet, placeOrder, placeOrderByLedger, dispatch} = props
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  let currentStep = 0
  if(placeOrderByLedger.ledger && placeOrderByLedger.addressConfirmed) {
    currentStep = 1
    if(placeOrder.orderState >= 1) {
      currentStep = 2
    }
  }

  const unlock = () => {
    dispatch({type:"hardwareWallet/setWalletType",payload:{walletType:'ledger'}});
    const walletConfig = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'ledger(eth)');
    connectLedger().then(res =>{
      if(!res.error){
        const ledger = res.result;
        getLedgerPublicKey(walletConfig.dpath,ledger).then(resp => {
          if(!resp.error){
            const {chainCode, publicKey} = resp.result;
            dispatch({type: "placeOrderByLedger/connectedChange", payload: {ledger}});
            dispatch({type: "hardwareWallet/setKeyAndCode", payload: {chainCode, publicKey}});
          } else {
            Notification.open({
              message: 'Connect Ledger Failed',
              type: "error",
              description: resp.error
            });
          }
        });
      } else {
        Notification.open({
          message: 'Connect Ledger Failed',
          type: "error",
          description: res.error
        });
      }
    });
  };

  const confirmAddress = () => {
    if (address && placeOrderByLedger.ledger) {
      dispatch({type: 'wallet/unlockLedgerWallet', payload: {ledger:placeOrderByLedger.ledger, dpath: `${dpath}/0`}});
      dispatch({type: 'hardwareWallet/reset', payload: {}});
      dispatch({type: 'sockets/unlocked'})
      dispatch({type: 'placeOrderByLedger/confirmAddressChange', payload: {confirmed:true}});
    } else {
      Notification.open({type: 'error',  description:intl.get('unlock.connect_ledger_tip')})
    }
  }

  const moreAddress = () => {
    if (address) {
      dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      dispatch({type: 'hardwareWallet/reset', payload: {}});
      dispatch({type:'layers/showLayer',payload:{id:'determineAddress'}});
    } else {
      Notification.open({type: 'error',  description:intl.get('unlock.connect_ledger_tip')})
    }
  };

  const steps = [{
    title: '连接',
    content: 'First-content',
  }, {
    title: '交易签名',
    content: 'Second-content',
  }, {
    title: '结果',
    content: 'Last-content',
  },
  ]
  return (
    <Card className="rs" title={<div className="pl10 ">Place Order By Ledger</div>}>
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
                  <div className="mt10">连接 Leager</div>
                  <Button className="mt15" type="default" onClick={unlock}> Connect </Button>
                </div>
              }
              {placeOrderByLedger.ledger && !placeOrderByLedger.confirmAddressChange &&
              <div className="text-center p15">
                <i className={`fs36 icon-ledgerwallet text-primary`}></i>
                <div className="mt10">请确认解锁地址</div>
                <div className="mt10">{address}</div>
                <Button className="mt15" type="default" onClick={confirmAddress}> Confirm address </Button>
                <Button className="mt15" type="default" disabled onClick={moreAddress}> {intl.get('wallet_determine.actions_other_address')} </Button>
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
    placeOrder:state.placeOrder,
    placeOrderByLedger:state.placeOrderByLedger
  }
}
export default connect(mapToProps)(PlaceOrderByLedger);


