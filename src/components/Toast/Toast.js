import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './Toast.module.sass';
import CircleCloseIcon from '../../vectors/CircleCloseIcon';

import {
  TYPE_CLASS_NAMES as typeClassNames,
  TYPE_ICON as typeIcon
} from './Toast.constants';

const Toast = ({ message, close, type, duration }) => {
  useEffect(() => {
    if (!duration) {
      return;
    }

    const closeTimeout = setTimeout(close, duration);

    return () => {
      clearTimeout(closeTimeout);
    };
  }, [close, duration]);

  return (
    <div className={cx(styles.toast, styles[typeClassNames[type]])}>
      <span>{typeIcon[type]}</span>
      <div>{message}</div>
      <span className={styles.closeIcon} onClick={close}>
        <CircleCloseIcon />
      </span>
    </div>
  );
};

Toast.defaultProps = {
  duration: 10000,
  type: 'success'
};

Toast.propTypes = {
  message: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'logout', 'inactivity']),
  duration: PropTypes.number
};

export default Toast;
