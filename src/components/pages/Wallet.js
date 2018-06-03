import React from 'react';
import Tokens from '../tokens'
import Transactions from '../transactions'
import Charts from '../charts'
import Tickers from '../tickers'
import {Containers} from 'modules'
import {Tooltip} from 'antd'
import {connect} from 'dva'

export const AccountMenu = (props)=>{
  const showUserCenter = ()=>{
    props.dispatch({
      type:'layers/showLayer',
      payload:{id:'userCenter'}
    })
  }
  return (
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
      </ul>
    </div>
  )
}

function Wallet(props) {
 const {token} = props;
  return (
    <div>
        <header id="header" style={{ position:"fixed",width:"100%",zIndex:"1000"}}>
            <div className="bg text-color-dark-1 w-control d-flex justify-content-between align-items-center">
                <h2>{token.toUpperCase()}</h2>
                <AccountMenu dispatch={props.dispatch} />
            </div>
        </header>
        <div className="side-fixed" style={{top:"0",left: "0",width: "280px",padding: "20px 0"}} id="tokenSide">
            <div className="loopring-brand"><img src={require('../../assets/images/logo.png')} className="img" /></div>
              <Containers.Tokens>
                  <Containers.Settings>
                    <Tokens.ListSidebar />
                  </Containers.Settings>
              </Containers.Tokens>
        </div>
        <div className="m-container h-full" style={{marginLeft: "280px", marginRight: "454px"}} id="transactions">
            <div className="card dark h-full">
                <Transactions.ListDefault />
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

function mapStateToProps(state) {

  return {
    token:state.tokens.selected
  }
}

export default connect(mapStateToProps)(Wallet)
