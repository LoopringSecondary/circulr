import React from 'react';
import {Link} from 'dva/router';
import Layout from '../../layout';
import Footer from '../../layout/Footer';
function Home(props) {
  return (
    <Layout.LayoutHome className="h-full">
	    <div className="body home">
	        <div className="home-content d-flex align-items-center justify-content-center">
	            <div>
	                <h1>Generate Wallet  &  Unlock Wallet</h1>
	                <ul className="tab tab-card d-flex justify-content-center">
	                    <li className="item">
	                        <Link to="/unlock/generatewallet" data-toggle="tab"><i className="icon-plus"></i><h4>Generate Wallet</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="/unlock/metamask" data-toggle="tab"><i className="icon-metamaskwallet"></i><h4>MetaMask</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="https://connect.trezor.io/4/popup/popup.html?v=1523254722813"><i className="icon-trezorwallet"></i><h4>Trezor</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="/unlock/ledger" data-toggle="tab"><i className="icon-ledgerwallet"></i><h4>Ledger</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="/unlock/json" data-toggle="tab"><i className="icon-json"></i><h4>JSON</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="/unlock/mnemonic" data-toggle="tab"><i className="icon-mnemonic"></i><h4>Mnemonic</h4></Link>
	                    </li>
	                    <li className="item">
	                        <Link to="/unlock/privateKey" data-toggle="tab"><i className="icon-key"></i><h4>Private Key</h4></Link>
	                    </li>
                      <li className="item">
                          <Link to="/unlock/address" data-toggle="tab"><i className="icon-key"></i><h4>Address</h4></Link>
                      </li>
	                    <li className="item remove" id="inupRemove">
	                        <Link to="/unlock"><i className="icon-remove"></i></Link>
	                    </li>
	                </ul>
	            </div>
	        </div>
	    </div>
	    <div className="overlay" data-overlay="54"></div>
	    <Footer />
    </Layout.LayoutHome>
  )
}
export default Home
