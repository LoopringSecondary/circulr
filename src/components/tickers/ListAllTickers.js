import React from 'react';

function ListAllTickers(props) {
  return (
    <div>
	    <div className="token-select">
	        <div className="token-select-header">
	            <input value="LRC/ETH" /><i className="icon-star icon-favorites active"></i>
	        </div>
	        <div className="token-select-body" style={{height: "400px"}}>
	            <div className="content-scroll">
	                <div className="item">
	                    <div className="title">Recent</div>
	                    <ul>
	                        <li><span>LRC/ETH</span><span>0.000056</span><span className="text-up">+0.48</span></li>
	                        <li><span>LRC/BTC</span><span>0.00000218</span><span className="text-down">-0.12</span></li>
	                    </ul>
	                </div>
	                <div className="item">
	                    <div className="title">Favorites</div>
	                    <ul>
	                        <li className="active"><span>LRC/ETH</span><span>0.000056</span><span className="text-up">+0.48</span></li>
	                        <li><span>LRC/BTC</span><span>0.00000218</span><span className="text-down">-0.12</span></li>
	                        <li><span>LRC/LTC</span><span>0.082</span><span className="text-up">+0.56</span></li>
	                    </ul>
	                </div>
	                <div className="item">
	                    <div className="title">All Markets</div>
	                    <ul>
	                        <li><span>LRC/ETH</span><span>0.000056</span><span className="text-up">+0.48</span></li>
	                        <li><span>LRC/BTC</span><span>0.00000218</span><span className="text-down">-0.12</span></li>
	                        <li><span>LRC/LTC</span><span>0.082</span><span className="text-up">+0.56</span></li>
	                        <li><span>LRC/USD</span><span>0.068</span><span className="text-up">+0.66</span></li>
	                        <li><span>LRC/EOS</span><span>0.2345</span><span className="text-down">-0.88</span></li>
	                        <li><span>ETH/USD</span><span>0.082</span><span className="text-up">+0.56</span></li>
	                        <li><span>ETH/BTC</span><span>0.000056</span><span className="text-up">+0.48</span></li>
	                        <li><span>ETH/LRC</span><span>0.00000218</span><span className="text-down">-0.12</span></li>
	                        <li><span>EOS/ETH</span><span>0.082</span><span className="text-up">+0.56</span></li>
	                        <li><span>EOS/BTC</span><span>0.082</span><span className="text-up">+0.56</span></li>
	                    </ul>
	                </div>
	            </div>
	        </div>
	    </div>
    </div>
  )
}
export default ListAllTickers
