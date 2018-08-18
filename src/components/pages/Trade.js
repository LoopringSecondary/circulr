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
import {TickerFm} from 'modules/tickers/formatters';
import routeActions from 'common/utils/routeActions';

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

  	    <div className="side-fixed" style={{ top:"85px", left:"60px", width:"300px", paddingTop:"94px"}}>
              <div className="card h-full" style={{borderRadius:"5px"}}>
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
  	    <div className="m-container h-full relative" style={{marginLeft: "380px", marginRight: "50px"}}>
  	        <div className="side" style={{left:"0",width: "305px", borderRadius:"5px"}}>
  	            <div className="card h-full" style={{borderRadius:"5px"}}>
  	                <Orders.ListOrderBook />
  	            </div>
  	        </div>
  	        <div className="fulid-container" style={{marginLeft:"324px", marginRight: "324px", height: "100%" }}>
  	            <div className="card dark h-full" style={{borderRadius:"5px"}}>
      	            <div style={{position: "relative", height: "-webkit-calc(50% - 40px)", overflow:"hidden" }}>
        	              <div className="card-header card-header-dark bordered">
        		               <h4>{intl.get('kline_chart.kline_chart')}</h4>
        		            </div>
                        <div style={{height:"-webkit-calc(100% - 40px)"}}>
            		            <div className="market-chart" style={{height: "50%"}}>
            		               <Charts.KlineChart />
            		            </div>
            	               <div className="market-chart" style={{height: "50%", borderBottom:"20px solid #273e4f"}}>
        		                    <h4 style={{padding:"10px 20px", color:"rgba(255, 255, 255, 0.87)", fontSize:"16px", fontWeight:"600"}}>{intl.get('depth_chart.depth_chart')}</h4>
                                <Charts.DepthChart />
                            </div>
                        </div>
                    </div>
      	            <div className="orders" style={{position:"relative", right:"320px", top:"15px", height:"50%", paddingTop:"0", width:"138%", backgroundColor:"#182C3E", borderRadius:"5px", marginTop: "-15px"}}>
          	            <Tabs defaultActiveKey="1"  type="card" >
          	                <TabPane tab={intl.get('order_list.my_open_orders')} key="1">
                              <Containers.Orders id="MyOpenOrders" alias="orders"  >
                                <Orders.ListMyOrders style={{height:"100%",overflow:"auto", position: "absolute", right:"185px"}} />
                              </Containers.Orders>
                            </TabPane>
          	                <TabPane tab={intl.get('fill_list.my_recent_fills')} key="2">
                              <Containers.Fills id="MyFills" alias="fills"  >
                                <Fills.ListMyFills style={{height:"100%",overflow:"auto", position: "absolute", right:"185px"}} />
                              </Containers.Fills>
                            </TabPane>
          	            </Tabs>
      	            </div>
  	            </div>
    		        <div className="side" style={{top:"74px", right:"-8px", width: "320px"}}>
    		            <Fills.ListTradesHistory />
    		        </div>
  	        </div>
        </div>
    </div>
  )
}
export default connect()(Trade)