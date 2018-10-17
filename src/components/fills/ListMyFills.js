import React from 'react'
import { Form,Select,Badge,Spin} from 'antd'
import ListPagination from 'LoopringUI/components/ListPagination'
import SelectContainer from 'LoopringUI/components/SelectContainer'
import {getSupportedMarket} from 'LoopringJS/relay/rpc/market'
import {FillFm} from 'modules/fills/formatters'
import config from 'common/config'
import intl from 'react-intl-universal'

const ListHeader = ({fills})=>{
  const sideChange = (side)=>{
    fills.filtersChange({filters:{side}})
  }
  const marketChange = (market)=>{
    fills.filtersChange({filters:{market}})
  }
  return (
    <div className="form-inline form-dark">
        <span>
          <SelectContainer
            loadOptions={getSupportedMarket.bind(this,window.config.rpc_host)}
            transform={(res)=>{
              if(res && !res.error){
                let pairs = config.getMarkets().map(item=>`${item.tokenx}-${item.tokeny}`)
                let options = res.result.filter(item=>pairs.includes(item)).map(item=>({label:item,value:item}))
                return [
                  {label:`${intl.get('common.all')} ${intl.get('common.markets')}`,value:""},
                  ...options,
                ]
              }else{
                return []
              }
            }}
            onChange={marketChange}
            placeholder={intl.get('common.market')}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
            dropdownMatchSelectWidth={false}
            value={fills.filters.market  || ""}
            size="small"
          >
          </SelectContainer>
        </span>
        <span>
           <Select
             placeholder={intl.get('common.side')}
             onChange={sideChange}
             dropdownMatchSelectWidth={false}
             value={fills.filters.side || ""}
             size="small"
           >
             <Select.Option value="">{intl.get('common.all')}&nbsp;{intl.get('common.sides')}</Select.Option>
             <Select.Option value="sell">{intl.get('common.sell')}</Select.Option>
             <Select.Option value="buy">{intl.get('common.buy')}</Select.Option>
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
        <Spin spinning={fills.loading}>
          <div style={{height:"225px",overflow:"auto"}}>
            <table style={{overflow:'auto'}} className="table table-dark table-hover table-striped table-inverse table-nowrap table-responsive text-center text-left-col1 text-left-col2" >
              <thead>
                  <tr>
                      <th>{intl.get('fill.ringIndex')}</th>
                      <th>{intl.get('common.market')}</th>
                      <th>{intl.get('common.side')}</th>
                      <th>{intl.get('common.amount')}</th>
                      <th>{intl.get('common.price')}</th>
                      <th>{intl.get('common.total')}</th>
                      <th>{intl.get('fill.lrc_fee')}</th>
                      <th>{intl.get('fill.lrc_reward')}</th>
                      <th>{intl.get('fill.created')}</th>
                  </tr>
              </thead>
              <tbody>
                {
                  fills.items.map((item,index)=>{
                    const fillFm = new FillFm(item)
                    const actions = {
                      gotoDetail:()=>props.dispatch({type:'layers/showLayer',payload:{id:'ringDetail',fill:item}})
                    }
                    return (
                      <tr key={index}>
                        <td>{renders.ringIndex(fillFm,actions)}</td>
                        <td>{item.market}</td>
                        <td>{renders.side(fillFm)}</td>
                        <td>{fillFm.getAmount()}</td>
                        <td>{fillFm.getPrice()}</td>
                        <td>{fillFm.getTotal()}</td>
                        <td>{fillFm.getLRCFee()}</td>
                        <td>{fillFm.getLRCReward()}</td>
                        <td>{fillFm.getCreateTime()}</td>
                     </tr>
                    )
                  })
                }
                {
                  fills.items.length === 0 &&
                  <tr><td colSpan='100'><div className="text-center">{intl.get('common.list.no_data')}</div></td></tr>
                }
              </tbody>
            </table>
          </div>
        </Spin>

        <ListPagination list={fills}/>
  </div>
  )
}
  const renders = {
    ringIndex: (fm,actions) => {
      return (
          <a className="text-truncate text-left color-blue-500" onClick={actions && actions.gotoDetail}>
            {fm.fill.ringIndex}
            <span hidden>{fm.fill.ringHash}</span>
          </a>
      )
    },
    side: (fm) => {
      if (fm.fill.side === 'sell') {
        return <div className="text-error">{intl.get('common.sell')}</div>
      }
      if (fm.fill.side === 'buy') {
        return <div className="text-success">{intl.get('common.buy')}</div>
      }
    },
  }

