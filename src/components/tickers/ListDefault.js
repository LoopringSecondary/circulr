import React from 'react'
import { Button } from 'antd';
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
    <div className="column" style={{height:"-webkit-calc(100% - 251px)",paddingBottom:"460px"}}>
        <div className="loopring-dex">
            <div className="card-header bordered">
                <h4>Loopring DEX Markets</h4>
            </div>
            <div className="item">        
                <ul>
                    <li><h3>LRC/ETH</h3></li>
                    <li><small>Price</small><span class="text-down">0.56 USD</span></li>
                    <li><small>Change</small><span className="text-up">+9.8%</span></li>
                </ul>
                <Button className="btn btn-primary">Go To Trade</Button>
            </div>
            <div className="item">        
                <ul>
                    <li><h3>LRC/ETH</h3></li>
                    <li><small>Price</small><span class="text-down">0.56 USD</span></li>
                    <li><small>Change</small><span className="text-up">+9.8%</span></li>
                </ul>
                <Button className="btn btn-primary">Go To Trade</Button>
            </div>
            <div className="item">        
                <ul>
                    <li><h3>LRC/ETH</h3></li>
                    <li><small>Price</small><span class="text-down">0.56 USD</span></li>
                    <li><small>Change</small><span className="text-up">+9.8%</span></li>
                </ul>
                <Button className="btn btn-primary">Go To Trade</Button>
            </div>
            
        </div>
        <div className="column">
            <div className="card-header bordered">
                <h4>Reference Markets</h4>
            </div>
            <div style={{overflow: "auto",maxHeight: "300px"}}>
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
