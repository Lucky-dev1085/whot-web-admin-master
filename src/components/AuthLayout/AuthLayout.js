import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { Link } from 'react-router-dom';

import { container } from './AuthLayout.module.sass';
import Logo from '../../vectors/Logo';

const AuthLayout = ({ children, className }) => (
  <section className={cx(container, className)}>
    <div>
      <header>
        <Link to="/">
          <Logo />
        </Link>
      </header>
      {children}
    </div>
  </section>
);

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default AuthLayout;
