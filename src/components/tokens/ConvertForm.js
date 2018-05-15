import React from 'react';
import { Form,Input,Button } from 'antd';
function ConvertForm(props) {
  return (
  	<div>  
        <div className="modal-header text-dark"><h3>转换</h3></div>
        <div class="pd-md text-center text-color-dark-1">
            <span><i class="icon-ETH icon-token-md"></i><b>WEH</b></span>
            <span class="offset-lg"><i class="text-color-3 icon-long-arrow-right"></i></span>
            <span class="offset-lg"><b>WETH </b><i class="icon-WETH icon-token-md"></i></span>
        </div>
        <div className="divider solid"></div>
        <Form.Item className="form-dark prefix">
            <Input placeholder="0" suffix="WETH" />
        </Form.Item>
        <div className="d-flex justify-content-between text-color-dark-2">
            <small>≈￥0.00</small><small>最大数量</small>
        </div>
        <div className="blk"></div>
        <p className="text-color-dark-1">我们为您保留0.1 ETH作为油费以保证后续可以发送交易</p>
        <Button className="btn-block btn-xlg btn-o-dark">是的，马上转换</Button>   
    </div>
  )
}
export default ConvertForm
