import React from 'react';
import Account from '../account';
import Layout from '../../layout';
import {Link, Redirect, Route, Switch} from 'dva/router'
import routeActions from 'common/utils/routeActions'
import { Containers } from 'modules'

class Unlock extends React.Component {

  changeTab = (path) => {
    const {match} = this.props;
    const {url} = match;
    console.log(Containers);
    routeActions.gotoPath(`${url}/${path}`);
  };

  render() {
    const {match} = this.props;
    const {url} = match;
    return (
      <Layout.LayoutHome className="h-full">
        <div className="body home">
          <div className="home-content d-flex align-items-center justify-content-center open">
            <div>
              <h1>Generate Wallet & Unlock Wallet</h1>
              <ul className="tab tab-card d-flex justify-content-center inup">
                <li className="item">
                  <a data-toggle="tab" onClick={() => this.changeTab('generateWallet')}><i className="icon-plus"/>
                    <h4>Generate
                      Wallet</h4></a>
                </li>
                <li className="item">
                  <a data-toggle="tab"><i className="icon-metamaskwallet"/><h4>MetaMask</h4></a>
                </li>
                <li className="item">
                  <a href="https://connect.trezor.io/4/popup/popup.html?v=1523254722813"><i
                    className="icon-trezorwallet"/><h4>Trezor</h4></a>
                </li>
                <li className="item">
                  <a href="#error" data-toggle="tab"><i className="icon-ledgerwallet"/><h4>Ledger</h4></a>
                </li>
                <li className="item">
                  <a data-toggle="tab" onClick={() => this.changeTab('json')}><i className="icon-json"/><h4>JSON</h4>
                  </a>
                </li>
                <li className="item">
                  <a data-toggle="tab" onClick={() => this.changeTab('mnemonic')}><i className="icon-mnemonic"/><h4>
                    Mnemonic</h4>
                  </a>
                </li>
                <li className="item">
                  <a data-toggle="tab" onClick={() => this.changeTab('privateKey')}><i className="icon-key"/><h4>
                    Private Key</h4>
                  </a>
                </li>
                <li className="item remove" id="inupRemove">
                  <a href="#"><i className="icon-remove"/></a>
                </li>
              </ul>
            </div>

            <Switch>
              <Route path={`${url}/generateWallet`} exact render={() =>
                <div className="tab-content">
                  <Containers.Wallet>
                  <Account.GenerateWallet/>
                  </Containers.Wallet>
                </div>}
              />
              <Route path={`${url}/json`} exact render={() =>
                <div className="tab-content">
                  <Containers.Keystore>
                   <Account.UnlockByKeystore/>
                  </Containers.Keystore>
                </div>}
              />
              <Route path={`${url}/mnemonic`} exact render={() =>
                <div className="tab-content">
                  <Account.UnlockByMnemonic/>
                </div>}
              />
              <Route path={`${url}/privateKey`} exact render={() =>
                <div className="tab-content">
                  <Containers.PrivateKey>
                  <Account.UnlockByPrivateKey/>
                  </Containers.PrivateKey>
                </div>}
              />
              <Route path={`${url}/backup`} exact render={() =>
                <div className="tab-content">
                  <Containers.Backup>
                  <Account.BackupWallet/>
                  </Containers.Backup>
                </div>}
              />
              <Redirect path={`${match.url}/`} to={`${match.url}/generateWallet`}/>
            </Switch>
          </div>
        </div>
        <div className="overlay" data-overlay="54"></div>
      </Layout.LayoutHome>)
  }
}

export default Unlock
