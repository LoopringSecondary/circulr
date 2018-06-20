import React from 'react'
import intl from 'react-intl-universal'
import { Chart, Tooltip, Axis, Line, Area } from 'viser-react';
import {connect} from 'dva'
import {toNumber, toBig} from 'LoopringJS/common/formatter'
import * as uiFormatter from 'modules/formatter/common'
import moment from 'moment'

function PriceChart(props) {
  const {prices} = props
  let newPrices = [...prices]
  //sort by time;
  newPrices.sort(function(a, b){
    return toNumber(a.time) - toNumber(b.time);
  });
  const source = newPrices.map(item=>{
    const time = uiFormatter.getFormatTime(toNumber(item.time)*1e3)
    return {price:toNumber(item.price), time:time}
  })
  return (
    <div className="column" style={{height:"251px"}}>
       <div className="card-header card-header-dark bordered">
            <h4>{intl.get('price_chart.price_chart')}</h4>
        </div>
        <div className="card-body">
          <Chart forceFit height={190} data={source} padding={[0,0,0,0]} background={{fill:'transparent'}} plotBackground={{fill:'transparent'}}>
            <Tooltip crosshairs={{ type: 'line' }} />
            <Axis show={false} dataKey="time" label={{formatter:(value)=>uiFormatter.getFormatTime(value),offset:10,textStyle:{fontSize:'10px'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}} />
            <Axis show={false} dataKey="price" position="left" label={{formatter:(value)=>value,offset:10,textStyle:{fontSize:'10px'}}} grid={{lineStyle:{stroke: 'rgba(255,255,255,0.1)'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}}/>
            <Line position="time*price" color='#0e45c5' size="2"/>
            <Area position="time*price" color="#0e45c5"/>
          </Chart>
       </div>
    </div>
  )
}

function mapToProps(state) {
  return {
    prices:state.sockets.globalTrend.items,
  }
}

export default (connect(mapToProps)(PriceChart));
