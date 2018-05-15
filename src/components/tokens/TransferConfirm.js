import React from 'react';
import { Input,Button } from 'antd';
function TransferConfirm(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>发送 WETH</h3></div>
        <div class="pd-lg text-center text-color-dark-1">
	        <i class="icon-ETH icon-token-md"></i>
          <div className="blk-sm"></div>
	        <h2>100LRC</h2>
	        <span>￥400.12</span>
        </div>
        <div class="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>发送方</span><div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div></li>
            <li><span>发送到</span><div className="text-lg-control break-word text-right">0x58a2f1a15d97c25917e672000d80cf68b74ca192bf5542623de832918b1bba9b</div></li>
            <li><span>邮费</span><span>0.0042 ETH<p>Gas(200000)* Gas Price(21 Gwei)</p></span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
        </ul>
        <div className="col-row">
          <div class="col2-2">
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg">不，取消发送</Button></div>
         		<div className="item"><Button className="btn-block btn-o-dark btn-xlg">马上发送</Button></div>
          </div>
        </div>
    </div>
  )
}
export default TransferConfirm
