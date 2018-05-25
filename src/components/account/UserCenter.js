import React from 'react';
import {Link} from 'dva/router';
import Notification from '../../common/loopringui/components/Notification'
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';
import routeActions from 'common/utils/routeActions'
import storage from 'modules/storage/'

function UserCenter(props) {
  const {userCenter,dispatch} = props;

  const copyAddress = () => {
    if(window.WALLET && window.WALLET.address){
      copy(window.WALLET.address) ? Notification.open({
        message: intl.get('navbar.subs.copy_success'),
        type: 'success', size: 'small'
      }) : Notification.open({message: intl.get('navbar.subs.copy_failed'), type: "error", size: 'small'})
    }else {
      Notification.open({message: 'please unlock your wallet first', type: "error", size: 'small'})
    }
  };

  const transfer = () => {
    dispatch({type: 'transfer/reset'})
    userCenter.hideLayer();
    userCenter.showLayer({id:'transferToken',symbol:null})
  };

  const quit = () => {
    dispatch({type:'wallet/lock'});
    storage.wallet.clearUnlockedAddress();
    window.WALLET = {}
    window.account = null
    userCenter.hideLayer();
    routeActions.gotoPath('/unlock')
  };

  return (
    <div>
    	<div id="account">
    	    <div className="account-side">
            {window.WALLET && window.WALLET.address && <div>
    	        <div className="poweroff text-color-dark" id="powerOff" onClick={quit}>
    	            <div className="icon-unlock text-color-dark-1"><i className="icon-poweroff"></i></div>
    	            <h5>Quit</h5>
    	        </div>
    	        <div className="address">
    	            <div className="text text-color-dark-1">{window.WALLET && window.WALLET.address}</div>
    	            <div className="blk"></div>
    	            <button className="btn btn-block btn-o-dark" onClick={copyAddress}>Copy</button>
    	        </div>
            </div>}
            {
              !(window.WALLET && window.WALLET.address) &&  <div className="poweroff text-color-dark" id="powerOff" onClick={() => routeActions.gotoPath('/unlock')}>
                <div className="icon-unlock text-color-dark-1"><i className="icon-lock"/></div>
                <h5>Unlock</h5>
              </div>
            }
    	        <div className="blk-lg"></div>
    	        <div className="menu">
    	            <ul>
                    {window.WALLET && window.WALLET.address && <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'receiveToken',symbol:null}) }} className="side-receive" ><i className="icon-receive"></i><span>Receive</span></a></li>}
                    {window.WALLET && window.WALLET.address &&  <li><a onClick={transfer} className="side-send"><i className="icon-send"></i><span>Send</span></a></li>}
                    {window.WALLET && window.WALLET.address &&  <li><Link to="/trade"><i className="icon-trade"/><span>Trade</span></Link></li>}
    	                <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'setting',symbol:null}) }} className="side-settings"><i className="icon-cog-o"></i><span>Settings</span></a></li>
    	                 <li hidden><a className="side-airdrop"><i className="icon-gift-o"></i><span>Airdrop</span></a></li>
    	                <li><a className="side-help"><i className="icon-question-o"></i><span>Help</span></a></li>
    	                <li><a className="side-feedback"><i className="icon-pencil"></i><span>Feedbak</span></a></li>
    	            </ul>
    	        </div>
    	    </div>
    	</div>
    </div>
  )
}
export default UserCenter
