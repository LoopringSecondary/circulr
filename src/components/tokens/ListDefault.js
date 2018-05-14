import React from 'react'

function ListHeaderForm({className=''}){
  return (
    <div className={className}>
    	ListHeaderForm
    </div>
  )
}

function ListHeader({className=''}){
  return (
    <div className={className}>
    	ListHeader
    </div>
  )
}

function ListTokensSidebar(props) {
  console.log('ListTokensSidebar props',props)
  const {tokens}= props
  return (
    <div>
    	<div className="token-total">
          <h3 className="text-success">$39,484,950</h3><small>Total Value</small>
      </div>
      <div className="tool-bar d-flex justify-content-between">
          <div className="favorites active"><i className="icon-star-o"></i></div>
          <div className="token-view"><i className="icon-eye-o"></i></div>
          <div className="search"><i className="icon-search"></i>
              <input id="icon" />
          </div>
      </div>
      <div className="token-list text-color-dark-1" style={{height: "100%",overflow: "auto",paddingBottom: "211px"}}>
          <div className="">
              {
                tokens.items.map((item,index)=>
                  <div className="item" key={index}>
                      <div className="sub">
                          <div className="favorites"><i className="icon-star"></i></div>
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
