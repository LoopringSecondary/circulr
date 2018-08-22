import React from 'react'
import {connect} from 'dva'
import {TickersFm,TickerFm} from 'modules/tickers/formatters'
import routeActions from 'common/utils/routeActions'
import storage from '../../modules/storage'
import intl from 'react-intl-universal'
import Search from '../../../node_modules/antd/lib/input/Search';

const TickItem = ({item,actions})=>{
    if(!item){ return null }
    const tickerFm = new TickerFm(item)
    return (
      <li onClick={actions.selectTicker.bind(this,item)}>
        <span>
          <i className="icon-star icon-favorites" onClick={(e) => actions.toggleTickerFavored(e,item)} />
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
          keywords:e.target.value ,
        }
      }
    })
  }
  const toggleTickerFavored = (e,item)=>{
    e.stopPropagation();
    dispatch({
      type:'sockets/extraChange',
      payload:{
        id:'loopringTickers',
        extra:{
          favored:{...favored,[item.market]:!favored[item.market]},
        }
      }
    })
  }
  const selectTicker= (item)=>{
    routeActions.gotoPath(`/trade/${item.market}`)
    storage.markets.setRecent(item.market)
  }
  const actions = {
    selectTicker,
    toggleTickerFavored
  }
  return (
    <div>
	    <div className="token-select">
	        <div className="token-select-header" style={{backgroundColor:"#101C27"}}>
              <input placeholder = {"Search.."} style={{backgroundColor:"#101C27", color:"white"}} value={keywords && keywords.toUpperCase()} onChange={searchTicker} />
              <i className="icon-search" style={{color:"white"}}/>
              <i hidden className="icon-star icon-favorites active" />
	        </div>
	        <div className="token-select-body" style={{height: "655px"}}>
	            <div className="content-scroll">
	                {
	                  recentTickers.length >0 && !keywords &&
                    <div className="item">
                        <div className="title">{intl.get('ticker_list.title_recent')}</div>
                        <ul>{recentTickers.map((item,index)=><TickItem item={item} actions={actions} />)}</ul>
                    </div>
                  }
                  {
                    favoredTickers.length >0 &&
                    <div className="item">
                        <div className="title">{intl.get('ticker_list.title_favorites')}</div>
                        <ul>{favoredTickers.map((item,index)=><TickItem item={item} actions={actions} />)}</ul>
                    </div>
                  }
	                <div className="item">
	                    <div className="title">{intl.get('common.all')} {intl.get('common.markets')}</div>
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

