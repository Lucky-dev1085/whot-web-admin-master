import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';

import ContainerOutlet from './ContainerOutlet';

const AppLayout = () => (
  <Router>
    <Switch>
      <Route path="/" component={ContainerOutlet} />
      <Redirect to="/home" />
    </Switch>
  </Router>
);

export default AppLayout;
