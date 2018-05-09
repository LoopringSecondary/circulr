import React from 'react';
import Tokens from '../tokens'
import Transactions from '../transactions'
import Charts from '../charts'
import Tickers from '../tickers'

function Wallet(props) {
  return (
    <div>
    	{
    		false &&
    		<div>
    			<Tokens.ListDefault />
		    	<Transactions.ListDefault />
		    	<Charts.PriceChart />
		    	<Tickers.ListDefault />
		    	<Tickers.ListDefault />
    		</div>
    	}
    	<div className="card-header bordered">
            <h4>Reference Markets</h4>
        </div>
        <div style={{height: "100%", overflow: "hidden", padding:"0 0 485px",minHeight:"300px"}}>
            <div className="content-scroll">
                <table className="table table-striped table-inverse text-center text-left-col1 text-right-last">
                    <col width="35%" />
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
export default Wallet
