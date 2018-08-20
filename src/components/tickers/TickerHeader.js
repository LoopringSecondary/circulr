import React from 'react'
import {connect} from 'dva'
import {TickerFm} from 'modules/tickers/formatters'
import routeActions from 'common/utils/routeActions'
import intl from 'react-intl-universal'
import {Input,Icon,Tooltip,Spin,Popover,Button} from 'antd'
import TokensFm from 'modules/tokens/TokensFm'
import config from 'common/config'
import {toFixed, getDisplaySymbol} from 'LoopringJS/common/formatter'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import {Currency} from 'modules/containers'

function ListTokensSidebar(props) {
  console.log('ListTokensSidebar component render',props)
  const {tokens,balance,marketcap,settings,dispatch}= props
  const tokensFm = new TokensFm({tokens,marketcap,balance})
  const formatedTokens = tokensFm.getList()
  const totalWorth = tokensFm.getTotalWorth()
  const {filters,favored={},selected}= tokens
  const toggleMyFavorite = () => {
    tokens.filtersChange({
      filters: {
        ...filters,
        ifOnlyShowMyFavorite: !filters.ifOnlyShowMyFavorite
      }
    })
  }
  const toggleSmallBalance = () => {
    tokens.filtersChange({
      filters: {
        ...filters,
        ifHideSmallBalance: !filters.ifHideSmallBalance
      }
    })
  }
  const searchToken = (e) => {
    tokens.filtersChange({
      filters: {
        ...filters,
        keywords: e.target.value
      }
    })
  }
  const toggleTokenFavored = (item, e) => {
    e.stopPropagation()
    tokens.nodeChange({
      favored: {
        ...favored,
        [item.symbol]: !favored[item.symbol],
      }
    })
  }
  const selectToken = (item) => {
    tokens.nodeChange({
      selected: item.symbol
    })
    dispatch({
      type: 'sockets/tokenChange',
      payload: {
        token:item.symbol
      }
    })
    // dispatch({
    //   type: 'sockets/tickers',
    //   payload: {
    //     id:'latestTransaction',
    //     filters: {token:item.symbol}
    //     // tickers 只接受 market 不接受 token
    //   }
    // })
  }
  const gotoTransfer = (item, e) => {
    dispatch({
      type: 'layers/showLayer',
      payload: {
        id:'transferToken',
        item,
      }
    })
    dispatch({
      type: 'transfer/assignedtokenChange',
      payload: {
        assignedToken:item.symbol
      }
    })
  }
  const gotoReceive = (item, e) => {
    dispatch({
      type: 'layers/showLayer',
      payload: {
        id:'receiveToken',
        ...item,
      }
    })
  };
  const gotoConvert = (item) => {
    dispatch({
      type: 'layers/showLayer',
      payload: {
        id:'convertToken',
        token:item.symbol,
        showFrozenAmount: false,
      }
    })
  }
  const gotoTrade = (item) => {
    const foundMarket = config.getTokenSupportedMarket(item.symbol)
    if (foundMarket) {
      routeActions.gotoPath('/trade/' + foundMarket)
      return
    }
    Notification.open({
      type: 'warning',
      message: intl.get('trade.not_supported_token_to_trade_title', {token: item.symbol}),
      description: intl.get('trade.not_supported_token_to_trade_content')
    });
  }
  const actions = {
    gotoTransfer,
    gotoReceive,
    gotoConvert,
    gotoTrade,
  }

  const totalWorthDisplay = (
    <span className="">
        {totalWorth && totalWorth.gt(0) &&
        <span>{getDisplaySymbol(settings.preference.currency)}
          {toFixed(totalWorth, 2).toString(10)}
          </span>
        }
      {(!totalWorth || !totalWorth.gt(0)) &&
      <span>{getDisplaySymbol(settings.preference.currency)}0</span>
      }
      </span>
  )

  return (
    <div style={{marginTop:'5px', backgroundColor:"#101C27"}}>
    	<div className="token-total">
          <h3 className="text-success">{totalWorthDisplay}</h3><small>{intl.get('token.assets_title')}</small>
      </div>
      <div className="tool-bar d-flex justify-content-between">
        <div className="search">
            <Input
              placeholder=""
              suffix={<Icon type="search" className="text-mute"/>}
              prefix={
                <div className="row no-gutters align-items-center">
                  <div className="col"></div>
                  <div className="col-auto">
                    <Tooltip title={intl.get('tokens.only_show_favorites')}>
                      {
                        filters.ifOnlyShowMyFavorite &&
                        <i className="icon-star" onClick={toggleMyFavorite.bind(this)}></i>
                      }
                      {
                        !filters.ifOnlyShowMyFavorite &&
                        <i className="icon-star-o" onClick={toggleMyFavorite.bind(this)}></i>
                      }
                    </Tooltip>
                  </div>
                  <div className="col-auto">
                    <Tooltip title={intl.get('tokens.hide_small_balances')}>
                      {
                        filters.ifHideSmallBalance &&
                        <i className="icon-wallet" onClick={toggleSmallBalance.bind(this)} />
                      }
                      {
                        !filters.ifHideSmallBalance &&
                        <i className="icon-wallet" onClick={toggleSmallBalance.bind(this)} />
                      }
                    </Tooltip>
                  </div>
                </div>
              }
              className="d-block w-100"
              onChange={searchToken.bind(this)}
              value={filters.keywords}
              addonAfter={null}
            />
          </div>
      </div>
      <div className="token-list text-color-dark-1" style={{height: "100vh",paddingBottom: "211px"}}>
          <div style={{height: "100%",overflow: "auto",paddingBottom: "0"}}>
              {
                formatedTokens.map((item,index)=>
                  <div className={`item ${item.symbol===selected ? 'active' : ''}`} key={index} onClick={selectToken.bind(this,item)}>
                      <div className="sub">
                          <div hidden className="favorites"><i className="icon-star"/></div>
                            <div className="icon"><i className={`icon-${item.symbol} icon-token`}/></div>
                          <div className="token-name">
                              <h3>{item.symbol}</h3>
                              <p>{item.name}</p>
                          </div>
                      </div>
                      <div className="sub">
                          <Spin size="small" spinning={balance.loading} >
                            <div className="value" hidden={balance.loading}>
                              <h3><FormatAmount value={item.balance.toString()} precision={4} /></h3>
                              {item.balanceValue &&
                                <p><Currency/>{item.balanceValue.toString()}</p>
                              }
                            </div>
                          </Spin>
                        {/*}  <TokenActions item={item} actions={actions}/> */}
                      </div>
                  </div>
                )
              }
          </div>
      </div>
    </div>
  )
}

