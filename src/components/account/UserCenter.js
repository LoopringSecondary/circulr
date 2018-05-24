import React from 'react';
import {Link} from 'dva/router';

function UserCenter(props) {

  const {userCenter} = props;
  return (
    <div>
    	<div id="account">
    	    <div className="account-side">
    	        <div className="poweroff text-color-dark" id="powerOff">
    	            <div className="icon-unlock text-color-dark-1"><i className="icon-poweroff"></i></div>
    	            <h5>Quit</h5>
    	        </div>
    	        <div className="blk-lg"></div>
    	        <div className="address">
    	            <div className="text text-color-dark-1">{window.WALLET && window.WALLET.address}</div>
    	            <div className="blk"></div>
    	            <button className="btn btn-block btn-o-dark">Copy</button>
    	        </div>
    	        <div className="blk-lg"></div>
    	        <div className="menu">
    	            <ul>
    	                <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'receiveToken',symbol:null}) }} className="side-receive" ><i className="icon-receive"></i><span>Receive</span></a></li>
    	                <li><a onClick={() =>{userCenter.hideLayer();userCenter.showLayer({id:'transferToken',symbol:null}) }} className="side-send"><i className="icon-send"></i><span>Send</span></a></li>
    	                <li><Link to="/trade"><i className="icon-trade"/><span>Trade</span></Link></li>
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
