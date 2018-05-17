import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatter'
import { Button } from 'antd'

function ListTokenTickers(props) {
  const {loopringTickers:list,dispatch} = props
  const tickersFm = new TickersFm(list)
  const listedTickers = tickersFm.getTickersBySymbol('LRC') // TODO
  return (
    <div className="column" style={{height:"-webkit-calc(100% - 251px)",paddingBottom:"460px"}}>
        <div className="loopring-dex">
            <div className="card-header bordered">
                <h4>Loopring DEX Markets</h4>
            </div>
            {
              listedTickers.map((item,index)=>{
                const tickerFm = new TickerFm(item)
                return (
                  <div className="item">
                      <ul>
                          <li><h3>{item.market}</h3></li>
                          <li hidden><small>Price</small><span class="text-down">0.56 USD</span></li>
                          <li hidden><small>Price</small><span class="text-down">{tickerFm.getChange()}</span></li>
                          <li><small>Change</small><span className="text-up">{tickerFm.getChange()}</span></li>
                      </ul>
                      <Button className="btn btn-primary">Go To Trade</Button>
                  </div>
                )
              })
            }

        </div>
        <div className="column">
            <div className="card-header bordered">
                <h4>Reference Markets</h4>
            </div>
            <div style={{overflow: "auto",maxHeight: "300px"}}>
                <table className="table table-hover table-striped table-dark text-center text-left-col1 text-right-last">
                    <thead>
                        <tr>
                            <th>Markets</th>
                            <th>Price</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OKEX</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Binance</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                        <tr>
                            <td>Coinbase</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Bittrex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Poloniex</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                        <tr>
                            <td>Bitfinex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Bitmex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>GDAX</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default connect(
  ({sockets:{loopringTickers}})=>({loopringTickers})
)(ListTokenTickers)
