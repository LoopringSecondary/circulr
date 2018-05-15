import React from 'react';
import { Input,Button } from 'antd';
function PlaceOrderConfirm(props) {
  return (
    <div>
        <div className="modal-header text-dark"><h3>卖LRC</h3></div>
        <div className="pd-lg text-center text-color-dark">
	        <h5>您正在出售</h5>
	        <h2>100LRC</h2>
	        <small className="text-color-dark-1">0.0015 × 100 =0.15WETH</small>
        </div>
        <div className="divider solid"></div>
        <ul className="list list-label list-dark list-justify-space-between divided">
            <li><span>撮合费</span><span>0.5LRC</span></li>
            <li><span>分润比例</span><span>50%</span></li>
            <li><span>订单生效时间</span><span>2018年5月14日 16:28</span></li>
            <li><span>订单失效时间</span><span>2018年5月15日 16:28</span></li>
            <li className="d-block">
                <b><i className="icon-chevron-up"></i>签名信息</b>
                <div className="blk"></div>
                <div className="col-row form-dark">
                    <div className="col2-2 d-flex justify-space-between">
                    	<div className="item">
                    	    <p className="text-color-dark-2">未签名的订单</p>
                    		<Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} />
                    	</div>
                    	<div className="item">
                    	    <p className="text-color-dark-2">签名的订单</p>
                    		<Input.TextArea placeholder="" autosize={{ minRows: 4, maxRows: 6 }} />
                    	</div>
                    </div>
                    <div className="blk"></div> 
                    <div className="text-center text-color-dark-3">提交订单是免费的，不需要消耗Gas</div>
                </div>
            </li>
        </ul>
        <Button className="btn-block btn-o-dark btn-xlg">提交订单</Button>                   
    </div>
  )
}
export default PlaceOrderConfirm
