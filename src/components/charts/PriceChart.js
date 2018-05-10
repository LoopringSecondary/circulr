import React from 'react';

function PriceChart(props) {
  return (
    <div>
       <div className="card-header bordered">
            <h4>CMC Chart</h4>
        </div>
        <div className="card-body">
            <div className="cmc-chart img-responsive"><img src={require('../../assets/images/chart.png')} /></div>
       </div>
    </div>
  )
}
export default PriceChart
