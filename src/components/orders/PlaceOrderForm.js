import React from 'react';
import { Input,Button } from 'antd';


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
                    <div className="form-group form-group-md font-bold">
                        <div className="input-addon">
                            <em>Price</em>
                            <input className="form-control" placeholder="0" value="0.00169706" />
                            <em>WETH</em>
                        </div>
                    </div>
                    <div className="form-group form-group-md font-bold">
                        <div className="input-addon">
                            <em>Amount</em>
                            <input className="form-control" placeholder="0" />
                            <em>LRC</em>
                        </div>
                    </div>
                    <div className="blk-sm"></div>
                    <div className="text-inverse text-secondary">
                        <div className="range-inverse">
                            <div className="range-slider">
                                <div className="range-slider-step" style={{width: "50%"}}></div>
                                <i className="range-slider-dot active"></i><i className="range-slider-dot active" style={{left: "25%"}}></i><i className="range-slider-dot active" style={{left: "50%"}}></i><i className="range-slider-dot" style={{left: "75%"}}></i><i className="range-slider-dot" style={{left: "100%"}}></i><i className="range-slider-handle" style={{left: "50%"}}></i>
                            </div>
                            <div className="d-flex justify-content-between text-secondary range-progress">
                                <div>0</div>
                                <div style={{position: "relative", left: "-5%"}}>25%</div>
                                <div>50%</div>
                                <div style={{position: "relative", left: "5%"}}>75%</div>
                                <div>100%</div>
                            </div>
                        </div>
                        <div className="blk"></div>
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
                        <button className="btn btn-success btn-lg btn-block">Place Order</button>
                    </div>
                    <div id="tradingFee" style={{display: "none"}}>
                        <div className="webui-popover-title">Set LRC-Fee For for Order</div>
                        <div className="blk"></div>
                        <p>Current LRC Fee ratio : 37‰</p>
                        <p>Current LRC Fee : 0 LRC</p>
                        <div className="blk"></div>
                        <div className="range-slider">
                            <div className="range-slider-step" style={{width: "50%"}}></div>
                            <i className="range-slider-dot active"></i><i className="range-slider-dot" style={{width: "100%"}}></i>
                            <i className="range-slider-handle" style={{width: "50%"}}></i>
                        </div>
                        <div className="d-flex justify-content-between text-secondary">
                            <div>Slow</div>
                            <div>Fast</div>
                        </div>
                    </div>
                    <div id="timeToLive" style={{display: "none"}}>
                        <div className="form-group">
                            <div className="tab-pane active" id="popularOption3">
                                <div className="d-flex justify-content-between align-items-center webui-popover-title">
                                    <span>Set order's TTL<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#more3" data-toggle="tab" className="text-link">Less</a></span>
                                </div>
                                <div className="blk"></div>
                                <div className="form-control-static">
                                    <div className="btn-group btn-group-justify" data-toggle="buttons">
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option1" />1 Hour</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option2" />1 Day</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option3" />1 week</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option4" />1 month</label>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="more3">
                                <div className="d-flex justify-content-between align-items-center webui-popover-title">
                                    <span>Set order's TTL<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#popularOption3" data-toggle="tab" className="text-link">More option</a></span>
                                </div>
                                <div className="blk"></div>
                                <div className="form-group form-group-md">
                                    <div className="input-group input-group-border">
                                        <input placeholder="How long should the order last?" className="form-control" />
                                        <div className="input-group-span">
                                            <select className="form-control nice-select2">
                                                <option>Second</option>
                                                <option>Minute</option>
                                                <option>Hour</option>
                                                <option>Day</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="tab-pane" id="b2">
                    <small className="balance text-inverse">LRC Balance: <span>0</span></small>
                    <div className="blk-sm"></div>
                    <div className="form-group form-group-md font-bold">
                        <div className="input-addon">
                            <em>Price</em>
                            <input className="form-control" placeholder="0" value="0.00169706" />
                            <em>WETH</em>
                        </div>
                    </div>
                    <div className="form-group form-group-md font-bold">
                        <div className="input-addon">
                            <em>Amount</em>
                            <input className="form-control" placeholder="0" />
                            <em>LRC</em>
                        </div>
                    </div>
                    <div className="blk-sm"></div>
                    <div className="form-group">
                        <div className="range-inverse">
                            <div className="range-slider">
                                <div className="range-slider-step" style={{width: "50%"}}></div>
                                <i className="range-slider-dot active"></i><i className="range-slider-dot active" style={{width: "25%"}}></i><i className="range-slider-dot active" sstyle={{width: "50%"}}></i><i className="range-slider-dot" style={{width: "75%"}}></i><i className="range-slider-dot" style={{width: "100%"}}></i><i className="range-slider-handle" style={{width: "50%"}}></i>
                            </div>
                            <div className="d-flex justify-content-between text-secondary range-progress">
                                <div>0</div>
                                <div style={{position: "relative",left: "-5%"}}>25%</div>
                                <div>50%</div>
                                <div style={{position: "relative;",left: "5%"}}>75%</div>
                                <div>100%</div>
                            </div>
                        </div>
                        <div className="blk"></div>
                        <div className="text-inverse text-secondary">
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
                        </div>
                        <div className="blk"></div>
                        <button className="btn btn-danger btn-lg btn-block">Place Order</button>
                    </div>
                	<div id="tradingFee" style={{display: "none"}}>
                	    <div className="webui-popover-title">Set LRC-Fee For for Order</div>
                	    <div className="blk"></div>
                	    <p>Current LRC Fee ratio : 37‰</p>
                	    <p>Current LRC Fee : 0 LRC</p>
                	    <div className="blk"></div>
                	    <div className="range-slider">
                	        <div className="range-slider-step" style={{width: "50%"}}></div>
                	        <i className="range-slider-dot active"></i><i className="range-slider-dot" style={{width: "100%"}}></i>
                	        <i className="range-slider-handle" style={{width: "50%"}}></i>
                	    </div>
                	    <div className="d-flex justify-content-between text-secondary">
                	        <div>Slow</div>
                	        <div>Fast</div>
                	    </div>
                	</div>
                    <div id="timeToLive" style={{display: "none"}}>
                        <div className="form-group">
                            <div className="tab-pane active" id="popularOption4">
                                <div className="d-flex justify-content-between align-items-center webui-popover-title">
                                    <span>Set order's TTL<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#more3" data-toggle="tab" className="text-link">Less</a></span>
                                </div>
                                <div className="blk"></div>
                                <div className="form-control-static">
                                    <div className="btn-group btn-group-justify" data-toggle="buttons">
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option1" />1 Hour</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option2" />1 Day</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option3" />1 week</label>
                                        <label className="btn btn-primary">
                                            <input type="radio" name="options" id="option4" />1 month</label>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="more4">
                                <div className="d-flex justify-content-between align-items-center webui-popover-title">
                                    <span>Set order's TTL<i className="icon-question text-secondary offset-sm"></i></span><span><a href="#popularOption4" data-toggle="tab" className="text-link">More option</a></span>
                                </div>
                                <div className="blk"></div>
                                <div className="input-group input-group-border">
                                    <input placeholder="How long should the order last?" className="form-control form-control-md" />
                                    <div className="input-group-span">
                                        <select className="form-control">
                                            <option>Second</option>
                                            <option>Minute</option>
                                            <option>Hour</option>
                                            <option>Day</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Input placeholder="Basic usage" suffix="2222" prefix="1111" />
        
        <Button type="primary" className="d-block w-100">
        	Place Order
        </Button>
    </div>
  )
}
export default PlaceOrderForm
