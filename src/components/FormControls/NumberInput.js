import React, { Component } from 'react';
import PropTypes from 'prop-types';

import TextInput from './TextInput';

class NumberInput extends Component {
  onChange = (name, value, isValid) => {
    const intValue = this.getIntValue(value);
    const inputValue = intValue ? Math.abs(intValue).toString() : '';
    this.props.onChange(name, inputValue, isValid);
  };

  getIntValue = value => {
    return parseInt(value.replace(/,/g, ''), 10);
  };

  validator = value => {
    const { validator } = this.props;
    const intValue = this.getIntValue(value);
    return Boolean(intValue) && (validator ? validator(intValue) : true);
  };

  render() {
    const { currencyData, onChange, ...rest } = this.props;

    return (
      <TextInput
        onChange={this.onChange}
        validator={this.validator}
        {...rest}
      />
    );
  }
}

NumberInput.defaultProps = {
  maxLength: 15
};

NumberInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  validator: PropTypes.func,
  required: PropTypes.bool,
  validatorError: PropTypes.string,
  valueMissing: PropTypes.string
};

export default NumberInput;
