import React from 'react';
import Tokens from '../tokens'
import Transactions from '../transactions'
import Charts from '../charts'
import Tickers from '../tickers'
import {Containers} from 'modules'

function Wallet(props) {
  return (
    <div>
        <header id="header" style={{ position:"fixed",width:"100%",zIndex:"1000"}}>
            <div className="bg text-color-dark-1 w-control d-flex justify-content-between align-items-center">
                <h2>LRC<span>Ethereum</span></h2>
                {/*<div className="account"><img src={require('../../assets/images/user.png')} className="photo" /><span className="msg"><i className="icon-bell"></i></span></div>*/}
                <div className="account-bar">
                  <ul>
                  <li><div className="logo"><img src={require('../../assets/images/logo-icon-inverse.png')} /></div><div className="account-address">0xeba7136a36da0f5e16c6bdbc739c716bb5b65a00</div></li>
                  <li><i className="icon-analysis"></i></li>
                  <li><i className="icon-pie"></i></li>
                  <li><i className="icon-bell relative"><sup className="badge"></sup></i></li>
                  <li><span className="language"><a href="#"><i className="icon en"></i></a></span></li>
                  <li><i className="icon-menu"></i></li>
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
export default Wallet
