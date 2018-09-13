import React from 'react';
import Orders from '../orders'
import Fills from '../fills'
import Tickers from '../tickers'
import Charts from '../charts'
import { Tabs,Tooltip } from 'antd';
import { Containers } from 'modules';
import { connect } from 'dva';
import {AccountMenu} from './Wallet';
import intl from 'react-intl-universal';

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
                <Containers.Wallet>
                  <AccountMenu dispatch={props.dispatch} />
                </Containers.Wallet>
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
                              <Containers.Ttl>
                                <Containers.LrcFee>
                                  <Orders.PlaceOrderForm />
                                </Containers.LrcFee>
                              </Containers.Ttl>
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
  	        <div className="fulid-container" style={{height: "100%" }}>
  	            <div className="card dark h-full">
      	            <div style={{position: "relative", height: "-webkit-calc(60% - 40px)", overflow:"hidden" }}>
                      <Charts.KlineTradingview />
                    </div>
      	            <div className="orders" style={{position: "relative", height:"50%", paddingTop:"0"}}>
          	            <Tabs defaultActiveKey="1"  type="card">
          	                <TabPane tab={intl.get('order_list.my_open_orders')} key="1">
                              <Containers.Orders id="MyOpenOrders" alias="orders"  >
                                <Orders.ListMyOrders style={{height:"100%",overflow:"auto"}} />
                              </Containers.Orders>
                            </TabPane>
          	                <TabPane tab={intl.get('fill_list.my_recent_fills')} key="2">
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
