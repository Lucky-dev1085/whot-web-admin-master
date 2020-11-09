import React from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';

const AdminLayout = ({ routes }) => (
  <Switch>
    {routes.map((routeProps, index) => (
      <Route key={index} exact {...routeProps} />
    ))}
    <Redirect to={routes[0].path} />
  </Switch>
);

AdminLayout.propTypes = {
  routes: PropTypes.array.isRequired
};

export default AdminLayout;
