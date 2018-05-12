import React from 'react';
import { Button,Input,Upload,Icon} from 'antd';
function Keystore(props) {
  return (
    <div>
        <div className="text-inverse">
            <h2 className="text-center text-primary">Select JSON File</h2>
            <Button><Icon type="upload" />Select JSON File</Button>
            <div className="d-flex justify-content-between align-items-center up-file"><small className="truncation" style={{width: "440px"}}>UTC--2018-03-07T09-28-46.992Z--750ad4351bb728cec7d639a9511f9d6488f1e259 1.json</small><span className="offset-md text-inverse"><a href="#"><i className="icon-remove-sm"></i></a></span></div>
            <Input suffix={<i className="icon-eye"></i>} />
            <Button type="primary" className="btn-block btn-xlg btn-token">Unlock</Button>
        </div>
    </div>
  )
}
export default Keystore






