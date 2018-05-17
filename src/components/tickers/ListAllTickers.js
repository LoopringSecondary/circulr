import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatter'


const TickItem = ({item})=>{
    const tickerFm = new TickerFm(item)
    const toggleFavored = (item)=>{
      // TODO
    }
    return (
      <li>
        <span>
          <i className="icon-star icon-favorites" onClick={toggleFavored.bind(this,item)} />
        </span>
        <span className="">{item.market}</span>
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

function ListAllTickers(props) {
  const {loopringTickers:list,dispatch} = props
  const tickersFm = new TickersFm(list)
  const allTickers = tickersFm.getAllTickers()
  const favoredTickers = tickersFm.getFavoredTickers()
  const recentTickers = tickersFm.getRecentTickers()
  const search = (e)=>{
    dispatch({
      type:'sockets/extraChange',
      payload:{
        id:'loopringTickers',
        extra:{
          keywords:e.target.value
        }
      }
    })
  }
  const toggleFavored = (item)=>{
    dispatch({
      type:'sockets/filtersChange',
      payload:{
        id:'loopringTickers',
        // id:'MyFills',
        // filters:{
        //   keywords:e.target.value
        // }
      }
    })
  }

  return (
    <div>
	    <div className="token-select">
	        <div className="token-select-header">
              <span>LRC-WETH</span>
	            <input value={list.extra.keywords && list.extra.keywords.toUpperCase()} onChange={search} />
              <i className="icon-search" />
              <i hidden className="icon-star icon-favorites active" />
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
                          {allTickers.map((item,index)=><TickItem key={index} item={item} />)}
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

