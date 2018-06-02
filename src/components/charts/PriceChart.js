import React from 'react'
import intl from 'react-intl-universal'

function PriceChart(props) {
  return (
    <div className="column" style={{height:"251px"}}>
       <div className="card-header card-header-dark bordered">
            <h4>{intl.get('price_chart.price_chart')}</h4>
        </div>
        <div className="card-body">
            <div className="cmc-chart img-responsive"><img src={require('../../assets/images/chart.png')} /></div>
       </div>
    </div>
  )
}
export default PriceChart
