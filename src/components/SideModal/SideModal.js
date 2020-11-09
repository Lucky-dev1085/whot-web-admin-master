import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { sideModal, backdrop, content } from './SideModal.module.sass';

const SideModal = ({ className, children, close }) => (
  <div className={cx(className, sideModal)}>
    <div className={backdrop} onClick={close} />
    <div className={content}>{children}</div>
  </div>
);

SideModal.propTypes = {
  children: PropTypes.node.isRequired,
  close: PropTypes.func,
  className: PropTypes.string
};

export default SideModal;
