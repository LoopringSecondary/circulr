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
import UnlockModals from './account/unlock/Modals'
import storage from 'modules/storage/'

const UnLogged = ()=>{
  const isLogged = !!storage.wallet.getUnlockedAddress()
  if(isLogged){
    return <Redirect to="/wallet" />
  }else{
    return (
      <Switch>
        <Route path="/unlock" component={Pages.Unlock} />
      </Switch>
    )
  }
}
const Logged = ()=>{
  const isLogged = !!storage.wallet.getUnlockedAddress()
  if(isLogged){
    return (
      <Switch>
        <Route path={`/wallet`} component={Pages.Wallet} />
        <Route path="/trade/:market" component={Pages.Trade} />
        <Route path="/trade" exact component={Pages.Trade} />
      </Switch>
    )
  }else{
    return <Redirect to="/unlock" />
  }
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <div>
          <Switch>
            <Route path="/unlock" component={UnLogged} />
            <Route path="/wallet" render={Logged} />
            <Route path="/trade" render={Logged} />
            <Route path="/dev" exact component={Pages.Test} />
            <Redirect form="/" to="/unlock"  />
            <Redirect form="/home" to="/unlock"  />
          </Switch>
          <Orders.Modals />
          <Fills.Modals />
          <Transactions.Modals />
          <Tokens.Modals />
          <Account.Modals />
          <Setting.Modals />
          <Tickers.Modals />
          <UnlockModals />
      </div>
    );
  }
}




