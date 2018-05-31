import React from 'react';
import Orders from '../orders'
import Fills from '../fills'
import Tickers from '../tickers'
import Charts from '../charts'
import { Tabs,Tooltip } from 'antd';
import { Containers } from 'modules';
import { connect } from 'dva';
import {AccountMenu} from './Wallet';


function Trade(props) {
  const { children, match } = props
  // let pair = match.params.pair || window.STORAGE.markets.getCurrent() || 'LRC-WETH'
  let market = match.params.market || 'LRC-WETH'
  const TabPane = Tabs.TabPane;
  return (
    <div>
        <header id="header" style={{ position:"fixed",width:"100%",zIndex:"1000" }}>
            <div className="bg d-flex justify-content-between align-items-center">
                <Tickers.TickerHeader />
                <AccountMenu dispatch={props.dispatch} />
            </div>
        </header>
  	    <div className="side-fixed" style={{ top:"0", left:"0", width:"320px", paddingTop:"74px" }}>
              <div className="card h-full">
                <Containers.PlaceOrder initState={{pair:market}}>
                  <Containers.Settings>
                    <Containers.Sockets id="balance">
                      <Containers.Sockets id="marketcap">
                        <Containers.Sockets id="pendingTx">
                          <Containers.Wallet>
                            <Containers.Gas>
                              <Orders.PlaceOrderForm />
                            </Containers.Gas>
                          </Containers.Wallet>
                        </Containers.Sockets>
                      </Containers.Sockets>
                    </Containers.Sockets>
                  </Containers.Settings>
                </Containers.PlaceOrder>
              </div>
  	    </div>
  	    <div className="m-container h-full relative" style={{marginLeft: "324px"}}>
  	        <div className="side" style={{left:"0",width: "320px"}}>
  	            <div className="card h-full">
  	                <Orders.ListOrderBook />
  	            </div>
  	        </div>
  	        <div className="fulid-container" style={{marginLeft:"324px", marginRight: "324px", height: "100%" }}>
  	            <div className="card dark h-full">
      	            <div style={{position: "relative", height: "-webkit-calc(50% - 40px)", overflow:"hidden" }}>
        	              <div className="card-header card-header-dark bordered">
        		               <h4>Price Chart</h4>
        		            </div>
                        <div style={{height:"-webkit-calc(100% - 40px)"}}>
            		            <div className="market-chart" style={{height: "60%" }}>
            		               <Charts.KlineChart />
            		            </div>
            	               <div className="market-chart" style={{height: "40%" }}>
                                <Charts.DepthChart />
                            </div>
                        </div>
                    </div>
      	            <div className="orders" style={{position: "relative", height:"50%", paddingTop:"0"}}>
          	            <Tabs defaultActiveKey="1"  type="card">
          	                <TabPane tab="Orders" key="1">
                              <Containers.Orders id="MyOpenOrders" alias="orders"  >
                                <Orders.ListMyOrders style={{height:"100%",overflow:"auto"}} />
                              </Containers.Orders>
                            </TabPane>
          	                <TabPane tab="Fills" key="2">
                              <Containers.Fills id="MyFills" alias="fills"  >
                                <Fills.ListMyFills style={{height:"100%",overflow:"auto"}} />
                              </Containers.Fills>
                            </TabPane>
          	            </Tabs>
      	            </div>
  	            </div>
    		        <div className="side" style={{top:"74px", right:"0", width: "320px"}}>
    		            <Fills.ListTradesHistory />
    		        </div>
  	        </div>
        </div>
    </div>
  )
}
export default connect()(Trade)
