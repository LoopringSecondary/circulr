import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'


const TickItem = ({item,actions})=>{
    const tickerFm = new TickerFm(item)
    return (
      <li onClick={actions.selectTicker.bind(this,item)}>
        <span>
          <i className="icon-star icon-favorites" onClick={actions.toggleTickerFavored.bind(this,item)} />
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
  console.log('ListAllTickers render',props)
  const {loopringTickers:list,dispatch} = props
  const tickersFm = new TickersFm(list)
  const {extra:{favored={},keywords}} = list
  const allTickers = tickersFm.getAllTickers()
  const favoredTickers = tickersFm.getFavoredTickers()
  const recentTickers = tickersFm.getRecentTickers()
  const searchTicker = (e)=>{
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
  const toggleTickerFavored = (item)=>{
    dispatch({
      type:'sockets/filtersChange',
      payload:{
        id:'loopringTickers',
        extra:{
          favored:{[item.symbol]:true}
        }
      }
    })
  }
  const selectTicker= (item)=>{
    console.log('selectTicker',item.market)
    dispatch({
      type:'sockets/filtersChange',
      payload:{
        id:'tickers',
        filters:{market:item.market}
      }
    })
    dispatch({
      type:'sockets/filtersChange',
      payload:{
        id:'depth',
        filters:{market:item.market}
      }
    })
    dispatch({
      type:'sockets/filtersChange',
      payload:{
        id:'trades',
        filters:{market:item.market}
      }
    })
  }
  const actions = {
    selectTicker,
    toggleTickerFavored
  }
  // TODO
  const currentMarket = list.filters.market || "LRC-WETH"

  return (
    <div>
	    <div className="token-select">
	        <div className="token-select-header">
              { keywords && <input value={keywords.toUpperCase()} onChange={searchTicker} /> }
              {!(keywords && keywords.length > 0) && <input value={currentMarket} onChange={searchTicker} /> }
              <i className="icon-search" />
              <i hidden className="icon-star icon-favorites active" />
	        </div>
	        <div className="token-select-body" style={{height: "400px"}}>
	            <div className="content-scroll">
	                {
                    recentTickers.lenth >0 &&
                    <div className="item">
                        <div className="title">Recent</div>
                        <ul>{recentTickers.map((item,index)=><TickItem item={item} actions={actions} />)}</ul>
                    </div>
                  }
                  {
                    favoredTickers.lenth >0 &&
                    <div className="item">
                        <div className="title">Favorites</div>
                        <ul>{favoredTickers.map((item,index)=><TickItem item={item} actions={actions} />)}</ul>
                    </div>
                  }
	                <div className="item">
	                    <div className="title">All Markets</div>
	                    <ul>{allTickers.map((item,index)=><TickItem key={index} item={item} actions={actions} />)}</ul>
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

