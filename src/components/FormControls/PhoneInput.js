import React from 'react';
import PropTypes from 'prop-types';

import TextInput from './TextInput';

const PhoneInput = props => {
  const withCountryCode = props.value.substring(0, 4) === '+234';
  const withoutCountryCode = props.value.substring(0, 1) === '0';
  let errorTip = ' Phone number must begin with 0 or +234';

  if (withCountryCode) {
    errorTip = 'Phone number must be 14 numbers';
  } else if (withoutCountryCode) {
    errorTip = 'Phone number must be 11 numbers';
  }

  return <TextInput type="tel" errorTip={errorTip} {...props} />;
};

PhoneInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};

export default PhoneInput;
