import React from 'react';
import { Input,Button, } from 'antd';
import QRCode from 'qrcode.react';
import copy from 'copy-to-clipboard';
import Notification from '../../common/loopringui/components/Notification'
import intl from 'react-intl-universal';

function Receive(props) {

  const address =  window.WALLET.address

  const copyAddress = () => {
    copy(address) ? Notification.open({
      message: intl.get('navbar.subs.copy_success'),
      type: 'success', size: 'small'
    }) : Notification.open({message: intl.get('navbar.subs.copy_failed'), type: "error", size: 'small'})
  }
  return (
    <div>
        <div className="modal-header text-dark"><h3>我的以太坊地址</h3></div>
    	<div className="Receive-qrcode"><QRCode value={address} size={240}/></div>
    	<Input.Group compact  className="d-flex form-dark">
        	<Input style={{ width: '100%' }} defaultValue={address} disabled />
        	<Button className="btn-xlg" onClick={copyAddress}>Copy</Button>
    	</Input.Group>
    </div>
  )
}
export default Receive
