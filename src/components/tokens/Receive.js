import React from 'react';
import { Input,Button, } from 'antd';
function Receive(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>我的以太坊地址</h3></div>
    	<div className="Receive-qrcode"><img src={require('../../assets/images/receive-qrcode.png')} /></div>
    	<Input.Group compact  className="d-flex form-dark">
        	<Input style={{ width: '100%' }} defaultValue="0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00" disabled />
        	<Button className="btn-xlg">Copy</Button>
    	</Input.Group>
    </div>
  )
}
export default Receive
