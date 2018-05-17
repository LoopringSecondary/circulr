import React from 'react'
import { Form,Select,Badge } from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import SelectContainer from 'LoopringUI/components/SelectContainer'
import {OrderFm} from 'modules/orders/ListFm'
import TokenFm from 'modules/tokens/TokenFm'
import commonFm from 'modules/formatter/common'
import {getSupportedMarket} from 'LoopringJS/relay/rpc/market'
import config from 'common/config'
import intl from 'react-intl-universal'

const ListHeader = ({fills})=>{
  const sideChange = (side)=>{
    fills.filtersChange({side})
  }
  const marketChange = (market)=>{
    fills.filtersChange({market})
  }
  return (
    <div className="form-inline form-dark">
        <span>
          <SelectContainer
            loadOptions={getSupportedMarket.bind(this,window.config.rpc_host)}
            transform={(res)=>{
              let pairs = config.getMarkets().map(item=>`${item.tokenx}-${item.tokeny}`)
              let options = res.result.filter(item=>pairs.includes(item)).map(item=>({label:item,value:item}))
              return [
                {label:`${intl.get('global.all')} ${intl.get('orders.market')}`,value:""},
                ...options,
              ]
            }}
            onChange={marketChange}
            placeholder={intl.get('orders.market')}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            dropdownMatchSelectWidth={false}
            size="small"
          >
          </SelectContainer>
        </span>
        <span>
           <Select
             placeholder={intl.get('orders.side')}
             optionFilterProp="children"
             onChange={sideChange}
             filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
             dropdownMatchSelectWidth={false}
             size="small"
           >
             <Select.Option value="">{intl.get('global.all')}&nbsp;{intl.get('orders.side')}</Select.Option>
             <Select.Option value="sell">{intl.get('orders.side_sell')}</Select.Option>
             <Select.Option value="buy">{intl.get('orders.side_buy')}</Select.Option>
           </Select>
        </span>
    </div>
  )
}

export default function ListMyFills(props) {
  console.log('ListMyFills render',props.fills)
  const {fills={}}=props
  return (
    <div className="">
        <ListHeader fills={fills} />
        <div style={{height:"160px",overflow:"auto"}}>
          <table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2" >
            <thead>
                <tr>
                    <th>Ring</th>
                    <th>Market</th>
                    <th>Side</th>
                    <th>Amount</th>
                    <th>Price</th>
                    <th>Total</th>
                    <th>LRC Fee</th>
                    <th>Trading Fee</th>
                    <th>Trading Reward</th>
                    <th>Time</th>
                </tr>
            </thead>
            <tbody>
              {
                fills.items.map((item,index)=>{
                  return (
                    <tr key={index}>
                      <td>{renders.ringIndex(item)}</td>
                      <td>{item.market}</td>
                      <td>{renders.side(item)}</td>
                      <td>{renders.amount(item)}</td>
                      <td>{renders.price(item)}</td>
                      <td>{renders.total(item)}%</td>
                      <td>{renders.lrcFee(item)}</td>
                      <td>{renders.lrcReward(item)}</td>
                   </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
        <ListPagination list={fills}/>
  </div>
  )
}
  const renders = {
    ringIndex: (item) => {
      return (
          <a className="text-truncate text-left color-blue-500">
            {item.fillIndex}
          </a>
      )
    },
    side: (item) => {
      if (item.side === 'sell') {
        return <div className="color-red-500">{intl.get('orders.side_sell')}</div>
      }
      if (item.side === 'buy') {
        return <div className="color-green-500">{intl.get('orders.side_buy')}</div>
      }
    },
    amount: (item) => {
      const fmS = item.side.toLowerCase() === 'buy' ? new TokenFm({symbol: item.tokenB}) : new TokenFm({symbol: item.tokenS});
      const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountB) : fmS.getAmount(item.amountS);
      return <span> {comonFm.getFormatNum(amount)} {item.side === 'buy' ? item.tokenB : item.tokenS} </span>
    },
    price: (item) => {
      const tokenB = window.config.getTokenBySymbol(item.tokenB);
      const tokenS = window.config.getTokenBySymbol(item.tokenS);
      const market = window.config.getMarketByPair(item.market);
      const price = item.side.toLowerCase() === 'buy' ? (toBig(item.amountS).div('1e' + tokenS.digits).div(toBig(item.amountB).div('1e' + tokenB.digits))).toFixed(market.pricePrecision) :
        (toBig(item.amountB).div('1e' + tokenB.digits).div(toBig(item.amountS).div('1e' + tokenS.digits))).toFixed(market.pricePrecision);
      return <span> {comonFm.getFormatNum(price)} </span>
    },
    total: (item) => {
      const fmS = item.side.toLowerCase() === 'buy' ? new TokenFm({symbol: item.tokenS}) : new TokenFm({symbol: item.tokenB});
      const amount = item.side.toLowerCase() === 'buy' ? fmS.getAmount(item.amountS) : fmS.getAmount(item.amountB);
      return <span> {comonFm.getFormatNum(amount)} {item.side === 'buy' ? item.tokenS : item.tokenB} </span>
    },
    lrcFee: (item) => {
      const fmLrc = new TokenFm({symbol: 'LRC'});
      return <span> {comonFm.getFormatNum(fmLrc.getAmount(item.lrcFee))} {'LRC'} </span>
    },
    lrcReward: (item) => {
      const fmLrc = new TokenFm({symbol: 'LRC'});
      return <span> {comonFm.getFormatNum(fmLrc.getAmount(item.lrcReward))} {'LRC'} </span>
    },
    time: (item) => {
      return comonFm.getFormatTime(toNumber(item.createTime) * 1e3)
    },
  }

