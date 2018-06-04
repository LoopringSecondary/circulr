import React from 'react';
import { Chart, Geom, Axis, Tooltip, Coord, Label, Legend, View, Guide, Shape } from "bizcharts";
import Slider from 'bizcharts-plugin-slider'
import {connect} from 'dva'
import {getFormattedTime} from 'modules/formatter/common'
import moment from 'moment'

const DataSet = require('@antv/data-set');
const { DataView } = DataSet;
const cols = {
  'time': {
    type: 'timeCat',
    nice: false,
    range: [ 0, 1 ]
  },
  trend: {
    values: [ '上涨', '下跌' ]
  },
  'volumn': {alias: '成交量'},
  'start': {alias: '开盘价'},
  'end': {alias: '收盘价'},
  'max': {alias: '最高价'},
  'min': {alias: '最低价'},
  'range': {alias: '股票价格'}
}

class KlineChart extends React.Component {
  render() {
    const {trends} = this.props

    const data = trends ? trends.map(item=>{
      //TODO MOCK
      if(item.high === 0.14142136) {
        item.high = 0.00085929077
      }
      const time = getFormattedTime(moment.unix(item.start),'YYYY-MM-DD HH:mm')
      return {
        time : time,
        start : item.open,
        max : item.high,
        min : item.high,
        end : item.close,
        volumn : item.vol
      }
    }) : []

    // 设置状态量，时间格式建议转换为时间戳，转换为时间戳时请注意区间
    const ds = new DataSet({
        state: {
          start: '2015-04-07',
          end: '2015-07-28'
        }
      });
    const dv = ds.createView();
    if(data && data.length > 0) {
      dv.source(data)
      // .transform({
      //   type: 'filter',
      //   callback: obj => {
      //     const date = obj.time;
      //     return date <= ds.state.end && date >= ds.state.start;
      //   }
      // })
        .transform({
          type: 'map',
          callback: obj => {
            obj.trend = (obj.start <= obj.end) ? '上涨' : '下跌';
            obj.range = [ obj.start, obj.end, obj.max, obj.min ];
            return obj;
          }
        });
    }

    function onChange(obj) {
      const {startText, endText} = obj;
      ds.setState('start', startText);
      ds.setState('end', endText);
    }

    return (
      <div>
        {
          data && data.length > 0 &&
          <Chart height={200} animate={false} padding={[10, 10, 20, 40]} data={dv} scale={cols}
                 forceFit>
            <Legend offset={20}/>
            <Tooltip showTitle={false}
                     itemTpl='<li data-index={index}><span style="background-color:{color};" class="g2-tooltip-marker"></span>{name}{value}</li>'/>
            <View end={{x: 1, y: 0.5}} data={dv}>
              <Axis name="time"/>
              <Axis name="range"/>
              <Geom
                type='schema'
                position="time*range"
                color={['trend', val => {
                  if (val === '上涨') {
                    return '#f04864';
                  }

                  if (val === '下跌') {
                    return '#2fc25b';
                  }
                }]}
                tooltip={['time*start*end*max*min', (time, start, end, max, min) => {
                  return {
                    name: time,
                    value: '<br><span style="padding-left: 16px">开盘价：' + start + '</span><br/>'
                    + '<span style="padding-left: 16px">收盘价：' + end + '</span><br/>'
                    + '<span style="padding-left: 16px">最高价：' + max + '</span><br/>'
                    + '<span style="padding-left: 16px">最低价：' + min + '</span>'
                  };
                }]}
                shape="candle"
              />
            </View>
            <View start={{x: 0, y: 0.65}} data={dv} scale={{volumn: {tickCount: 2}}}>
              <Axis name="volumn" label={{
                formatter: function (val) {
                  return parseInt(val / 1000, 10) + 'k';
                }
              }}/>
              <Axis name="time" tickLine={null} label={null}/>
              <Geom
                type='interval'
                position="time*volumn"
                color={['trend', val => {
                  if (val === '上涨') {
                    return '#f04864';
                  }

                  if (val === '下跌') {
                    return '#2fc25b';
                  }
                }]}
                tooltip={['time*volumn', (time, volumn) => {
                  return {
                    name: time,
                    value: '<br/><span style="padding-left: 16px">成交量：' + volumn + '</span><br/>'
                  };
                }]}
                shape="candle"
              />
            </View>
          </Chart>
        }
        {
          data && data.length > 0 &&
          <div>
            <Slider padding={[20, 40, 20, 40]} width='auto' height={26} start={ds.state.start} end={ds.state.end}
                    xAxis="time" yAxis='volumn' scales={{time: {type: 'timeCat', nice: false,}}} data={data}
                    onChange={onChange.bind(this)}
            />
          </div>
        }
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
