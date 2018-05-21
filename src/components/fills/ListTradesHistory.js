import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket,getFormattedTime} from 'modules/formatter/common'


function ListTradesHistory(props) {
  console.log('ListTradesHistory render',props)
  const {trades} = props
  const tokens = getTokensByMarket(trades.filters.market)
  return (
    <div>
      <div className="card dark h-full">
        <div className="card-header card-header-dark bordered">
          <h4>Trade History</h4>
        </div>
        <div className="trade-list h-full">
          <ul>
            <li className="trade-list-header"><span>Price({tokens.right})</span><span>Amount({tokens.left})</span><span>Time</span></li>
          </ul>
          <div style={{height: "100%",paddingBottom:"145px", }}>
            <ul style={{height: "100%", overflow:"auto",paddingBottom:"0" }}>
              {
                trades.items.map((item,index)=>
                  <li key={index}>
                    {
                      item.side === 'sell' && <span className="text-down">{item.price && item.price.toFixed(8)}</span>
                    }
                    {
                      item.side === 'buy' && <span className="text-up">{item.price && item.price.toFixed(8)}</span>
                    }
                    <span>{item.amount && item.amount.toFixed(8)}</span>
                    <span>{getFormattedTime(item.createTime,'MM-DD HH:SS')}</span>
                  </li>
                )
              }
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({sockets:{trades}})=>({trades})
)(ListTradesHistory)
