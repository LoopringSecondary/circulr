import React from 'react';
import { Route, Switch,Redirect} from 'dva/router';
import Pages from './pages';
import Tokens from './tokens';
import Orders from './orders';

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
            <Route path="/dev" exact component={Pages.Test} />
            <Route path="/transfer" exact component={Tokens.TransferForm} />
            <Route path="/placeOrder" exact component={Orders.PlaceOrderForm} />
          </Switch>
      </div>
    );
  }
}




