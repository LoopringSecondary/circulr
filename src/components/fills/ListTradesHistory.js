import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket,getFormattedTime} from 'modules/formatter/common'
import {Popover} from 'antd'

const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <div>
      <span>
        {label}
      </span>
      <span className="text-lg-control break-word text-right">
        {render ? render(value) : value}
      </span>
    </div>
  )
}

const ItemMore=({item})=>{
  return (
    <div>
      <MetaItem label="LRC Fee" value="25.5LRC" />
      <MetaItem label="LRC Reward" value="3.5LRC" />
      <MetaItem label="Total" value="10ETH" />
    </div>
  )
}

function ListTradesHistory(props) {
  console.log('ListTradesHistory render',props)
  const {trades} = props
  const tokens = getTokensByMarket(trades.filters.market)
  const priceSelected = (value, e) => {
    e.preventDefault()
    props.dispatch({type:'placeOrder/priceChange', payload:{priceInput:value}})
  }
  const amountSelected = (value, e) => {
    e.preventDefault()
    props.dispatch({type:'placeOrder/amountChange', payload:{amountInput:value}})
  }
  return (
    <div>
      <div className="card dark h-full">
        <div className="card-header card-header-dark bordered">
          <h4>Trade History</h4>
        </div>
        <div className="trade-list h-full">
          <ul>
            <li className="trade-list-header"><span>Price({tokens.right})</span><span style={{textAlign:'right'}}>Amount({tokens.left})</span><span style={{textAlign:'right'}}>Time</span></li>
          </ul>
          <div style={{height: "100%",paddingBottom:"145px", }}>
            <ul style={{height: "100%", overflow:"auto",paddingBottom:"0" }}>
              {
                trades.items.map((item,index)=>
                  <Popover placement="left" content={<ItemMore item={item} />} title={null} key={index}>
                    <li key={index}>
                      {
                        item.side === 'sell' && <span className="text-down cursor-pointer" onClick={priceSelected.bind(this, item.price.toFixed(8))}>{item.price && item.price.toFixed(8)}</span>
                      }
                      {
                        item.side === 'buy' && <span className="text-up cursor-pointer" onClick={priceSelected.bind(this, item.price.toFixed(8))}>{item.price && item.price.toFixed(8)}</span>
                      }
                      <span className="cursor-pointer" style={{textAlign:'right'}} onClick={amountSelected.bind(this, item.amount.toFixed(8))}>{item.amount && item.amount.toFixed(8)}</span>
                      <span style={{textAlign:'right'}}>{getFormattedTime(item.createTime,'MM-DD HH:SS')}</span>
                    </li>
                  </Popover>
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
