import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { card, cardHeader } from './Card.module.sass';

const Card = ({ title, className, children }) => (
  <div className={cx(card, className)}>
    <div className={cardHeader}>{title}</div>
    {children}
  </div>
);

Card.propTypes = {
  title: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string
};

export default Card;
