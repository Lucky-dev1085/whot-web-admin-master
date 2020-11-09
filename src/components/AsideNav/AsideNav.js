import React from 'react';
import PropTypes from 'prop-types';
import { Link, NavLink } from 'react-router-dom';

import { UserConsumer } from '../../contexts/UserContext';
import {
  aside,
  appLogo,
  sideMenu,
  menuItem,
  activeMenuItem,
  logoutMenu
} from './AsideNav.module.sass';
import Logo from '../../vectors/Logo';
import ExitIcon from '../../vectors/ExitIcon';

const AsideNav = ({ routes, logout }) => (
  <aside className={aside}>
    <div className={appLogo}>
      <Link to="/">
        <Logo />
      </Link>
    </div>
    <ul className={sideMenu}>
      {routes.map(({ path, label, icon }, index) => (
        <li key={index}>
          <NavLink
            to={path}
            className={menuItem}
            activeClassName={activeMenuItem}
          >
            {icon} {label}
          </NavLink>
        </li>
      ))}
      <li className={logoutMenu}>
        <span onClick={logout}>
          <ExitIcon /> Logout
        </span>
      </li>
    </ul>
  </aside>
);

AsideNav.propTypes = {
  routes: PropTypes.array.isRequired
};

export default UserConsumer(AsideNav);
