import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { pillText } from './PillText.module.sass';

const PillText = ({ className, children }) => (
  <span className={cx(pillText, className)}>{children}</span>
);

PillText.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

export default PillText;
