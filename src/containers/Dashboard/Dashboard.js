import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import { UserConsumer } from '../../contexts/UserContext';
import ActivityWatch from '../../components/ActivityWatch';
import AsideNav from '../../components/AsideNav';
import Header from '../../components/Header';
import {
  DASHBOARD_ROUTES as routes,
  HEADER_MENUS as headerMenus
} from './Dashboard.constants';
import { dashboard, main } from './Dashboard.module.sass';

const Dashboard = ({ user, location }) => {
  const isSuperAdmin = user.permissions.includes('*');
  const permissionedRoutes = isSuperAdmin
    ? routes
    : routes.filter(({ permissions }) =>
        permissions.every(permission => user.permissions.includes(permission))
      );
  const { path: btnPath, label: btnLabel } =
    headerMenus[location.pathname] || {};

  return (
    <section className={dashboard}>
      <ActivityWatch />
      <AsideNav routes={permissionedRoutes} />
      <div>
        <Header btnPath={btnPath} btnLabel={btnLabel} />
        <main className={main}>
          <Switch>
            {permissionedRoutes.map(({ path, component }, index) => (
              <Route key={index} path={path} component={component} />
            ))}
            <Redirect to={permissionedRoutes[0].path} />
          </Switch>
        </main>
      </div>
    </section>
  );
};

export default UserConsumer(Dashboard);
