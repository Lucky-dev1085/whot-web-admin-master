import React from 'react';
import { Route, Redirect } from 'react-router-dom';

import { UserConsumer } from '../../contexts/UserContext';

const PublicRoute = ({ user, component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (!user ? <Component {...props} /> : <Redirect to="/" />)}
  />
);

export default UserConsumer(PublicRoute);
