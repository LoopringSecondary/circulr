import React from 'react';
import { Input,Button,Select } from 'antd';
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'
import Notification from '../../../common/loopringui/components/Notification'

function MetaMask(props) {

  const unlock = () => {
    if(window.web3 && window.web3.eth.accounts[0]){
      const address = window.web3.eth.accounts[0]
      props.dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
      Notification.open({type:'success',message:'解锁成功',description:'unlock'});
      routeActions.gotoPath('/wallet')
    }
  };

  return (
    <div>
		<h2 className="text-center text-primary">Connect to  MetaMask</h2>
		<div className="card bg-white">
		    <div className="card-body">
		        <ul className="list list-md">
              <Button  onClick={unlock} > Connect</Button>
		            <li><i className="icon-export"></i> <a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Get MetaMask Chrome extension</a></li>
		            <li><i className="icon-export"></i> <a href="https://metamask.io/" target="_blank">Visit MetaMask website</a></li>
		        </ul>
		    </div>
		</div>
    </div>
  )
}
export default connect()(MetaMask)
