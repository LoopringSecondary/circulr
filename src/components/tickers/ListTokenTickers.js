import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import routeActions from 'common/utils/routeActions'
import { Button,Spin } from 'antd'

function ListTokenTickers(props) {
  const {loopringTickers:list,dispatch,token,tickers} = props;
  const tickersFm = new TickersFm(list);
  const listedTickers = tickersFm.getTickersBySymbol(token);
  const gotoTrade = (item)=>{
    routeActions.gotoPath(`/trade/${item.market}`)
  };

  console.log('tickers:', tickers);
  return (
    <div>
        <div className="loopring-dex">
            <div className="card-header bordered">
                <h4>Loopring DEX Markets</h4>
            </div>
            <Spin spinning={list.loading}>
              <div className="body" style={{minHeight:'65px'}}>
                  {
                    listedTickers.map((item,index)=>{
                      const tickerFm = new TickerFm(item)
                      return (
                        <div className="item" key={index}>
                            <ul>
                                <li><h3>{item.market}</h3></li>
                                <li><small>Price</small><span className="text-down">{tickerFm.getChange()}</span></li>
                                <li><small>Change</small><span className="text-up">{tickerFm.getChange()}</span></li>
                            </ul>
                            <Button className="btn btn-primary" onClick={gotoTrade.bind(this,item)}>Go To Trade</Button>
                        </div>
                      )
                    })
                  }
              </div>
            </Spin>
        </div>
        <div>
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
                    {tickers && Object.keys(tickers).length > 0 && Object.keys(tickers).map((key) => {
                      const item = tickers[key];
                      const tf  = new TickerFm(item);
                      return (
                        <tr>
                        <td>{tf.getExchange() || key}</td>
                        <td>{tf.getLast()}</td>
                        <td className="text-up">{tf.getChange()}</td>
                      </tr>)
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

function mapStateToProps(state) {

  return {
    loopringTickers:state.sockets.loopringTickers,
    token:state.tokens.selected,
    tickers:state.sockets.tickers.item
  }
}


export default connect(mapStateToProps)(ListTokenTickers)
