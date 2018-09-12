import * as React from 'react'
import {connect} from 'dva'
import {getFormattedTime} from 'modules/formatter/common'
import TVChartContainer from '../TVChartContainer/index';

class KlineTradingview extends React.Component {

  render() {
    return (
      <div id="kline">
        <TVChartContainer />
      </div>
    );
  }
}

export default (KlineTradingview);
