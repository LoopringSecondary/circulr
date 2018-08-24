import { Chart, Tooltip, Legend, Axis, Line, Plugin, Slider, View, Candle, Bar,Grid } from 'viser-react';
import * as Viser from 'viser-react';
import * as React from 'react'
import G2 from '@antv/g2'
import {connect} from 'dva'
import {getFormattedTime} from 'modules/formatter/common'
import moment from 'moment'
import mockData from './mock'

console.log('Viser',Viser)

const { Global } = G2; // 获取 Global 全局对象
Global.setTheme('dark');

const DataSet = require('@antv/data-set');

const scale1 = [{
  dataKey: 'time',
  type: 'timeCat',
  nice: false,
  range: [ 0, 1 ],
  tickInterval: 0.1,

}, {
  dataKey: 'trend',
  values: [ '上涨', '下跌' ],
}, {
  dataKey: 'volumn',
  alias: '成交量'
}, {
  dataKey: 'start',
  alias: '开盘价'
}, {
  dataKey: 'end',
  alias: '收盘价'
}, {
  dataKey: 'max',
  alias: '最高价'
}, {
  dataKey: 'min',
  alias: '最低价'
}, {
  dataKey: 'range',
  alias: '股票价格'
}];


const tooltipOpts = {
  showTitle: false,
  itemTpl: '<li data-index={index}>'
  + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
  + '{name}{value}</li>',
};

class KlineChart extends React.Component {

  state = {
    start: '2017-07-17',
    end: '2017-08-20',
  }

  render() {
    const {start, end} = this.state;
    const {trends} = this.props

    // const data = trends ? trends.map(item=>{
    //   const time = getFormattedTime(moment.unix(item.start),'YYYY-MM-DD HH:mm')
    //   return {
    //     time : time,
    //     start : item.open,
    //     max : item.high,
    //     min : item.low,
    //     end : item.close,
    //     volumn : item.vol
    //   }
    // }) : []

    const data = mockData ? mockData.map(item=>{
      return {
        ...item
      }
    }) : []

    const ds = new DataSet({
      state: {
        start,
        end,
      }
    });
    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'map',
        callback: obj => {
          obj.trend = (obj.start <= obj.end) ? '上涨' : '下跌';
          obj.range = [ obj.start, obj.end, obj.max, obj.min ];
          return obj;
        }
      });

    const slideChange = (opts) => {
      const {startText, endText} = opts;
      ds.setState('start', startText);
      ds.setState('end', endText);
    }
    const sliderOpts = {
      container:"kline",
      width: 'auto',
      height: 26,
      padding: [ 20, 40, 20, 40 ],
      start, // 和状态量对应
      end,
      data, // 源数据
      xAxis: 'time', // 背景图的横轴对应字段，同时为数据筛选的字段
      yAxis: 'volumn', // 背景图的纵轴对应字段，同时为数据筛选的字段
      scales: {
        time: {
          type: 'timeCat',
          nice: false,
        }
      },
      onChange: slideChange.bind(this)
    };

    return (
      <div id="kline">
        <Chart forceFit height={235} animate={false} padding={[ 10,0,20,0 ]}  data={dv} scale={scale1} background={{fill:'transparent'}} plotBackground={{fill:'transparent'}}>
          <Tooltip {...tooltipOpts}/>
          <Axis dataKey="time" grid={null} show={false} />
          <Axis dataKey="range" position="right" grid={{lineStyle:{stroke: 'rgba(255,255,255,0.1)'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}}/>
          <View data={dv} end={{x: 1, y: 0.68}}  guide={()=>null}>
            <Candle
              position='time*range'
              color={['trend', val => {
                if (val === '上涨') {return '#f04864';}
                if (val === '下跌') {return '#2fc25b';}
              }]}
              tooltip={['time*start*end*max*min', (time, start, end, max, min) => {
                return {
                  name: '<span style="color: #000000;">Date: ' + time + ' </span>',
                  value: '<br><span style="padding-left: 16px; color: #000000">Starting Price: ' + start + '</span><br/>'
                  + '<span style="padding-left: 16px; color: #000000">Ending Price: ' + end + '</span><br/>'
                  + '<span style="padding-left: 16px; color: #000000">Max Price: ' + max + '</span><br/>'
                  + '<span style="padding-left: 16px; color: #000000">Min Price: ' + min + '</span>'
                };
              }]}
            />
          </View>
          <View data={dv} scale={[{dataKey: 'volumn',tickCount: 2}]} start={{x: 0, y: 2}}>
            <Axis dataKey="time" line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}} label={{formatter:(value)=>moment(value,'YYYY-MM-DD').format('MM-DD'),offset:10,textStyle:{fontSize:'10px'}}}/>
            <Axis dataKey="volumn" position="right" grid={{lineStyle:{stroke: 'rgba(255,255,255,0.1)'}}} line={{stroke:'rgba(255,255,255,0.1)'}} tickLine={{stroke:'rgba(255,255,255,0.1)'}}/>
            <Bar
              position='time*volumn'
              color={['trend',  val => {
                if (val === '上涨') {return '#f04864';}
                if (val === '下跌') {return '#2fc25b';}
              }]}
              tooltip={['time*volumn', (time, volumn) => {
                return {
                  name: '<span style="color: #000000;">Date: ' + time + ' </span>',
                  value: '<br/><span style="padding-left: 16pxc; color: #000000"">Volume: ' + volumn + '</span><br/>'
                };
              }]}
            />
          </View>
        </Chart>
        { false &&<Plugin><Slider {...sliderOpts} /></Plugin>}
      </div>
    );
  }
}

function mapToProps(state) {
  return {
    trends:state.sockets.trends.items,
  }
}

export default (connect(mapToProps)(KlineChart));
