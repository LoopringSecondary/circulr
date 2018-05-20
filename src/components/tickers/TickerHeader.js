import React from 'react';

function TickerHeader(props) {
  return (
    <div className="tradeHeaderEle justify-content-between align-items-center" style={{display: "flex"}}>
        <div id="back"><i className="icon-chevron-left"></i></div>
        <div className="pair-select d-flex justify-content-between tokenselect">LRC/ETH <b className="caret"></b></div>
        <div className="token-last-quotes">
            <ul className="d-flex justify-content-between align-items-center">
                <li><small>Last Price</small><em><span className="text-up">0.00086663</span> $0.34</em></li>
                <li><small>24H Change</small><em><span className="text-down">0.00086663</span> -0.70%</em></li>
                <li><small>24H High</small><em>0.00008219</em></li>
                <li><small>24H Low</small><em>0.00007859</em></li>
                <li><small>24H Volume</small><em>207.98BTC</em></li>
            </ul>
        </div>
    </div>
  )
}
export default TickerHeader
