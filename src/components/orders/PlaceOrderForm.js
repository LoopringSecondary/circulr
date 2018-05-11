import React from 'react';
import { Tabs,Input,Button,Form,Slider } from 'antd';


function PlaceOrderForm(props) {
  return (
    <div>
    	<div className="card-body form-inverse">
            <ul className="pair-price text-inverse">
                <li>
                    <h4>LRC</h4><span className="token-price">0.00009470 USD</span><span className="text-up">+0.98</span></li>
                <li>
                    <h4>ETH</h4><span className="token-price">0.56 USD</span><span className="text-up">+0.45</span></li>
            </ul>
            <ul className="token-tab">
                <li className="buy active"><a href="#b1" data-toggle="tab">Buy LRC</a></li>
                <li className="sell"><a href="#b2" data-toggle="tab">Sell LRC</a></li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane active" id="b1">
                    <small className="balance text-inverse">WETH Balance: <span>0</span></small>
                    <div className="blk-sm"></div>
                    <Form>
                    <Form.Item>
                    <Input value="0" suffix="WETH" prefix="Price" />
                    </Form.Item>
                    <Form.Item>
                    <Input value="0" suffix="LRC" prefix="Amount" />
                    </Form.Item>
                    </Form>
                    <div className="text-inverse text-secondary">
                        <div className="range-inverse">
                           <Slider marks={{ 0: '0', 25: '25%', 50: '50%', 75: '75%', 100: '100%' }} defaultValue={37} />
                        </div>
                        <div className="blk-sm"></div>
                        <div className="form-group mr-0">
                            <div className="form-control-static d-flex justify-content-between">
                                <span className="font-bold">Total</span><span><span>0</span>WETH ≈ $0</span>
                            </div>
                        </div>
                        <div className="form-group mr-0">
                            <div className="form-control-static d-flex justify-content-between">
                                <span className="font-bold">LRC Fee <i className="icon-info tradingfeetip"></i></span><span><i className="icon-pencil tradingFee"></i><span>0</span><span className="offset-md">LRC (2‰)</span></span>
                            </div>
                        </div>
                        <div className="form-group mr-0">
                            <div className="form-control-static d-flex justify-content-between">
                                <span className="font-bold">Time to live <i className="icon-info"></i></span><span><i className="icon-pencil timetolive"></i><span>1</span><span className="offset-md">Day</span></span>
                            </div>
                        </div>
                        <div className="blk"></div>
                        <Button type="primary" className="btn-block">Place Order</Button>
                        <Button type="danger" className="btn-block">Place Order</Button>
                    </div>
                    
                    
                </div>
                
            </div>
        </div>

        

    </div>
  )
}
export default PlaceOrderForm
