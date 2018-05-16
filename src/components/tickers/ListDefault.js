import React from 'react'

function ListHeaderForm({className=''}){
  return (
    <div className={className}>
    	ListHeaderForm
    </div>
  )
}

function ListHeader({className=''}){
  return (
    <div className={className}>
    	ListHeader
    </div>
  )
}

function ListBlock(props) {
  return (
    <div>
    	<div className="loopring-dex">
          <div className="card-header bordered">
              <h4>Loopring DEX Markets</h4>
          </div>
          <div>
              <table className="table table-hover table-striped table-dark text-center text-left-col1 text-right-last" id="loopringMarket">
                  <thead>
                      <tr>
                          <th>Pair</th>
                          <th>Price</th>
                          <th>Change</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td><a href="#" className="text-link font-bold">LRC/ETH<i className="icon-chevron-right"></i></a></td>
                          <td>0.56 USD</td>
                          <td className="text-up">+9.8%</td>
                      </tr>
                      <tr>
                          <td><a href="#" className="text-link font-bold">LRC/BTC<i className="icon-chevron-right"></i></a></td>
                          <td>0.56 USD</td>
                          <td className="text-down">-1.45%</td>
                      </tr>
                      <tr>
                          <td><a href="#" className="text-link font-bold">LRC/LTC<i className="icon-chevron-right"></i></a></td>
                          <td>0.56 USD</td>
                          <td className="text-up">+9.8%</td>
                      </tr>
                  </tbody>
              </table>
          </div>
        </div>

        <div className="card-header bordered">
            <h4>Reference Markets</h4>
        </div>
        <div style={{height: "100%",overflow: "hidden",padding:"0 0 485px",minHeight: "300px"}}>
            <div className="content-scroll">
                <table className="table table-hover table-striped table-dark text-center text-left-col1 text-right-last">
                    <thead>
                        <tr>
                            <th>Markets</th>
                            <th>Price</th>
                            <th>Change</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>OKEX</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Binance</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                        <tr>
                            <td>Coinbase</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Bittrex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Poloniex</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                        <tr>
                            <td>Bitfinex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>Bitmex</td>
                            <td>0.56 USD</td>
                            <td className="text-up">+9.8%</td>
                        </tr>
                        <tr>
                            <td>GDAX</td>
                            <td>0.56 USD</td>
                            <td className="text-down">-1.45%</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  )
}

export default ListBlock
