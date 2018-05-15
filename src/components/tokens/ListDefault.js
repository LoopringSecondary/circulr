import React from 'react'
import {Input,Icon,Tooltip} from 'antd'
import intl from 'react-intl-universal'
import TokensFm from 'modules/tokens/TokensFm'

function ListTokensSidebar(props) {
  console.log('ListTokensSidebar component render',props)
  const {tokens,balance,marketcap,dispatch}= props
  const tokensFm = new TokensFm({tokens,marketcap,balance})
  const formatedTokens = tokensFm.getList()
  const {filters,favored,selected}= tokens
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
  const toggleFavored = (item, e) => {
    e.stopPropagation()
    tokens.favoredChange({
      favored: {
        [item.symbol]: !favored[item.symbol], // TODO address
      }
    })
  }
  const toggleSelected = (item) => {
    let new_selected = {}
    for (let key in selected) {
      new_selected[key] = false
    }
    tokens.selectedChange({
      selected: {
        ...new_selected,
        [item.symbol]: true, // TODO address
      }
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

  return (
    <div>
    	<div className="token-total">
          <h3 className="text-success">$39,484,950</h3><small>Total Value</small>
      </div>
      <div className="tool-bar d-flex justify-content-between">
          {false &&
            <div>
              <div className="favorites"><i className="icon-star"></i></div>
              <div className="token-view"><i className="icon-eye-o"></i></div>
              <div className="search"><i className="icon-search"></i>
                  <input id="icon" />
              </div>
            </div>
          }
          <Input
            placeholder=""
            suffix={<Icon type="search" className="color-grey-600"/>}
            prefix={
              <div className="row gutter-0 align-items-center">
                <div className="col"></div>
                <div className="col-auto pr5">
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
                <div className="col-auto zb-b-l pl5">
                  <Tooltip title={intl.get('tokens.hide_small_balances')}>
                    {
                      filters.ifHideSmallBalance &&
                      <Icon onClick={toggleSmallBalance.bind(this)} className="fs18 color-primary-1 pointer"
                            style={{position: 'relative', marginTop: '2px'}}
                            type="eye"/>
                    }
                    {
                      !filters.ifHideSmallBalance &&
                      <Icon onClick={toggleSmallBalance.bind(this)} className="fs18 color-black-2 pointer"
                            style={{position: 'relative', marginTop: '2px'}}
                            type="eye-o"/>
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
      <div className="token-list text-color-dark-1" style={{height: "100%",overflow: "auto",paddingBottom: "211px"}}>
          <div className="">
              {
                formatedTokens.map((item,index)=>
                  <div className="item" key={index} onClick={()=>{}}>
                      <div className="sub">
                          <div hidden className="favorites"><i className="icon-star"></i></div>
                          <div className="icon"><i className={`icon-${item.symbol} icon-token`}></i></div>
                          <div className="token-name">
                              <h3>{item.symbol}</h3>
                              <p>{item.name}</p>
                          </div>
                      </div>
                      <div className="sub">
                          <div className="value">
                              <h3>{item.balance}</h3>
                              <p>$35678.94</p>
                          </div>
                          <div className="more token-action"><i className="icon-more"></i></div>
                      </div>
                  </div>
                )
              }
          </div>
      </div>
    </div>
  )
}

export default ListTokensSidebar
