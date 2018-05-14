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

function ListBlock(props) {
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
      <div className="token-list text-color-dark-1" style={{height: "100%",overflow: "hidden",paddingBottom: "211px"}}>
          <div className="content-scroll">
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-ETH icon-token"></i></div>
                      <div className="token-name">
                          <h3>ETH</h3>
                          <p>Ethereum</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>161.78</h3>
                          <p>$35678.94</p>
                      </div>
                      <div className="more token-action"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites active"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-WETH icon-token"></i></div>
                      <div className="token-name">
                          <h3>WETH</h3>
                          <p>Ethereum</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>199963.88</h3>
                          <p>$75385.32</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item active">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-LRC icon-token"></i></div>
                      <div className="token-name">
                          <h3>LRC</h3>
                          <p>Loopring</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>958264.16</h3>
                          <p>$35122.22</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-EOS icon-token"></i></div>
                      <div className="token-name">
                          <h3>EOS</h3>
                          <p>Loopring</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>2345</h3>
                          <p>$34542</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-AE icon-token"></i></div>
                      <div className="token-name">
                          <h3>AE</h3>
                          <p>Aeternity</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>120</h3>
                          <p>$78.12</p>
                      </div>
                      <div className="more token-action"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-USDT icon-token"></i></div>
                      <div className="token-name">
                          <h3>USDT</h3>
                          <p>USDT</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>199963.88</h3>
                          <p>$75385.32</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-VEN icon-token"></i></div>
                      <div className="token-name">
                          <h3>VEN</h3>
                          <p>VEN</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>958264.16</h3>
                          <p>$35122.22</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-EOS icon-token"></i></div>
                      <div className="token-name">
                          <h3>EOS</h3>
                          <p>Loopring</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>2345</h3>
                          <p>$34542</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-ETH icon-token"></i></div>
                      <div className="token-name">
                          <h3>ETH</h3>
                          <p>Ethereum</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>161.78</h3>
                          <p>$35678.94</p>
                      </div>
                      <div className="more token-action"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-WETH icon-token"></i></div>
                      <div className="token-name">
                          <h3>WETH</h3>
                          <p>Ethereum</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>199963.88</h3>
                          <p>$75385.32</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-LRC icon-token"></i></div>
                      <div className="token-name">
                          <h3>LRC</h3>
                          <p>Loopring</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>958264.16</h3>
                          <p>$35122.22</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
              <div className="item">
                  <div className="sub">
                      <div className="favorites"><i className="icon-star"></i></div>
                      <div className="icon"><i className="icon-EOS icon-token"></i></div>
                      <div className="token-name">
                          <h3>EOS</h3>
                          <p>Loopring</p>
                      </div>
                  </div>
                  <div className="sub">
                      <div className="value">
                          <h3>2345</h3>
                          <p>$34542</p>
                      </div>
                      <div className="more"><i className="icon-more"></i></div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  )
}

export default ListBlock
