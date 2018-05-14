import React from 'react';
import { Input,Button,Form} from 'antd';
function TransferForm(props) {
  return (
    <div>

        <div className="card-header bordered">
            <h4>Send LRC</h4>
            <a href="#" className="close close-lg close-inverse" id="sendClose"></a>
        </div>
        <div className="card-body form-inverse">
            <Form>
            <Form.Item>
            <Input value="0" suffix="WETH" prefix="Price" />
            </Form.Item>
            <Form.Item>
            <Input value="0" suffix="LRC" prefix="Amount" />
            </Form.Item>
            </Form>
            <div className="form-group form-group-md text-inverse">
                <div className="form-control-static d-flex justify-content-between mr-0">
                    <span>Gas Fee</span><span className="font-bold"><i className="icon-pencil gasfee"></i><span>0</span><span className="offset-md">0.00189 ETH ≈ $1.15</span></span>
                </div>
            </div>
            <Button type="primary" className="btn-block">Continue</Button>
        </div>     
        <div id="gasFee" style={{display: "none"}}>
            <div className="form-group">
                <div className="tab-pane active" id="popularOption1">
                    <div className="d-flex justify-content-between align-items-center webui-popover-title">
                        <span className="font-weight">Custom Gas For This Order<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#more1" data-toggle="tab" className="text-primary">Custom Settings</a></span>
                    </div>
                    <div className="blk"></div>
                    <p className="text-secondary">we advice you to set 0.00090000</p>
                    <div className="blk"></div>
                    <div className="range-slider">
                        <i className="range-slider-dot"></i><i className="range-slider-dot" style={{left: "100%"}}></i>
                    </div>
                    <div className="d-flex justify-content-between range-progress">
                        <div>Slower</div>
                        <div>Faster</div>
                    </div>
                </div>
                <div className="tab-pane" id="more1">
                    <div className="d-flex justify-content-between align-items-center webui-popover-title">
                        <span className="font-weight">Adjust Gas<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#popularOption1" data-toggle="tab" className="text-primary">Fast Settings</a></span>
                    </div>
                    <div className="blk"></div>
                    <p className="text-secondary">we advice you to set GasLimit to 90000, set GasPrice to 10</p>
                    <div className="blk"></div>
                    <div>
                        <div className="form-group ">
                            <label>Gas Limit</label>
                            <input className="form-control form-control-md" />
                        </div>
                        <div className="form-group ">
                            <label>Gas Price</label>
                            <div className="range-slider">
                                <i className="range-slider-dot"></i><i className="range-slider-dot" style={{left: "100%"}}></i>
                            </div>
                            <div className="d-flex justify-content-between range-progress">
                                <div>Slower</div>
                                <div>Faster</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
  )
}
export default TransferForm
