import React from 'react';
import Orders from '../orders'
import Fills from '../fills'
import Charts from '../charts'
import { Tabs } from 'antd';
import { Containers } from 'modules';

function Trade(props) {
  const { children, match } = props
  // let pair = match.params.pair || window.STORAGE.markets.getCurrent() || 'LRC-WETH'
  let pair = match.params.pair || 'LRC-WETH'
  if(pair.indexOf('-') < 0){ }
  // TODO if market is not support or goto some route
  const TabPane = Tabs.TabPane;
  function callback(key) {
    console.log(key);
  }
  return (
    <div>
        <header id="header" style={{ position:"fixed",width:"100%",zIndex:"1000",borderBottom: "4px solid rgb(8, 34, 63)" }}>
            <div className="bg d-flex justify-content-between align-items-center">
                <div className="tradeHeaderEle justify-content-between align-items-center" style={{display: "flex"}}>
                    <div id="back"><i className="icon-chevron-left"></i></div>
                    <div className="pair-select d-flex justify-content-between tokenselect">LRC/ETH <b className="caret"></b></div>
                    <div className="token-last-quotes">
                        <ul className="d-flex justify-content-between align-items-center">
                            <li><small>Last Price</small><em><span className="text-up">0.00086663</span> $0.34</em></li>
                            <li><small>24H Change</small><em><span className="text-down">0.00086663</span> -0.70%</em></li>
                            <li><small>24H High</small><em>0.00008219</em></li>
                            <li><small>24H Low</small><em>0.00007859</em></li>
                            <li><small>24H Volume</small><em>207.98BTC</em></li>
                        </ul>
                    </div>
                </div>
                <div className="account"><img  src={require('../../assets/images/user.png')} className="photo" /><span className="msg"><i className="icon-bell"></i></span></div>
            </div>
        </header>
  	    <div className="side-fixed" style={{ top:"0", left:"0", width:"280px", paddingTop:"74px" }}>
              <div className="card h-full">
                <Containers.PlaceOrder initState={{pair:pair}}>
                  <Containers.Settings>
                    <Orders.PlaceOrderForm />
                  </Containers.Settings>
                </Containers.PlaceOrder>
              </div>
  	    </div>
  	    <div className="m-container h-full relative" style={{marginLeft: "284px"}}>
  	        <div className="side" style={{left:"0",width: "300px"}}>
  	            <div className="card h-full">
  	                <Orders.ListOrderBook />
  	            </div>
  	        </div>
  	        <div className="fulid-container" style={{marginLeft:"304px", marginRight: "304px", height: "100%" }}>
  	            <div className="card dark h-full">
      	            <div style={{position: "relative", height: "60%", paddingTop:"50px", marginTop: "-50px" }}>
        	              <div className="card-header card-header-dark bordered">
        		               <h4>Price Chart</h4>
        		            </div>
        		            <div className="market-chart" style={{height: "60%" }}>
        		               <Charts.KlineChart />
        		            </div>
        	               <div className="market-chart" style={{height: "40%" }}>
                            <Charts.DepthChart />
                         </div>
                    </div>
      	            <div style={{position: "relative", height: "40%", paddingTop:"50px"}}>
          	            <Tabs defaultActiveKey="1" onChange={callback}  type="card">
          	                <TabPane tab="Orders" key="1">
                              <Containers.Orders id="MyOpenOrders" alias="orders" >
                                <Orders.ListMyOrders />
                              </Containers.Orders>
                            </TabPane>
          	                <TabPane tab="Fill" key="2">
                              <Fills.ListDefault />
                            </TabPane>
          	            </Tabs>
      	            </div>
  	            </div>
    		        <div className="side" style={{top:"74px", right:"0", width: "300px"}}>
    		            <Fills.ListTradesHistory />
    		        </div>
  	        </div>
        </div>
    </div>
  )
}
export default Trade
