import React from 'react'
import { Form,Select,Badge } from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import SelectContainer from 'LoopringUI/components/SelectContainer'
import {getSupportedMarket} from 'LoopringJS/relay/rpc/market'
import FillFm from 'modules/fills/formatters'
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
            defaultValue=""
            size="small"
          >
          </SelectContainer>
        </span>
        <span>
           <Select
             placeholder={intl.get('orders.side')}
             onChange={sideChange}
             dropdownMatchSelectWidth={false}
             defaultValue=""
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
                      <td>{FillFm.amount(item)}</td>
                      <td>{FillFm.price(item)}</td>
                      <td>{FillFm.total(item)}</td>
                      <td>{FillFm.lrcFee(item)}</td>
                      <td>{FillFm.lrcReward(item)}</td>
                      <td>{FillFm.time(item)}</td>
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
  }

