import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import PrivateRoute from '../components/PrivateRoute';
import PublicRoute from '../components/PublicRoute';
import routes from './routes';

const ContainerOutlet = () => (
  <Switch>
    {routes.map(({ isPrivate, ...routeProps }, index) =>
      isPrivate ? (
        <PrivateRoute key={index} {...routeProps} />
      ) : (
        <PublicRoute key={index} {...routeProps} />
      )
    )}
    <Redirect to="/" />
  </Switch>
);

export default ContainerOutlet;
