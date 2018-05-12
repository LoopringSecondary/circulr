import React from 'react';
import { Input,Button, } from 'antd';
function Receive(props) {
  return (
    <div>
    	<div>My Ethereum Address</div>
    	<div className="Receive-qrcode"><img src={require('../assets/images/receive-qrcode.png')} /></div>
    	<Input.Group compact  className="d-flex">
        	<Input style={{ width: '100%' }} defaultValue="0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00" disabled />
        	<Button>Copy</Button>
    	</Input.Group>
    </div>
  )
}
export default Receive
