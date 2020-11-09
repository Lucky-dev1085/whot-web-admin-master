import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './FormControl.module.sass';
import { getInputValidity } from './utils';

class SelectInput extends Component {
  state = {
    valid: false,
    errors: {}
  };

  onChange = ({ target }) => {
    const { value } = target;
    const { name, onChange } = this.props;

    const isValid = getInputValidity(target).valid;
    onChange(name, value, isValid);
    this.setState({ isValid });
  };

  onBlur = ({ target }) => {
    if (!this.state.touched) {
      const isValid = getInputValidity(target).valid;
      this.setState({ isValid, touched: true });
    }

    this.setState({ inputFocused: false });
    this.props.onBlur && this.props.onBlur(getInputValidity(target).valid);
  };

  render() {
    const {
      label,
      inputTip,
      errorTip,
      className,
      validator,
      options,
      ...inputProps
    } = this.props;

    const { touched, inputFocused, isValid } = this.state;
    const inputError = touched && !isValid;
    const errorMsg = inputError && errorTip;

    return (
      <>
        <div
          className={cx(styles.formGroup, className, {
            [styles.isDisabled]: inputProps.disabled
          })}
        >
          {label && (
            <label
              className={cx(styles.label, {
                [styles.focusedLabel]: inputFocused,
                [styles.errorLabel]: inputError
              })}
            >
              {label}
            </label>
          )}
          <select
            {...inputProps}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={cx(styles.formControl, styles.select, {
              [styles.placeholderSelect]: !inputProps.value,
              [styles.inputError]: inputError
            })}
          >
            {options.map(({ value, label }, index) => (
              <option key={index} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {errorMsg && <div className={styles.errorTip}>{errorMsg}</div>}
        {inputTip && !errorMsg && (
          <div className={styles.inputTip}>{inputTip}</div>
        )}
      </>
    );
  }
}

SelectInput.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool
};

export default SelectInput;
