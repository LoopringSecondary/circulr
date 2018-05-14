import React from 'react';
import { Input,Button,Select } from 'antd';
function MetaMask(props) {
  return (
    <div>
		<h2 className="text-center text-primary">Connect to  MetaMask</h2>
		<div className="card bg-white">
		    <div className="card-body">
		        <ul className="list list-md">
		            <li><i className="icon-export"></i> <a href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn" target="_blank">Get MetaMask Chrome extension</a></li>
		            <li><i className="icon-export"></i> <a href="https://metamask.io/" target="_blank">Visit MetaMask website</a></li>
		        </ul>
		    </div>
		</div>
    </div>
  )
}
export default MetaMask