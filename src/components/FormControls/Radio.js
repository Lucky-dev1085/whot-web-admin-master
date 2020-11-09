import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

class Radio extends Component {
  onChange = ({ target }) => {
    const { validity } = target;
    const { valid } = validity;
    const { name, onChange, value } = this.props;
    onChange(name, value, valid);
  };

  render() {
    const {
      value,
      inputValue,
      children,
      className,
      onChange,
      ...inputProps
    } = this.props;

    return (
      <label className={cx('radio-input', className)}>
        <input
          {...inputProps}
          value={value}
          type="radio"
          onChange={this.onChange}
          checked={value === inputValue}
        />
        <span className="radio-indicator" />
        <div className="radio-content">{children}</div>
      </label>
    );
  }
}

Radio.propTypes = {
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default Radio;
