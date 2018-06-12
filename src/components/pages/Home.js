import React from 'react';
import {Link} from 'dva/router';
import Layout from '../../layout';
import Footer from '../../layout/Footer';
import intl from 'react-intl-universal';
import {Input} from 'antd';


function Home(props) {
  return (
    <Layout.LayoutHome className="h-full">
	    <div className="body home">
	        <div className="home-content d-flex align-items-center justify-content-center">
	            <div>
	                <h1>Get Your Address</h1>
                  <div hidden className="ml10 mr10 mb25">
                    <Input className="d-block w-100" size="large" placeholder={intl.get('address.placeholder_tip')} />
                  </div>
	                <ul className="tab tab-card d-flex justify-content-center">
	                    <li className="item">
                          <Link to="/unlock/loopr"><i className="icon-qrcode"></i><h4>Loopr</h4></Link>
                      </li>
	                    <li className="item">
	                        <Link to="/unlock/metamask"><i className="icon-metamaskwallet"></i><h4>MetaMask</h4></Link>
	                    </li>
	                    <li className="item">
                          <Link to="/unlock/ledger"><i className="icon-ledgerwallet"></i><h4>Ledger</h4></Link>
                      </li>
                      <li className="item">
	                        <Link to=""><i className="icon-more"></i><h4>More Wallets</h4></Link>
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
