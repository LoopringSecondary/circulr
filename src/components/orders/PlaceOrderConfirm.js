import React from 'react';
import { Input,Button } from 'antd';
function PlaceOrderConfirm(props) {
  return (
    <div>
        <div class="pd-lg text-center">
	        <em>您正在出售</em>
	        <h3>100LRC</h3>
	        <small>0.0015 × 100 =0.15WETH</small>
        </div>
        <div class="divider solid"></div>
        <ul class="list list-label hover list-justify-flex-start divided">
            <li><span>撮合费</span><span>0.5LRC</span></li>
            <li><span>分润比例</span><span>50%</span></li>
            <li><span>订单生效时间</span><span>2018年5月14日 16:28</span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
        </ul>
        <div><i class="icon-chevron-up"></i>签名信息</div>
        <div class="col2-2">
        	<div class="item">
        	    <p>未签名的订单</p>
        		<Input.TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
        	</div>
        	<div class="item">
        	    <p>签名的订单</p>
        		<Input.TextArea placeholder="" autosize={{ minRows: 2, maxRows: 6 }} />
        	</div>
        </div> 
        <div className="text-center">提交订单是免费的，不需要消耗Gas</div>
        <Button type="primary" className="btn-block btn-xlg btn-token">提交订单</Button>                   
    </div>
  )
}
export default PlaceOrderConfirm
