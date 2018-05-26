import React from 'react';
import { Route, Switch,Redirect} from 'dva/router';
import Pages from './pages';
import Tokens from './tokens';
import Orders from './orders';
import Fills from './fills';
import Transactions from './transactions';
import Account from './account';
import Tickers from './tickers';
import Setting from './setting';
import Tools from './tools';

const UnLogged = ()=>{
  return (
    <div>UnLogged</div>
  )
}
const Logged = ()=>{
  return (
      <div>Logged</div>
  )
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
          <Switch>
            <Route path="/" exact component={Pages.Home} />
            <Route path="/home" exact component={Pages.Home} />
            <Route path="/wallet" exact component={Pages.Wallet} />
            <Route path="/trade" exact component={Pages.Trade} />
            <Route path="/trade/:market" exact component={Pages.Trade} />
            <Route path="/dev" exact component={Pages.Test} />
            <Route path="/transfer" exact component={Tokens.TransferForm} />
            <Route path="/placeOrder" exact component={Orders.PlaceOrderForm} />
            <Route path="/wallet/test" exact component={Pages.WalletTest} />
            <Route path="/usercenter" exact component={Account.UserCenter} />
            <Route path="/tickers" exact component={Tickers.ListAllTickers} />
            <Route path="/unlock" component={Pages.Unlock} />
            <Route path="/setting" exact component={Setting.Setting} />
            <Route path="/AirdropList" exact component={Tools.AirdropList} />
            <Route path="/Receive" exact component={Tokens.Receive} />
            <Route path="/ExportKeystore" exact component={Account.ExportKeystore} />
          </Switch>
          <Orders.Modals />
          <Fills.Modals />
          <Transactions.Modals />
          <Tokens.Modals />
          <Account.Modals />
          <Setting.Modals />
          <Tickers.Modals />
      </div>
    );
  }
}




