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
