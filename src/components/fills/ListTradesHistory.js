import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket,getFormattedTime} from 'modules/formatter/common'
import {Popover} from 'antd'

const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <div className="row pt5 pb5 align-items-center zb-b-b" style={{minWidth:'150px',maxWidth:'250px'}}>
      <div className="col-auto fs12 color-black-2" style={{fontWeight:'bold'}}>
        {label}
      </div>
      <div className="col text-right fs14 color-black-1 text-wrap pl15">
        {render ? render(value) : value}
      </div>
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
        <div className="trade-list trade-history-list h-full">
          <ul>
            <li className="trade-list-header"><span>{intl.get('fill.price')}({tokens.right})</span><span style={{textAlign:'right'}}>{intl.get('fill.amount')}({tokens.left})</span><span style={{textAlign:'right'}}>{intl.get('common.time')}</span></li>
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
