import React from 'react';
import { Input,Button } from 'antd';
function TransferConfirm(props) {
  return (
    <div>
        <div class="pd-lg text-center">
	        <i class="icon-ETH icon-token"></i>
	        <h3>100LRC</h3>
	        <small>￥400.12</small>
        </div>
        <div class="divider solid"></div>
        <ul class="list list-label hover list-justify-flex-start divided">
            <li><span>发送方</span><span>0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</span></li>
            <li><span>发送到</span><span>0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</span></li>
            <li><span>邮费</span><span>0.0042 ETH<p>Gas(200000)* Gas Price(21 Gwei)</p></span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
        </ul>
       <div class="d-flex justify-content-between">
       		<span><Button type="secondary" className="btn-block btn-xlg btn-token">不，取消发送</Button></span>
       		<span><Button type="primary" className="btn-block btn-xlg btn-token">马上发送</Button></span>

       </div>

        
    </div>
  )
}
export default TransferConfirm
