import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import ComponentsRoutes from './components/routes';
function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <ComponentsRoutes />
    </Router>
  )
}
export default RouterConfig;
