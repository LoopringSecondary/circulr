import React from 'react'
import intl from 'react-intl-universal'
import {connect} from 'dva'
import {getTokensByMarket} from 'modules/formatter/common'

function ListOrderBook(props) {
  console.log('ListOrderBook render',props)
  const {depth} = props
  const tokens = getTokensByMarket(depth.filters.market)
  return (
    <div>
	    <div className="card dark" style={{height:"-webkit-calc(100vh - 40px)"}}>
	    	<div className="card-header card-header-dark bordered">
	    	    <h4>Order Book</h4>
	    	</div>
	    	<div className="trade-list" style={{height:"-webkit-calc(100% - 31px)"}}>
    	    	    <div className="bg" style={{ position: "absolute", top:"50%", marginTop:"-45px", zIndex: "100", width: "100%", height: "40px", lineHeight: "38px", border:"1px solid rgba(255,255,255,.07)", borderWidth: "1px 0", fontSize: "16px"}}>
	    	    		<div className="text-up text-center">0.00008189<span className="offset-md"><i className="icon-arrow-up"></i></span></div>
	    	    	</div>
	    	    	<div className="bg blockbar" style={{ position: "absolute", bottom:"40px", zIndex: "100", width: "100%", border:"1px solid rgba(255,255,255,.07)", borderWidth: "1px 0 0", fontSize: "16px"}}>
	    		    	<span>Aggregation</span>
	    		    	<span>1.0</span>
	    		    	<span><i className="icon-plus-o"></i><i className="icon-minus-o"></i></span>
	    	    	</div>
    	        <ul className="mr-0">
	    	            <li className="trade-list-header">
			    	        <span>Price({tokens.right})</span>
			    	        <span>Amount({tokens.left})</span>
			    	        <span>Total({tokens.right})</span>
		    	        </li>
		    	    </ul>
	    	    <div style={{height: "-webkit-calc(50% - 85px)",marginTop:"5px",marginBottom:"0",paddiongBottom:"10" }}>
	    	        <ul style={{height: "100%", overflow:"auto",paddingTop:"0",marginBottom:"0px" }}>
                      {
                        depth.item.sell.map((item,index)=>
                          <li key={index}><span className="text-down">{Number(item[0]).toFixed(8)}</span><span>{Number(item[1]).toFixed(8)}</span><span>{Number(item[2]).toFixed(8)}</span></li>
                        )
                      }
    	            </ul>
	    	    </div>
	    	    <div style={{height: "-webkit-calc(50% - 85px)",paddingTop:"0",paddingBottom:"0",marginTop:"50px",marginBottom:"0"}}>
    	            <ul style={{height: "100%", overflow:"auto",paddingTop:"0",marginBottom:"0" }}>
    	                {
                        depth.item.buy.map((item,index)=>
                          <li key={index}><span className="text-up">{Number(item[0]).toFixed(8)}</span><span>{Number(item[1]).toFixed(8)}</span><span>{Number(item[2]).toFixed(8)}</span></li>
                        )
                      }
    	            </ul>

	    	    </div>
	        </div>
	    </div>
    </div>
  )
}

export default connect(
  ({sockets:{depth}})=>({depth})
)(ListOrderBook)
