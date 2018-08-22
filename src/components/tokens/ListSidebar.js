import React from 'react'
import {Input,Icon,Tooltip,Spin,Popover,Button} from 'antd'
import {connect} from 'dva'
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal'
import TokensFm from 'modules/tokens/TokensFm'
import config from 'common/config'
import {Currency} from 'modules/containers'
import {FormatAmount} from 'modules/formatter/FormatNumber'
import routeActions from 'common/utils/routeActions'
import {toFixed, getDisplaySymbol} from 'LoopringJS/common/formatter'

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
                          <TokenActions item={item} actions={actions}/>
                      </div>
                  </div>
                )
              }
          </div>
      </div>
    </div>
  )
}

class TokenActions extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {item,actions} = this.props
    const btns = (
      <div style={{width:'180px'}}>
        <Button onClick={actions.gotoTransfer.bind(this,item)} className="d-block w-100 text-left mb5">{intl.get('token.action_types.send',{token:item.symbol})}</Button>
        <Button onClick={actions.gotoReceive.bind(this,{symbol:item.symbol})} className="d-block w-100 text-left mb5">{intl.get('token.action_types.receive',{token:item.symbol})}</Button>
        {
          item.symbol === 'WETH' &&
          <Button onClick={actions.gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">{intl.get('token.action_types.convert',{token:"ETH"})}</Button>
        }
        {
          item.symbol === 'ETH' &&
          <Button onClick={actions.gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">{intl.get('token.action_types.convert',{token:"WETH"})}</Button>
        }
        {false && <Button onClick={actions.gotoTrade.bind(this,item)} className="d-block w-100 text-left">{intl.get('token.action_types.trade',{token:item.symbol})}</Button>}
      </div>
    )
    return (
      <div className="more token-action" onClick={e=>{ e.stopPropagation();e.preventDefault()}}>
        <Popover
          title={null}
          placement="right"
          arrowPointAtCenter
          content={btns}
        >
          <i className="icon-more"></i>
        </Popover>
      </div>
    );
  }
}

export default connect(({sockets:{marketcap,balance}})=>({marketcap,balance}))(ListTokensSidebar)