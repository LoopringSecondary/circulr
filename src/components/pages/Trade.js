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
          <Charts.KlineTradingview />
        </div>
    </div>
  )
}
export default connect()(Trade)
