import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './Button.module.sass';
import {
  THEME_CLASS_NAMES as themeClassNames,
  TYPE_CLASS_NAMES as typeClassNames
} from './Button.constants';

const LinkButton = ({
  children,
  to,
  className,
  block,
  theme,
  type,
  ...rest
}) => (
  <Link
    to={to}
    className={cx(
      className,
      styles[themeClassNames[theme]],
      styles[typeClassNames[type]],
      styles.linkBtn,
      styles.btn,
      { [styles.btnBlock]: block }
    )}
    {...rest}
  >
    {children}
  </Link>
);

LinkButton.propTypes = {
  to: PropTypes.string.isRequired,
  children: PropTypes.node,
  className: PropTypes.string,
  onClick: PropTypes.func,
  block: PropTypes.bool,
  type: PropTypes.oneOf(['sm']),
  theme: PropTypes.oneOf(['secondary'])
};

export default LinkButton;
