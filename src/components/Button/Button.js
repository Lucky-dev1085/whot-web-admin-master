import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import styles from './Button.module.sass';
import {
  THEME_CLASS_NAMES as themeClassNames,
  TYPE_CLASS_NAMES as typeClassNames
} from './Button.constants';

const Button = ({ children, className, block, theme, type, ...rest }) => (
  <button
    className={cx(
      className,
      styles[themeClassNames[theme]],
      styles[typeClassNames[type]],
      styles.btn,
      {
        [styles.btnBlock]: block
      }
    )}
    {...rest}
  >
    {children}
  </button>
);

Button.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  block: PropTypes.bool,
  type: PropTypes.oneOf(['sm']),
  theme: PropTypes.oneOf(['secondary'])
};

export default Button;
