import * as React from 'react'
import {connect} from 'dva'
import {getFormattedTime} from 'modules/formatter/common'
import moment from 'moment'
import { Chart, Tooltip, Axis, Bar, Line, Area } from 'viser-react';
import * as fm from 'LoopringJS/common/formatter'

const DataSet = require('@antv/data-set');
class DepthChart extends React.Component {
  render() {
    const {depth} = this.props
    let buyVol = 0
    let sourceBuy = depth.buy.map((item) => {
      buyVol = buyVol + fm.toNumber(item[1])
      return { price:fm.toNumber(item[0]), vol:buyVol }
    }).reverse();
    let sellVol = 0
    let sourceSell = depth.sell.reverse().map((item) => {
      sellVol = sellVol + fm.toNumber(item[1])
      return { price:fm.toNumber(item[0]), vol:sellVol }
    })

    //TODO mock
    sourceBuy = [{"price":1,"vol":92},{"price":2,"vol":83},{"price":9,"vol":81},{"price":20,"vol":79},{"price":21,"vol":35},{"price":27,"vol":34},{"price":34,"vol":13},{"price":56,"vol":11},{"price":58,"vol":7},{"price":63,"vol":4},{"price":77,"vol":2},{"price":85,"vol":1}]
    sourceSell = [{"price":89,"vol":21},{"price":92,"vol":33},{"price":102,"vol":45},{"price":121,"vol":53},{"price":131,"vol":54},{"price":141,"vol":78},{"price":155,"vol":90},{"price":158,"vol":92},{"price":190,"vol":98},{"price":195,"vol":101},{"price":200,"vol":111}]

    return (
      <div className="row ml0 mr0">
        <div className="col-6 pl0 pr0">
          <Chart forceFit height={100} data={sourceBuy} padding={[0,0,0,0]}>
            <Tooltip crosshairs={{ type: 'line' }} />
            <Axis />
            <Area position="price*vol" color="red"/>
          </Chart>
        </div>
        <div className="col-6 pl0 pr0">
          <Chart forceFit height={100} data={sourceSell} padding={[0,0,0,0]}>
            <Tooltip crosshairs={{ type: 'line' }} />
            <Axis />
            <Area position="price*vol" color="green"/>
          </Chart>
        </div>
      </div>
    );
  }
}

function mapToProps(state) {
  return {
    depth:state.sockets.depth.item,
  }
}

export default (connect(mapToProps)(DepthChart));
