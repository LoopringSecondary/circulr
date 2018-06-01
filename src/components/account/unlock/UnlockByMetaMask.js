import React from 'react';
import { Modal, Button, Icon, Alert, Steps } from 'antd';
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';

function MetaMask(props) {
  const metaMask = props.metaMask
  const chromeExtention = {
    'Opera' : "https://addons.opera.com/extensions/details/metamask/",
    'Chrome' : "https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn",
    'Firefox' : "https://addons.mozilla.org/firefox/addon/ether-metamask/"
  }
  let browserType = '',  metamaskState = '', visible = false
  var u = navigator.userAgent, app = navigator.appVersion;
  if(u.indexOf('OPR') > -1) {
    browserType = 'Opera'
  } else if (u.indexOf('Chrome') > -1) {
    browserType = 'Chrome'
  } else if(u.indexOf('Firefox') > -1) {
    browserType = 'Firefox'
  } else {
    browserType = 'Others'
  }
  if(window.web3){
    if(!window.web3.eth.accounts[0]) { // locked
      metamaskState = 'locked'
    }
  } else { // to install
    metamaskState = 'uninstall'
  }

  const openToRefresh = () => {
    if(metamaskState === 'uninstall') {
      if(browserType !== 'Others') {
        window.open(chromeExtention[browserType])
      }
    }
    metaMask.setRefreshModalVisible({refreshModalVisible:true})
  }

  const hideModal = () => {
    metaMask.setRefreshModalVisible({refreshModalVisible:false})
  }

  const refresh = () => {
    if (window.web3 && window.web3.eth.accounts[0]) {
      connectToMetamask()
    } else {
      window.STORAGE.wallet.storeUnlockedAddress('MetaMask', '')
      window.location.reload()
    }
  }

  const connectToMetamask = () => {
    metaMask.setLoading({loading:true})
    if (window.web3 && window.web3.eth.accounts[0]) {
      window.web3.version.getNetwork((err, netId) => {
        if (netId !== '1') {
          Notification.open({
            message:intl.get('notifications.title.unlock_fail'),
            description:intl.get('wallet_meta.mainnet_tip'),
            type:'error'
          })
          metaMask.setLoading({loading:false})
          return
        }
        let address = window.web3.eth.accounts[0]
        props.dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
        Notification.open({type:'success',message:intl.get('notifications.title.unlock_suc')});
        props.dispatch({type: 'sockets/unlocked'});
        routeActions.gotoPath('/wallet');
        metaMask.setLoading({loading:false});

        let alert = false
        var accountInterval = setInterval(function() {
          if ((!window.web3 || !window.web3.eth.accounts[0]) && !alert) {
            alert = true
            console.log("MetaMask account locked:", address)
            clearInterval(accountInterval)
            props.dispatch({type:'wallet/lock'});
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
              props.dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
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
      metaMask.setLoading({loading:false})
    }
  }

  return (
    <div>
      <Modal
        title={intl.get('wallet_meta.unlock_steps_title')}
        visible={metaMask.refreshModalVisible}
        maskClosable={false}
        onOk={refresh}
        onCancel={hideModal}
        okText={null}
        cancelText={null}
        footer={null}
      >
        <Steps direction="vertical">
          {metamaskState === 'uninstall' && <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_install_title')} description={intl.get('wallet_meta.unlock_step_install_content')} />}
          <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_unlock_title')} description={intl.get('wallet_meta.unlock_step_unlock_content')} />
          <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_refresh_title')}
                      description={
                        <div>
                          <div>{intl.get('wallet_meta.unlock_step_refresh_content')}</div>
                          <Button onClick={refresh} type="primary" className="mt5" loading={false}>{intl.get('wallet_meta.unlock_refresh_button')}</Button>
                        </div>
                      }
          />
        </Steps>
      </Modal>
      <h2 className="text-center text-primary">{intl.get('wallet.title_connect',{walletType:'MetaMask'})}</h2>
      <div className="blk-md"></div>
      <ul className="list list-md text-center">
        <li>
          {!browserType || browserType === 'Others' &&
            <Button size="large" style={{width:"260px"}} disabled>{intl.get('wallet_meta.browser_tip')}</Button>
          }
          {browserType && browserType !== 'Others' && metamaskState === 'locked' &&
            <Button size="large" style={{width:"260px"}} onClick={openToRefresh}>{intl.get('wallet_meta.unlock_metaMask_tip')}</Button>
          }
          {browserType && browserType !== 'Others' && metamaskState === 'uninstall' &&
            <Button size="large" style={{width:"260px"}} onClick={openToRefresh}>{intl.get('wallet_meta.install_metaMask_tip')}</Button>
          }
          {browserType && browserType !== 'Others' && !metamaskState &&
            <Button onClick={connectToMetamask} size="large" style={{width:"260px"}}> {intl.get('unlock.actions_connect',{walletType:'MetaMask'})}</Button>
          }
        </li>
        <div className="blk-md"/>
        <li>
          {browserType && browserType !== 'Others' &&
            <a href={chromeExtention[browserType]} target="_blank">
              <i className="icon-export"/> {intl.get('wallet_meta.actions_get_metaMask',{browser:browserType})}
            </a>
          }
        </li>
        <li><a href="https://metamask.io/" target="_blank"><i className="icon-export"/>{intl.get('wallet_meta.actions_visit_metaMask')}</a></li>
      </ul>
    </div>
  )
}
export default connect()(MetaMask)
