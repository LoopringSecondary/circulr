import { Chart, Tooltip, Legend, Axis, Line, Plugin, Slider, View, Candle, Bar } from 'viser-react';
import * as React from 'react';
import sourceData from './stock.js';
const DataSet = require('@antv/data-set');
console.log('sourceData',sourceData)
const scale1 = [{
  dataKey: 'time',
  type: 'timeCat',
  nice: false,
  range: [ 0, 1 ]
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

export default class KlineChart extends React.Component {

  state = {
    data: [],
    start: '2015-07-07',
    end: '2015-10-25',
  }

  slideChange = (opts) => {
    this.setState({
      start: opts.startText, end: opts.endText,
    });
  }

  getData() {
    const { start, end, data } = this.state;
    const ds = new DataSet({
      state: {
        start,
        end,
      }
    });
    const dv = ds.createView();
    dv.source(data)
      .transform({
        type: 'filter',
        callback: obj => {
          const date = obj.time;
          return date <= end && date >= start;
        }
      })
      .transform({
        type: 'map',
        callback: obj => {
          obj.trend = (obj.start <= obj.end) ? '上涨' : '下跌';
          obj.range = [ obj.start, obj.end, obj.max, obj.min ];
          return obj;
        }
      });
    return dv;
  }
  componentDidMount() {
    this.setState({ data: sourceData });
    // this.setState({ data: [] });
  }

  render() {
    const {start, end, data} = this.state;
    const dv = this.getData();

    if (!data.length) {
      return (<div></div>);
    }

    const sliderOpts = {
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
      onChange: this.slideChange.bind(this)
    };
    return (
      <div>
        <Chart forceFit height={255} animate={false} padding={[ 10, 10, 10, 10 ]} data={dv} scale={scale1}>
          <Tooltip {...tooltipOpts}/>
          { true && <Axis /> }
          { true && <Legend offset={20}/> }
          <View data={dv} end={{x: 1, y: 0.68}}  guide={()=>null}>
            <Candle position='time*range' color={['trend', val => {
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
            />
          </View>
          <View data={dv} scale={[{dataKey: 'volumn',tickCount: 2}]} start={{x: 0, y: 0.68}}>
            { true && <Axis dataKey='time' tickLine={null} label={null}/> }
            { true && <Axis dataKey='volumn' label={{
              formatter: function(val) {
                return parseInt(String(val / 1000), 10) + 'k';
              }
            }} />}
            <Bar position='time*volumn' color={['trend',  val => {
              if (val === '上涨') {
                return '#f04864';
              }

              if (val === '下跌') {
                return '#2fc25b';
              }
            }]} tooltip={['time*volumn', (time, volumn) => {
              return {
                name: time,
                value: '<br/><span style="padding-left: 16px">成交量：' + volumn + '</span><br/>'
              };
            }]} />
          </View>
        </Chart>
        {
          false &&
          <Plugin>
            <Slider {...sliderOpts} />
          </Plugin>
        }


      </div>
    );
  }
}
