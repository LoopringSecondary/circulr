import React from 'react';
import intl from 'react-intl-universal';

function ListOrderBook(props) {
  return (
    <div>
	    <div className="card h-full">
	    	<div className="card-header bordered">
	    	    <h4>Order Book</h4>
	    	</div>
	    	<div className="trade-list h-full" style={{paddingTop: "114px", marginTop: "-114px" }}>
	    	    <div style={{position: "relative", height: "50%", paddingBottom: "70px" }}>
	    	        <div className="trade-list-header"><span>Price(ETH)</span><span>Amount(LRC)</span><span>Total(ETH)</span></div>
	    	        <div className="content-scroll">
	    	            <ul>
	    	                <li><span className="text-down">0.00009470</span><span>127</span><span>0.01202690</span></li>
	    	                <li><span className="text-down">0.00009469</span><span>46</span><span>0.00435574</span></li>
	    	                <li><span className="text-down">0.00009468</span><span>231</span><span>0.02187108</span></li>
	    	                <li><span className="text-down">0.00009466</span><span>105</span><span>0.00993930</span></li>
	    	                <li><span className="text-down">0.00009464</span><span>222</span><span>0.02101008</span></li>
	    	                <li><span className="text-down">0.00009462</span><span>56</span><span>0.01248984</span></li>
	    	                <li><span className="text-down">0.00009461</span><span>21</span><span>0.00473050</span></li>
	    	                <li><span className="text-down">0.00009460</span><span>3</span><span>0.03396140</span></li>
	    	                <li><span className="text-down">0.00009458</span><span>4,674</span><span>0.00472900</span></li>
	    	                <li><span className="text-down">0.00009453</span><span>67</span><span>0.00926394</span></li>
	    	                <li><span className="text-down">0.00009436</span><span>87</span><span>0.20098680</span></li>
	    	                <li><span className="text-down">0.00009430</span><span>59</span><span>0.00396060</span></li>
	    	                <li><span className="text-down">0.00009428</span><span>19</span><span>0.37721428</span></li>
	    	                <li><span className="text-down">0.00009410</span><span>1,212</span><span>0.08064370</span></li>
	    	            </ul>
	    	        </div>
	    	        <div className="bg text-center" style={{ position: "absolute", bottom:"0", zIndex: "100", width: "100%", height: "40px", lineHeight: "38px", border:"1px solid rgba(255,255,255,.07)", borderWidth: "1px 0", fontSize: "16px"}}>
	    	            <div className="text-up">0.00008189<span className="offset-md"><i className="icon-arrow-up"></i></span></div>
	    	        </div>
	    	    </div>
	    	    <div style={{position: "relative", height: "50%", paddingBottom: "80px" }}>
	    	        <div className="trade-list-header"><span>Price(ETH)</span><span>Amount(LRC)</span><span>Total(ETH)</span></div>
	    	        <div className="content-scroll">
	    	            <ul>
	    	                <li><span className="text-up">0.00009417</span><span>545</span><span>0.00178923</span></li>
	    	                <li><span className="text-up">0.00009416</span><span>2,245</span><span>0.00291896</span></li>
	    	                <li><span className="text-up">0.00009412</span><span>767</span><span>0.00790608</span></li>
	    	                <li><span className="text-up">0.00009410</span><span>22</span><span>0.00103510</span></li>
	    	                <li><span className="text-up">0.00009408</span><span>646</span><span>0.00150528</span></li>
	    	                <li><span className="text-up">0.00009407</span><span>12</span><span>0.02069540</span></li>
	    	                <li><span className="text-up">0.00009406</span><span>67</span><span>0.00451488</span></li>
	    	                <li><span className="text-up">0.00009405</span><span>789</span><span>0.11342430</span></li>
	    	                <li><span className="text-up">0.00009400</span><span>2,786</span><span>0.83133600</span></li>
	    	                <li><span className="text-up">0.00009399</span><span>12</span><span>0.02359149</span></li>
	    	                <li><span className="text-up">0.00009398</span><span>34</span><span>0.15224760</span></li>
	    	                <li><span className="text-up">0.00009396</span><span>45</span><span>0.00187920</span></li>
	    	                <li><span className="text-up">0.00009395</span><span>19</span><span>0.01860210</span></li>
	    	                <li><span className="text-up">0.00009393</span><span>1,654</span><span>0.04987683</span></li>
	    	            </ul>
	    	        </div>
	    	        <div className="bg blockbar"><span>Aggregation</span><span>1.0</span><span><i className="icon-plus-o"></i><i className="icon-minus-o"></i></span></div>
	    	    </div>
	        </div>
	    </div>
    </div>
  )
}

export default ListOrderBook
