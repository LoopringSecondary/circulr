import React from 'react';
import { Input,Button, } from 'antd';
function ExportKeyStore(props) {
  return (
    <div>
        <div>Export Keystore</div>	
    	<Input.Group compact  className="d-flex">
        	<Input  suffix={<i className="icon-eye"></i>} style={{ width: '100%' }} placehold="Enter the wallet password" />
        	<Button>Get Keystore</Button>
    	</Input.Group>
    </div>
  )
}
export default ExportKeyStore
