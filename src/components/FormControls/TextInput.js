import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './FormControl.module.sass';
import { getInputValidity } from './utils';

class TextInput extends Component {
  state = {
    valid: false,
    errors: {}
  };

  onChange = ({ target }) => {
    const { value } = target;
    const { name, onChange } = this.props;

    const isValid = this.getValidity(target);
    onChange(name, value, isValid);
    this.setState({ isValid });
  };

  getValidity = target => {
    const { value } = target;
    const { valid } = getInputValidity(target);
    const { validator, required, pattern } = this.props;
    const patternMismatch =
      !required || !pattern ? false : !new RegExp(`^${pattern}$`).test(value);
    const validatorError = required
      ? validator && !validator(value)
      : value && validator && !validator(value);
    const isValid = valid && !validatorError && !patternMismatch;
    return isValid;
  };

  onBlur = ({ target }) => {
    if (!this.state.touched) {
      const isValid = this.getValidity(target);
      this.setState({ isValid, touched: true });
    }

    this.setState({ inputFocused: false });
    this.props.onBlur && this.props.onBlur(this.getValidity(target));
  };

  onFocus = () => {
    this.setState({ inputFocused: true });
    this.props.onFocus && this.props.onFocus();
  };

  componentDidUpdate(prevProps) {
    const { name, value, pattern, onChange } = this.props;
    let { errors } = this.state;

    if (prevProps.pattern !== pattern) {
      errors.patternMismatch = !pattern
        ? false
        : !new RegExp(`^${pattern}$`).test(value);
      const isValid = !Object.keys(errors).filter(key => errors[key]).length;

      onChange(name, value, isValid);
      this.setState({ isValid });
    }
  }

  render() {
    const {
      label,
      inputTip,
      errorTip,
      className,
      validator,
      name,
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
          <input
            {...inputProps}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            className={cx(styles.formControl, {
              [styles.inputError]: inputError
            })}
          />
        </div>
        {errorMsg && <div className={styles.errorTip}>{errorMsg}</div>}
        {inputTip && !errorMsg && (
          <div className={styles.inputTip}>{inputTip}</div>
        )}
      </>
    );
  }
}

TextInput.defaultProps = {
  type: 'text'
};

TextInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  type: PropTypes.string,
  label: PropTypes.string,
  inputTip: PropTypes.node,
  errorTip: PropTypes.node,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  minLength: PropTypes.number,
  maxLength: PropTypes.number,
  validator: PropTypes.func
};

export default TextInput;
