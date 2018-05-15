import React from 'react';
import { Form,Input,Button } from 'antd';
function ConvertForm(props) {
  return (
  	<div>
        <div class="text-center">
	        <span><i className="icon-ETH icon-token"></i><small>WEH</small></span>
	        <span className="offset-lg"><i className="text-color-3 icon-long-arrow-right"></i></span>
	        <span><small>WETH</small><i className="icon-WETH icon-token"></i></span>
        </div>
        <div className="divider solid"></div>
        <Form.Item>
            <Input placeholder="0" suffix="WETH" />
        </Form.Item>
        <div className="d-flex justify-content-between">
        	<span>≈￥0.00</span><span>最大数量</span>
        </div>
        <p className="text-color-2">我们为您保留0.1 ETH作为油费以保证后续可以发送交易</p>
        <Button type="primary" className="btn-block btn-xlg btn-token">是的，马上转换</Button>   
    </div>
  )
}
export default ConvertForm
