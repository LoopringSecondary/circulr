import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket,getFormattedTime} from 'modules/formatter/common'
import {Popover,Spin} from 'antd'

const MetaItem = (props) => {
  const {label, value, render} = props
  return (
    <div className="row pt5 pb5 align-items-center zb-b-b" style={{minWidth:'150px',maxWidth:'250px'}}>
      <div className="col-auto fs12 color-black-2">
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
      <MetaItem label={intl.get('fill.created')} value={getFormattedTime(item.createTime,'MM-DD HH:SS')} />
      <MetaItem label={intl.get('fill.total')} value="10ETH" />
      <MetaItem label={intl.get('fill.lrc_fee')} value="3.5LRC" />
      <MetaItem label={intl.get('fill.lrc_reward')} value="3.5LRC" />

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
          <h4>{intl.get('fill_list.trade_history')}</h4>
        </div>
        <div className="trade-list trade-history-list h-full">
          <ul>
            <li className="trade-list-header"><span>{intl.get('fill.price')} {tokens.right}</span><span style={{textAlign:'right'}}>{intl.get('fill.amount')} {tokens.left}</span><span style={{textAlign:'right'}}>{intl.get('fill.lrc_fee')}</span></li>
          </ul>
          <div style={{height: "100%",paddingBottom:"145px", }}>
            <Spin spinning={trades.loading}>
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
            </Spin>
          </div>
        </div>
      </div>
    </div>
  )
}

export default connect(
  ({sockets:{trades}})=>({trades})
)(ListTradesHistory)
