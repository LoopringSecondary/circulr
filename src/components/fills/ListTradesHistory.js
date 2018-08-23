import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket,getFormattedTime} from 'modules/formatter/common'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {toBig} from "LoopringJS/common/formatter";
import {Popover,Spin} from 'antd'
import TokenFm from 'modules/tokens/TokenFm'


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

const ItemMore=({item,tokens})=> {
  let splitL = '';
  let splitR = '';
  if (item.side === 'sell') {
    if (Number(item.splitB)) {
      const tf = new TokenFm({symbol:tokens.right});
      splitR =  <div >{FormatAmount({value:tf.getUnitAmount(item.splitB)})} {tokens.right} </div>
    }
    if (Number(item.splitS)) {
      const tf = new TokenFm({symbol:tokens.left});
      splitL = <div>{FormatAmount({value:tf.getUnitAmount(item.splitS)})} { tokens.left}</div>;

    }
  } else {
    if (Number(item.splitB)) {
      const tf = new TokenFm({symbol:tokens.left});
      splitL = <div> {FormatAmount({value:tf.getUnitAmount(item.splitB)})} {tokens.left}</div>
    }
    if (Number(item.splitS)) {
      const tf = new TokenFm({symbol:tokens.right});
      splitR = <div>{FormatAmount({value:tf.getUnitAmount(item.splitS)})} {tokens.right} </div> ;
    }
  }

  let total  = <div>{FormatAmount({value:toBig(item.amount).times(item.price)})} {tokens.right} </div> ;

  return (
    <div>
      <MetaItem label={intl.get('fill.created')} value={getFormattedTime(item.createTime,'MM-DD HH:SS')} />
      <MetaItem label={intl.get('fill.total')} value={total} />
      <MetaItem label={intl.get('fill.lrc_fee')} value={FormatAmount({value:item.lrcFee})} />
      {splitL &&  <MetaItem label={`${intl.get('fill.margin_split')} ${tokens.left}`} value={splitL}  />}
      {splitR &&  <MetaItem label={`${intl.get('fill.margin_split')} ${tokens.right}`} value={splitR}  />}
    </div>
  )
}

function ListTradesHistory(props) {
  console.log('ListTradesHistory render',props)
  const {trades} = props
  const tokens = getTokensByMarket(trades.filters.market)
  const lrcFm = new TokenFm({symbol:'LRC'})

  const priceSelected = (value, e) => {
    e.preventDefault()
    props.dispatch({type:'placeOrder/priceChange', payload:{priceInput:value}})
  }
  const amountSelected = (value, e) => {
    e.preventDefault()
    props.dispatch({type:'placeOrder/amountChange', payload:{amountInput:value}})
  }

  const isIncresse = (index) => {
    if(index=== trades.items.length-1){
      return true
    }else {
      return trades.items[index].price >= trades.items[index+1].price
    }
  };
  return (
    <div>
      <div className="card dark h-full" style={{top: "20px", borderRadius:"5px"}}>
        <div className="card-header card-header-dark bordered">
          <h4>{intl.get('fill_list.trade_history')}</h4>
        </div>
        <div className="trade-list trade-history-list h-full">
          <ul>
            <li className="trade-list-header"><span>{intl.get('fill.price')} {tokens.right}</span><span style={{textAlign:'center'}}>{intl.get('fill.amount')} {tokens.left}</span><span style={{textAlign:'right'}}>{intl.get('fill.lrc_fee')}</span></li>
          </ul>
          <div style={{height: "100%",paddingBottom:"145px", }}>
            <Spin spinning={trades.loading}>
              <ul style={{height: "100%", overflow:"auto",paddingBottom:"0" }}>
                {
                  trades.items.map((item,index)=>
                    <Popover placement="left" content={<ItemMore item={item} tokens={tokens}/>} title={null} key={index}>
                      <li key={index}>
                        {
                          (!isIncresse(index)) && <span className="text-down cursor-pointer" onClick={priceSelected.bind(this, item.price.toFixed(8))}>{item.price && item.price.toFixed(8)}</span>
                        }
                        {
                          (isIncresse(index)) && <span className="text-up cursor-pointer" onClick={priceSelected.bind(this, item.price.toFixed(8))}>{item.price && item.price.toFixed(8)}</span>
                        }
                        <span className="cursor-pointer" style={{textAlign:'right'}} onClick={amountSelected.bind(this, item.amount.toFixed(8))}>{item.amount && item.amount.toFixed(8)}</span>
                        <span style={{textAlign:'right'}}>{FormatAmount({value:lrcFm.getUnitAmount(item.lrcFee)})}</span>
                      </li>
                    </Popover>
                  )
                }
                {
                  trades.items.length === 0 &&
                  <li className="text-center pt5" >{intl.get('common.list.no_data')}</li>
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
