import React from 'react'
import intl from 'react-intl-universal'
import { Chart, Tooltip, Axis, Line } from 'viser-react';
import {connect} from 'dva'

function PriceChart(props) {
  const {prices} = props
  //TODO mock datas
  const source = [{"price":1,"time":92},{"price":2,"time":93},{"price":9,"time":94},{"price":20,"time":95},{"price":21,"time":96},{"price":27,"time":97},{"price":34,"time":98},{"price":56,"time":99},{"price":58,"time":100},{"price":63,"time":101},{"price":77,"time":102},{"price":85,"time":103},{"price":86,"time":104},{"price":87,"time":105},{"price":88,"time":106},{"price":89,"time":107}]
  return (
    <div className="column" style={{height:"251px"}}>
       <div className="card-header card-header-dark bordered">
            <h4>{intl.get('price_chart.price_chart')}</h4>
        </div>
        <div className="card-body">
          <Chart forceFit height={190} data={source} padding={[0,5,15,5]} background={{fill:'transparent'}} plotBackground={{fill:'transparent'}}>
            <Tooltip crosshairs={{ type: 'line' }} />
            <Axis dataKey="time" label={{formatter:(value)=>value,offset:10,textStyle:{fontSize:'10px'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}} />
            <Axis dataKey="price" position="left" label={{formatter:(value)=>value,offset:10,textStyle:{fontSize:'10px'}}} grid={{lineStyle:{stroke: 'rgba(255,255,255,0.1)'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}}/>
            <Line position="price*time" color='#0e45c5' size="2"/>
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
