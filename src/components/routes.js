import React from 'react';
import { Route, Switch,Redirect} from 'dva/router';
import Fills from './fills';
const UnLogged = ()=>{
  return <div>UnLogged</div>
}
const Logged = ()=>{
  return <div>Logged</div>
}

export default class Routes extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
          <Switch>
            <Route path="/" exact component={UnLogged} />
            <Route path="/home" exact component={UnLogged} />
            <Route path="/wallet" render={Logged} />
            <Route path="/trade" render={Logged} />
          </Switch>
      </div>
    );
  }
}




