import React from 'react';
import {Button, Modal, Steps} from 'antd';
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
  let browserType = '', browserSupported = false,  metamaskState = '', visible = false
  var u = navigator.userAgent, app = navigator.appVersion;
  if(u.indexOf('OPR') > -1) {
    browserType = 'Opera'
    browserSupported = true
  } else if (u.indexOf('Chrome') > -1) {
    browserType = 'Chrome'
    browserSupported = true
  } else if(u.indexOf('Firefox') > -1) {
    browserType = 'Firefox'
    browserSupported = true
  } else {
    browserType = 'Others'
  }
  if(window.web3){
    if(!window.web3.eth.accounts[0]) { // locked
      metamaskState = 'locked'
    }
  } else { // to install
    metamaskState = 'notInstalled'
  }

  const openToRefresh = () => {
    if(metamaskState === 'notInstalled') {
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
        routeActions.gotoPath('/trade');
        metaMask.setLoading({loading:false});
        props.dispatch({type:'layers/hideLayer', payload:{id:'unlock'}})

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
          if (window.web3.eth.accounts[0] && window.web3.eth.accounts[0] !== address) {
            address = window.web3.eth.accounts[0];
            Notification.open({
              message:intl.get('wallet_meta.account_change_title'),
              description:intl.get('wallet_meta.account_change_tip'),
              type:'info'
            })
            console.log("MetaMask account changed to:", address)
            props.dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
            props.dispatch({type: 'sockets/unlocked'});
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
    <div style={{width:"480px"}}>
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
          {metamaskState === 'notInstalled' && <Steps.Step status="process" title={intl.get('wallet_meta.unlock_step_install_title')} description={intl.get('wallet_meta.unlock_step_install_content')} />}
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
      <ul className="list list-md text-center">
        <li>
          {!browserType || browserType === 'Others' &&
            <Button className="btn btn-primary btn-block btn-xxlg" size="large" disabled>{intl.get('wallet_meta.browser_tip')}</Button>
          }
          {browserSupported && metamaskState === 'locked' &&
            <Button className="btn btn-primary btn-block btn-xxlg" size="large" onClick={openToRefresh}>{intl.get('wallet_meta.unlock_metaMask_tip')}</Button>
          }
          {browserSupported && metamaskState === 'notInstalled' &&
            <Button className="btn btn-primary btn-block btn-xxlg" size="large" onClick={openToRefresh}>{intl.get('wallet_meta.install_metaMask_tip')}</Button>
          }
          {browserSupported && !metamaskState &&
            <Button className="btn btn-primary btn-block btn-xxlg" onClick={connectToMetamask} size="large"> {intl.get('unlock.actions_connect',{walletType:'MetaMask'})}</Button>
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
