import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import { Button,Spin } from 'antd'

function ListTokenTickers(props) {
  const {loopringTickers:list,dispatch,token,tickers} = props;
  const tickersFm = new TickersFm(list);
  const listedTickers = tickersFm.getTickersBySymbol(token);
  const gotoTrade = (item)=>{
    routeActions.gotoPath(`/trade/${item.market}`)
  }
  console.log('ListTokenTickers',tickers);
  console.log('listedTickers',listedTickers);
  return (
    <div>
        <div className="loopring-dex">
            <div className="card-header bordered">
                <h4>{intl.get('ticker_list.title_loopring_tickers')}</h4>
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
                                <li><small>{intl.get('ticker.price')}</small><span className="text-down">{tickerFm.getLast()}</span></li>
                                <li><small>{intl.get('ticker.change')}</small><span className="text-up">{tickerFm.getChange()}</span></li>
                            </ul>
                            <Button className="btn btn-primary" onClick={gotoTrade.bind(this,item)}>{intl.get('common.trade')} {token}</Button>
                        </div>
                      )
                    })
                  }
                  {
                    listedTickers.length == 0 &&
                    <div className="p10 text-center">
                        {intl.get('common.list.no_data')}
                    </div>
                  }
              </div>
            </Spin>
        </div>
        <div>
            <div className="card-header bordered">
                <h4>{intl.get('ticker_list.title_reference_tickers')}</h4>
            </div>
            <Spin spinning={tickers.loading}>
              <div style={{overflow: "auto",maxHeight: "300px"}}>
                  <table className="table table-hover table-striped table-dark text-center text-left-col1 text-right-last">
                      <thead>
                          <tr>
                              <th>{intl.get('common.market')}</th>
                              <th>{intl.get('common.price')}</th>
                              <th>{intl.get('ticker.change')}</th>
                          </tr>
                      </thead>
                      <tbody>
                      {tickers && tickers.item && Object.keys(tickers.item).length > 0 && Object.keys(tickers.item).map((key,index) => {
                        const item = tickers.item[key];
                        const tf  = new TickerFm(item);
                        return (
                          <tr key={index}>
                          <td>{tf.getExchange() || key}</td>
                          <td>{tf.getLast()}</td>
                          <td className="text-up">{tf.getChange()}</td>
                        </tr>)
                      })}
                      </tbody>
                  </table>
              </div>
            </Spin>
        </div>
    </div>
  )
}

function mapStateToProps(state) {

  return {
    loopringTickers:state.sockets.loopringTickers,
    token:state.tokens.selected,
    tickers:state.sockets.tickers
  }
}


export default connect(mapStateToProps)(ListTokenTickers)
