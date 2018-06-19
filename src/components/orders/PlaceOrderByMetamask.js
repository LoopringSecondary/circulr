import React from 'react';
import {Button, Form, Input, Select, Slider,Card,Icon,Radio,Tabs,Steps} from 'antd'
import intl from 'react-intl-universal'
import Alert from 'LoopringUI/components/Alert'
import PlaceOrderSign from './PlaceOrderSign'
import PlaceOrderResult from './PlaceOrderResult'
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'
import Notification from 'LoopringUI/components/Notification'

const PlaceOrderByMetamask = (props) => {
  const {metaMask, wallet, placeOrderByMetaMask, form, dispatch} = props
  const isUnlocked = wallet.unlockType === 'metaMask'
  let currentStep = 0
  if(isUnlocked) {
    currentStep = 1
    if(placeOrderByMetaMask.orderState >= 1) {
      currentStep = 2
    }
  }

  const connectToMetamask = () => {
    dispatch({type:'metaMask/setLoading',payload:{loading:true}})
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.web3.version.getNetwork((err, netId) => {
        if (netId !== '1') {
          Notification.open({
            message:intl.get('notifications.title.unlock_fail'),
            description:intl.get('wallet_meta.mainnet_tip'),
            type:'error'
          })
          dispatch({type:'metaMask/setLoading',payload:{loading:false}})
          return
        }
        let address = window.web3.eth.accounts[0]
        if(wallet.address !== address) {
          Notification.open({
            message:intl.get('notifications.title.unlock_fail'),
            description:intl.get('notifications.message5.unlock_diff_address_to_sign', {address:wallet.address}),
            type:'error'
          })
          dispatch({type:'metaMask/setLoading',payload:{loading:false}})
          return
        }
        dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
        Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
        dispatch({type: 'sockets/unlocked'});
        dispatch({type:'metaMask/setLoading',payload:{loading:false}})
        dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})

        let alert = false
        var accountInterval = setInterval(function() {
          if ((!window.web3 || !window.web3.eth.accounts[0]) && !alert) {
            alert = true
            console.log("MetaMask account locked:", address)
            clearInterval(accountInterval)
            dispatch({type:'wallet/lock'});
            Notification.open({
              message:intl.get('wallet_meta.logout_title'),
              description:intl.get('wallet_meta.logout_tip'),
              type:'warning'
            })
            return
          }
          if (window.web3.eth.accounts[0] !== address) {
            address = window.web3.eth.accounts[0];
            Notification.open({
              message:intl.get('wallet_meta.account_change_title'),
              description:intl.get('wallet_meta.account_change_tip'),
              type:'info'
            })
            if(address) {
              console.log("MetaMask account changed to:", address)
              dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
            }
          }
        }, 100);
      })
    } else {
      let content = intl.get('wallet_meta.install_tip')
      if(window.web3 && !window.web3.eth.accounts[0]) { // locked
        content = intl.get('wallet_meta.unlock_tip')
      }
      Notification.open({
        message:intl.get('notifications.title.unlock_fail'),
        description:content,
        type:'error'
      })
      dispatch({type:'metaMask/setLoading',payload:{loading:false}})
    }
  }
  const steps = [{
    title: intl.get('place_order_by_metamask.step_connect'),
    content: 'First-content',
  }, {
    title: intl.get('place_order_by_metamask.step_sign'),
    content: 'Second-content',
  }, {
    title: intl.get('place_order_by_metamask.step_result'),
    content: 'Last-content',
  },
  ]
  return (
    <Card className="rs" title={<div className="pl10 ">{intl.get('place_order_by_metamask.title')}</div>}>
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
                <div><i className={`fs36 icon-metamaskwallet text-primary`}></i></div>
                <Button className="mt15" type="primary" onClick={connectToMetamask}>{intl.get('place_order_by_metamask.connect')}</Button>
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
    metaMask:state.metaMask,
    wallet:state.wallet,
    placeOrderByMetaMask:state.placeOrderByMetaMask
  }
}

export default Form.create()(connect(mapToProps)(PlaceOrderByMetamask));


