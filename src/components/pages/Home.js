import React from 'react';
import Layout from '../../layout';
import Footer from '../../layout/Footer';
function Home(props) {
  return (
    <div>
	    <div className="page body home">
	        <div className="home-content d-flex align-items-center justify-content-center">
	            <div>
	                <h1>Generate Wallet  &  Unlock Wallet</h1>
	                <ul className="tab tab-card d-flex justify-content-center">
	                    <li className="item">
	                        <a href="#generatewallet" data-toggle="tab"><i className="icon-plus"></i><h4>Generate Wallet</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="#metamask" data-toggle="tab"><i className="icon-metamaskwallet"></i><h4>MetaMask</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="https://connect.trezor.io/4/popup/popup.html?v=1523254722813"><i className="icon-trezorwallet"></i><h4>Trezor</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="#error" data-toggle="tab"><i className="icon-ledgerwallet"></i><h4>Ledger</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="#json" data-toggle="tab"><i className="icon-json"></i><h4>JSON</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="#mnemonic" data-toggle="tab"><i className="icon-mnemonic"></i><h4>Mnemonic</h4></a>
	                    </li>
	                    <li className="item">
	                        <a href="#privateKey" data-toggle="tab"><i className="icon-key"></i><h4>Private Key</h4></a>
	                    </li>
	                    <li className="item remove" id="inupRemove">
	                        <a href="#"><i className="icon-remove"></i></a>
	                    </li>
	                </ul>
	            </div>
	        </div>
	    </div>
	    <Footer />
    </div>
  )
}
export default Home
