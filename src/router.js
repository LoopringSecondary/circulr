import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import Routes from './components/routes';
import SocketProvider from 'modules/sockets/Provider';
function RouterConfig({ history }) {
  return (
    <SocketProvider>
      <Router history={history}>
        <Routes />
      </Router>
    </SocketProvider>
  )
}
export default RouterConfig;
