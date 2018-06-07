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
  const {wallet, hardwareWallet, placeOrder, dispatch} = props
  const {address, dpath, publicKey, chainCode, walletType} = hardwareWallet;

  console.log(11111, wallet, hardwareWallet)

  let currentStep = 0
  if(address) {
    currentStep = 1
    if(placeOrder.orderState >= 1) {
      currentStep = 2
    }
  }

  const unlock = () => {
    const walletConfig = wallets.find(wallet => trimAll(wallet.name).toLowerCase() === 'ledger(eth)');
    connectLedger().then(res =>{
      if(!res.error){
        const ledger = res.result;
        getLedgerPublicKey(walletConfig.dpath,ledger).then(resp => {
          if(!resp.error){
            const {chainCode, publicKey} = resp.result;
            dispatch({type: "hardwareWallet/setKeyAndCode", payload: {chainCode, publicKey}});
          }
        });
      }
    });
  };

  const moreAddress = () => {
    if (address) {
      props.dispatch({type: 'determineWallet/setHardwareWallet', payload: {publicKey, chainCode, dpath, walletType}});
      hardwareWallet.reset();
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
              <div className="text-center p15">
                <i className={`fs36 icon-ledgerwallet text-primary`}></i>
                <div className="mt10">连接 Leager</div>
                <Button className="mt15" type="default" onClick={unlock}> Connect </Button>
              </div>
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
    placeOrder:state.placeOrder
  }
}
export default connect(mapToProps)(PlaceOrderByLedger);


