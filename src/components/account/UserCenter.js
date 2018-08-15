import React from 'react';
import {Link} from 'dva/router';
import Notification from '../../common/loopringui/components/Notification'
import copy from 'copy-to-clipboard';
import intl from 'react-intl-universal';
import routeActions from 'common/utils/routeActions'
import storage from 'modules/storage/'

function UserCenter(props) {
  const {userCenter, wallet, dispatch} = props;

  const copyAddress = () => {
    if(wallet.address){
      copy(wallet.address) ? Notification.open({
        message: intl.get('notifications.title.copy_suc'),
        type: 'success', size: 'small'
      }) : Notification.open({message: intl.get('notifications.title.copy_fail'), type: "error", size: 'small'})
    }else {
      Notification.open({message: intl.get('unlock.has_not_unlocked'), type: "error", size: 'small'});
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
    <div style={{width:"345px"}}>
    	<div id="account">
    	    <div className="account-side">
            {wallet.address && <div>
    	        <div className="poweroff text-color-dark" id="powerOff" onClick={quit}>
    	            <div className="icon-unlock text-color-dark-1"><i className="icon-poweroff"/></div>
    	            <h5>{intl.get('common.quit')}</h5>
    	        </div>
              <div className="blk-lg"/>
    	        <div className="address">
    	            <div className="text text-color-dark-1">{wallet.address}</div>
    	            <div className="blk"/>
    	            <button className="btn btn-block btn-o-dark" onClick={copyAddress}>{intl.get('common.copy')}</button>
    	        </div>
            </div>}
            {
              !(wallet.address) &&  <div className="poweroff text-color-dark" id="powerOff" onClick={() => routeActions.gotoPath('/unlock')}>
                <div className="icon-unlock text-color-dark-1"><i className="icon-lock"/></div>
                <h5>{intl.get('unlock.actions_unlock')}</h5>
              </div>
            }
    	        <div className="blk-lg"/>
    	        <div className="menu">
    	            <ul>
                    {false && wallet.address && <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'receiveToken',symbol:null}) }} className="side-receive" ><i className="icon-receive"/><span>{intl.get('user_center.receive')}</span></a></li>}
                    {false && wallet.address &&  <li><a onClick={transfer} className="side-send"><i className="icon-send"/><span>{intl.get('user_center.send')}</span></a></li>}
                    {wallet.address &&  <li><Link to="/trade"><i className="icon-trade"/><span>{intl.get('common.market')}</span></Link></li>}
                    {wallet.address &&  <li><a onClick={() => dispatch({type:'layers/showLayer',payload:{id:'tradeByP2P'}})}><i className="icon-trade"/><span>{intl.get('p2p_order.user_center_p2p')}</span></a></li>}
                    {false && wallet.address && (wallet.unlockType==='privateKey'|| wallet.unlockType==='keystore' || wallet.unlockType==='mnemonic') &&  <li><a onClick={() => dispatch({type:'layers/showLayer',payload:{id:'export'}})}><i className="icon-export"/><span>{intl.get('export_keystore.title')}</span></a></li>}
                    <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'setting',symbol:null}) }} className="side-settings"><i className="icon-cog-o"/><span>{intl.get('settings.title')}</span></a></li>
                    <li hidden><a className="side-airdrop"><i className="icon-gift-o"/><span>Airdrop</span></a></li>
                    <li><a className="side-help"><i className="icon-question-o"/><span>{intl.get('common.help')}</span></a></li>
                    <li><a className="side-feedback"><i className="icon-pencil"/><span>{intl.get('common.feedback')}</span></a></li>
    	            </ul>
    	        </div>
    	    </div>
    	</div>
    </div>
  )
}
export default UserCenter
