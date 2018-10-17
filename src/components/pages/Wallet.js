import React from 'react';
import Tokens from '../tokens'
import Transactions from '../transactions'
import Charts from '../charts'
import Tickers from '../tickers'
import {Containers} from 'modules'
import {Tooltip} from 'antd'
import {connect} from 'dva'

export const AccountMenu = (props)=>{
  const {wallet} = props
  let walletAdress = wallet.address;  
  let firstHalf = walletAdress.slice(0, walletAdress.length / 6);
  let otherHalf = walletAdress.slice(walletAdress.length / 2, walletAdress.length)
  let truncateAddress = firstHalf + '....' + otherHalf;

  const showUserCenter = ()=>{
    props.dispatch({
      type:'layers/showLayer',
      payload:{id:'userCenter'}
    })
  }
  return (
    <div className="account-bar">
      <ul>
        <li onClick={showUserCenter}>
          <div className="logo">
            {wallet && wallet.unlockType === 'address' && <Tooltip title={'Watch Only Wallet'}><img src={require('../../assets/images/walletdex.png')} className="img" /> </Tooltip>}
            {wallet && wallet.unlockType === 'metamask' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-metamaskwallet" /> </Tooltip>}
            {wallet && wallet.unlockType === 'ledger' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-ledgerwallet" /> </Tooltip>}
            {wallet && wallet.unlockType === 'trezor' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-trezorwallet" /> </Tooltip>}
            {wallet && wallet.unlockType === 'keystore' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-json" /> </Tooltip>}
            {wallet && wallet.unlockType === 'mnemonic' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-mnemonic" /> </Tooltip>}
            {wallet && wallet.unlockType === 'privateKey' && <Tooltip title={wallet.unlockType + 'Wallet'}><i className="icon-key" /> </Tooltip>}
          </div>
          <div className="account-address">{wallet && truncateAddress}</div>
        </li>
        <li onClick={showUserCenter} style={{marginLeft:"10px"}}>
          <img className="profileimg" src={require('../../assets/images/profile.png')} />
        </li>
      </ul>
    </div>
  )
}

function Wallet(props) {
 const {token} = props;
  return (
    <div>
        <header id="header">
            <div className="bg text-color-dark-1 w-control d-flex justify-content-between align-items-center">
              <div className="loopring-brand"><img src={require('../../assets/images/logo.png')} className="img" /></div>
                <h2>{token.toUpperCase()}</h2>
              <Containers.Wallet>
                <AccountMenu />
              </Containers.Wallet>

            </div>
        </header>
        <div style={{display:"inline-block", width:"100%"}}>
            <div className="m-container h-full" style={{position:"fixed", marginLeft: "17%", marginRight: "978px", width:"24%", top:"10px"}} id="transactions">
                <div className="card dark h-full" style={{borderRadius:"5px"}}>
                    <Transactions.ListDefault />
                </div>
            </div>
            <div className="m-container h-fulld" style={{position:"fixed", top:"0",right: "34%",width: "24%",paddingTop:"94px"}} id="sideMarkets">
                <div className="card dark h-full" style={{borderRadius:"5px"}}>
                    <Charts.PriceChart />
                    <Tickers.ListTokenTickers />
                </div>
            </div>
            <div className="m-container h-full" style={{position:"fixed", top:"70px",left: "67%",width: "16%",padding: "20px 0", borderRadius:"5px"}} id="tokenSide">
                <div className="card dark h-full" style={{borderRadius:"5px"}}>
                  <Containers.Tokens>
                      <Containers.Settings>
                        <Tokens.ListSidebar />
                      </Containers.Settings>
                  </Containers.Tokens>
                </div>
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