function TickerHeader(props) {
  console.log('TickerHeader render',props)
  const showAllTickers = ()=>{
    props.dispatch({
      type:"layers/showLayer",
      payload:{
        id:'ListAllTickers',
      }
    })
  }
  const gotoWallet = ()=>{
    routeActions.gotoPath('/wallet')
  }
  const priceSelected = (value, e) => {
    e.preventDefault()
    props.dispatch({type:'placeOrder/priceChange', payload:{priceInput:value}})
  }

  const looprTickerFm = new TickerFm(props.tickers.item.loopr || {})
  const tokens = looprTickerFm.getTokens()
  return (
    <div className="tradeHeaderEle justify-content-between align-items-center" style={{display: "flex"}}>
        <div id="back" onClick={gotoWallet}><i className="icon-chevron-left"></i></div>
        <div className="loopring-brand">
          <img src={require('../../assets/images/logo.png')} className="img" /> 
        </div>
        <div className="token-last-quotes">
            <ul className="d-flex justify-content-between align-items-center">
              <li><small>{intl.get('ticker.last')}</small><em><span className="text-up"><span className="cursor-pointer" onClick={priceSelected.bind(this, looprTickerFm.getLast())}> {looprTickerFm.getLast()} </span> {tokens.right}</span> <span hidden>$0.34</span></em></li>
                <li><small>{intl.get('ticker.change')}</small><em><span className="text-down">{looprTickerFm.getChange()}</span></em></li>
              <li><small>{intl.get('ticker.high')}</small><em><span className="cursor-pointer" onClick={priceSelected.bind(this, looprTickerFm.getHigh())}> {looprTickerFm.getHigh()} </span> {tokens.right}</em></li>
              <li><small>{intl.get('ticker.low')}</small><em><span className="cursor-pointer" onClick={priceSelected.bind(this, looprTickerFm.getLow())}> {looprTickerFm.getLow()} </span> {tokens.right}</em></li>
                <li><small>{intl.get('ticker.vol')}</small><em>{looprTickerFm.getVol()} {tokens.right}</em></li>
            </ul>
        </div>
        <div className="pair-select d-flex justify-content-between tokenselect" style={{marginTop:"120px", position:"absolute", width:"300px", height:"120px", backgroundColor:"#182C3E", padding:"10px", borderRadius:"5px", cursor:'pointer'}} onClick={showAllTickers}>
          <div style={{paddingBottom:'50px', marginLeft:'15px'}}>Market</div>
              <div className="marketSearch">
            {/*}   <div className="icon"><i className={`icon-${item.symbol} icon-token`}/></div> */}
              <i style={{backgroundColor:'#1C1917', borderRadius:"3px", position:'relative', left:'255px'}} className="icon-chevron-down" />
                {props.tickers.filters.market} <b className="caret"></b>
              </div>
          </div>
    </div>
  )
}
export default connect(
  ({sockets:{tickers}})=>({tickers})
)(TickerHeader)