import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import styles from './FormControl.module.sass';

class Checkbox extends Component {
  onChange = ({ target }) => {
    const { checked, validity } = target;
    const { valid } = validity;
    const { name, onChange, value } = this.props;
    onChange(name, checked, valid, value);
  };

  render() {
    const { children, className, onChange, ...inputProps } = this.props;

    return (
      <label className={classNames(styles.checkboxInput, className)}>
        <input {...inputProps} type="checkbox" onChange={this.onChange} />
        <span className={styles.checkboxIndicator} />
        <div className={styles.checkboxContent}>{children}</div>
      </label>
    );
  }
}

Checkbox.propTypes = {
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Checkbox;
