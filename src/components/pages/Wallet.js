import React from 'react';
import Tokens from '../tokens'
import Transactions from '../transactions'
import Charts from '../charts'
import Tickers from '../tickers'
import {Containers} from 'modules'
import {Tooltip} from 'antd'
import {connect} from 'dva'

function Wallet(props) {
  const showUserCenter = ()=>{
    props.dispatch({
      type:'layers/showLayer',
      payload:{id:'userCenter'}
    })
  }
  return (
    <div>
        <header id="header" style={{ position:"fixed",width:"100%",zIndex:"1000"}}>
            <div className="bg text-color-dark-1 w-control d-flex justify-content-between align-items-center">
                <h2>LRC<span>Ethereum</span></h2>
                <div className="account-bar">
                  <ul>
                  <li onMouseOver={showUserCenter}>
                    <div className="logo">
                      {window.WALLET && window.WALLET.unlockType === 'address' && <Tooltip title={'Watch Only Wallet'}><i className="icon-eye" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'metamask' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-metamaskwallet" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'ledger' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-ledgerwallet" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'trezor' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-trezorwallet" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'keystore' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-json" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'mnemonic' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-mnemonic" /> </Tooltip>}
                      {window.WALLET && window.WALLET.unlockType === 'privateKey' && <Tooltip title={window.WALLET.unlockType + 'Wallet'}><i className="icon-key" /> </Tooltip>}
                    </div>
                    <div className="account-address">{window.WALLET && window.WALLET.address}</div>
                  </li>
                  {false && <li><i className="icon-bell relative"><sup class="badge"></sup></i></li>}
                  {false && <li><span className="language"><a href="#"><i className="icon en"></i></a></span></li>}
                  {false && <li><i className="icon-menu"></i></li>}
                  </ul>
                </div>
            </div>
        </header>
        <div className="side-fixed" style={{top:"0",left: "0",width: "280px",padding: "20px 0"}} id="tokenSide">
            <div className="loopring-brand"><img src={require('../../assets/images/logo.png')} className="img" /></div>
              <Containers.Tokens>
                  <Containers.Sockets id="balance">
                    <Containers.Sockets id="marketcap">
                      <Tokens.ListSidebar />
                    </Containers.Sockets>
                  </Containers.Sockets>
              </Containers.Tokens>
        </div>
        <div className="m-container h-full" style={{marginLeft: "280px", marginRight: "454px"}} id="transactions">
            <div className="card dark h-full">
              <Containers.Sockets id="transaction">
                <Transactions.ListDefault />
              </Containers.Sockets>
            </div>
        </div>
        <div className="side-fixed" style={{top:"0",right: "0",width: "450px",paddingTop:"74px"}} id="sideMarkets">
            <div className="card dark h-full">
                <Charts.PriceChart />
                <Tickers.ListTokenTickers />
            </div>
        </div>
    </div>
  )
}
export default connect()(Wallet)
