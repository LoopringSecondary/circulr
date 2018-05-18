import React from 'react';
import { Input,Button,Select } from 'antd';
import {connect} from 'dva'
import {MetaMaskAccount,} from "LoopringJS/ethereum/account";
import routeActions from 'common/utils/routeActions'

function MetaMask(props) {

  const unlock = () => {
    if(window.web3 && window.web3.eth.accounts[0]){
      const address = window.web3.eth.accounts[0]
      props.dispatch({type:'wallet/unlockMetaMaskWallet',payload:{address}});
      routeActions.gotoPath('/wallet')
    }
  };

  return (
    <div>
        <h2 className="text-center text-primary">Connect to  MetaMask</h2>
        <div className="blk-md"></div>
        <ul className="list list-md text-center">
            <li><Button onClick={unlock} className="btn btn-primary btn-xlg" style={{width:"260px"}}> Connect</Button></li>
            <div className="blk-md"></div>
            <li><a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank"><i className="icon-export"></i> Get MetaMask Chrome extension</a></li>
            <li><a href="https://metamask.io/" target="_blank"><i className="icon-export"></i> Visit MetaMask website</a></li>
        </ul>
    </div>
  )
}
export default connect()(MetaMask)
