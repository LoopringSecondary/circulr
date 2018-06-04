import * as React from 'react'
import {connect} from 'dva'
import {getFormattedTime} from 'modules/formatter/common'
import moment from 'moment'
import { Chart, Tooltip, Axis, Bar, Line, View } from 'viser-react';
import * as fm from 'LoopringJS/common/formatter'

const DataSet = require('@antv/data-set');
class DepthChart extends React.Component {
  render() {
    const {depth} = this.props
    const values1 = {
      "sell":[["0.9500000000",10],["0.1410000000",20],["0.0100000000",10],["0.0016328200",11],["0.0016328100",12],["0.0008934900",13],["0.0008919300",18],["0.0008750000",2]],
      "buy":[["0.0008720000",20],["0.0008693400",15],["0.0008679800",19],["0.0008673300",26],["0.0008100000",1],["0.0002000000",20],["0.0000890000",5],["0.0000200000",16]]
    }

    let buyVol = 0
    const sourceBuy = depth.buy.map((item) => {
      buyVol = buyVol + fm.toNumber(item[1])
      return { price:fm.toNumber(item[0]), vol:buyVol }
    }).reverse();
    let sellVol = 0
    const sourceSell = depth.sell.reverse().map((item) => {
      sellVol = sellVol + fm.toNumber(item[1])
      return { price:fm.toNumber(item[0]), vol:sellVol }
    })

    return (
      <div className="row ml0 mr0">
        <div className="col-6 pl0 pr0">
          <Chart forceFit height={100} data={sourceBuy} padding={[0,0,0,0]}>
            <Tooltip />
            <Axis />
            <Line position="price*vol" shape="hv" />
          </Chart>
        </div>
        <div className="col-6 pl0 pr0">
          <Chart forceFit height={100} data={sourceSell}  padding={[0,0,0,0]}>
            <Tooltip />
            <Axis />
            <Line position="price*vol" shape="hv" />
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
