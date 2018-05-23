import React from 'react'
import {Input,Icon,Tooltip,Spin,Popover,Button} from 'antd'
import Notification from 'LoopringUI/components/Notification'
import intl from 'react-intl-universal'
import TokensFm from 'modules/tokens/TokensFm'
import config from 'common/config'
import {Currency} from 'modules/containers'

function ListTokensSidebar(props) {
  console.log('ListTokensSidebar component render',props)
  const {tokens,balance,marketcap,dispatch}= props
  const tokensFm = new TokensFm({tokens,marketcap,balance})
  const formatedTokens = tokensFm.getList()
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
    updateTransations(item.symbol)
  }
  const updateTransations = (token) => {
    dispatch({
      type: 'sockets/filtersChange',
      payload: {
        id:'transaction',
        filters: {token}
      }
    })
  }
  const gotoTransfer = (item, e) => {
    dispatch({
      type: 'modals/showModal',
      payload: {
        id:'transferToken',
        item,
      }
    })
  }
  const gotoReceive = (item, e) => {
    dispatch({
      type: 'modals/showModal',
      payload: {
        id:'receiveToken',
        ...item,
      }
    })
  };
  const gotoConvert = (item) => {
    dispatch({
      type: 'modals/showModal',
      payload: {
        id:'convertToken',
        item,
        showFrozenAmount: false,
      }
    })
  }
  const gotoTrade = (item) => {
    const foundMarket = config.getTokenSupportedMarket(item.symbol)
    if (foundMarket) {
      window.routeActions.gotoPath('/trade/' + foundMarket)
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

  return (
    <div>
    	<div className="token-total">
          <h3 className="text-success">$39,484,950</h3><small>Total Value</small>
      </div>
      <div className="tool-bar d-flex justify-content-between">
        <div className="search">
            <Input
              placeholder=""
              suffix={<Icon type="search" className="text-mute"/>}
              prefix={
                <div className="row gutter-0 align-items-center">
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
                        <i className="icon-eye" onClick={toggleSmallBalance.bind(this)} />
                      }
                      {
                        !filters.ifHideSmallBalance &&
                        <i className="icon-eye-o" onClick={toggleSmallBalance.bind(this)} />
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
                          <div hidden className="favorites"><i className="icon-star"></i></div>
                          <div className="icon"><i className={`icon-${item.symbol} icon-token`}></i></div>
                          <div className="token-name">
                              <h3>{item.symbol}</h3>
                              <p>{item.name}</p>
                          </div>
                      </div>
                      <div className="sub">
                          <Spin size="small" spinning={balance.loading} >
                            <div className="value" hidden={balance.loading}>
                              <h3>{item.balance.toString()}</h3>
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
        <Button onClick={actions.gotoTransfer.bind(this,item)} className="d-block w-100 text-left mb5">Send {item.symbol}</Button>
        <Button onClick={actions.gotoReceive.bind(this,{symbol:item.symbol})} className="d-block w-100 text-left mb5">Receive {item.symbol}</Button>
        {
          item.symbol === 'WETH' &&
          <Button onClick={actions.gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">Convert WETH To ETH</Button>
        }
        {
          item.symbol === 'ETH' &&
          <Button onClick={actions.gotoConvert.bind(this,item)} className="d-block w-100 text-left mb5">Convert ETH To WETH</Button>
        }
        <Button onClick={actions.gotoTrade.bind(this,item)} className="d-block w-100 text-left">Trade {item.symbol}</Button>
      </div>
    )
    return (
      <div className="more token-action" onClick={e=>{ e.stopPropagation();e.preventDefault()}}>
        <Popover
          title={<div className="pt5 pb5 fs18">{item.symbol} {intl.get('tokens.options')}</div>}
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

export default ListTokensSidebar
