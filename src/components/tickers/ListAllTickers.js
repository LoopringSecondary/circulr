import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatter'

function ListAllTickers(props) {
  const {loopringTickers} = props
  const tickersFm = new TickersFm(loopringTickers)
  const allTickers = tickersFm.getAllTickers()
  const favoredTickers = tickersFm.getFavoredTickers()
  const recentTickers = tickersFm.getRecentTickers()
  const TickItem = ({item})=>{
    const tickerFm = new TickerFm(item)
    return (
      <li>
        <span>{item.market}</span>
        <span>{tickerFm.getLast()} {tickerFm.getTokens().right}</span>
        {
          tickerFm.getChangeDirection() === 'up' &&
          <span className="text-up">+{tickerFm.getChange()}</span>
        }
        {
          tickerFm.getChangeDirection() === 'down' &&
          <span className="text-down">{tickerFm.getChange()}</span>
        }
        {
          tickerFm.getChangeDirection() === 'none' &&
          <span className="">{tickerFm.getChange()}</span>
        }
        <span>{tickerFm.getVol()} {tickerFm.getTokens().right}</span>
      </li>
    )
  }
  return (
    <div>
	    <div className="token-select">
	        <div className="token-select-header">
	            <input value="LRC/ETH" /><i className="icon-star icon-favorites active"></i>
	        </div>
	        <div className="token-select-body" style={{height: "400px"}}>
	            <div className="content-scroll">
	                {
                    recentTickers.lenth >0 &&
                    <div className="item">
                        <div className="title">Recent</div>
                        <ul>
                            {recentTickers.map((item,index)=><TickItem item={item} />)}
                        </ul>
                    </div>
                  }
                  {
                    favoredTickers.lenth >0 &&
                    <div className="item">
                        <div className="title">Favorites</div>
                        <ul>
                            {favoredTickers.map((item,index)=><TickItem item={item} />)}
                        </ul>
                    </div>
                  }
	                <div className="item">
	                    <div className="title">All Markets</div>
	                    <ul>
                          {allTickers.map((item,index)=><TickItem item={item} />)}
	                    </ul>
	                </div>
	            </div>
	        </div>
	    </div>
    </div>
  )
}

export default connect(
  ({sockets:{loopringTickers}})=>({loopringTickers})
)(ListAllTickers)

