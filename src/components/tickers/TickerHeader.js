import React from 'react'
import {connect} from 'dva'
import {TickerFm} from 'modules/tickers/formatters'

function TickerHeader(props) {
  console.log('TickerHeader render',props)
  const showAllTickers = ()=>{
    props.dispatch({
      type:"modals/showModal",
      payload:{
        id:'ListAllTickers',
      }
    })
  }
  const looprTickerFm = new TickerFm(props.tickers.item.loopr || {})
  const tokens = looprTickerFm.getTokens()
  return (
    <div className="tradeHeaderEle justify-content-between align-items-center" style={{display: "flex"}}>
        <div id="back"><i className="icon-chevron-left"></i></div>
        <div className="pair-select d-flex justify-content-between tokenselect" onMouseOver={showAllTickers}>
        {props.tickers.filters.market} <b className="caret"></b>
        </div>
        <div className="token-last-quotes">
            <ul className="d-flex justify-content-between align-items-center">
                <li><small>Last Price</small><em><span className="text-up">{looprTickerFm.getLast()} {tokens.right}</span> <span hidden>$0.34</span></em></li>
                <li><small>24H Change</small><em><span className="text-down">{looprTickerFm.getChange()}</span></em></li>
                <li><small>24H High</small><em>{looprTickerFm.getHigh()} {tokens.right}</em></li>
                <li><small>24H Low</small><em>{looprTickerFm.getLow()} {tokens.right}</em></li>
                <li><small>24H Volume</small><em>{looprTickerFm.getVol()} {tokens.right}</em></li>
            </ul>
        </div>
    </div>
  )
}
export default connect(
  ({sockets:{tickers}})=>({tickers})
)(TickerHeader)
