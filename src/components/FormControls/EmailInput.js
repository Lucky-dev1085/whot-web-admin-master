import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import TextInput from './TextInput';
import { baseURL } from '../../utils/requests';
import { isValidEmail } from '../../utils';

const EmailInput = ({
  validateEmail,
  name,
  value,
  onChange,
  onBlur,
  ...rest
}) => {
  const [loading, setLoading] = useState(false);
  const [taken, setTaken] = useState(false);
  const [searched, setSearched] = useState();

  if (taken) {
    rest.pattern = '%%';
  }

  const patternError = 'Invalid email address';
  const takenError = 'This email is already taken!';
  const error = taken ? takenError : patternError;
  const errorTip = value && error;

  const onInputChange = (name, value, isValid) => {
    if (validateEmail) {
      value !== searched && setTaken(false);
      onChange(name, value, false);
    } else {
      onChange(name, value, isValid);
    }
  };

  const onInputBlur = inputValid => {
    onBlur && onBlur();

    if (!validateEmail) {
      return;
    }

    if (!value || !inputValid) {
      onChange(name, value, inputValid);
      return;
    }

    setLoading(true);
    setSearched(value);

    axios
      .get(`${baseURL}player-available?email=${value}`)
      .then(({ data }) => {
        const taken = !data.available;
        setLoading(false);
        setTaken(taken);
        onChange(name, value, !taken);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  return (
    <TextInput
      name={name}
      value={value}
      onChange={onInputChange}
      onBlur={onInputBlur}
      validator={isValidEmail}
      disabled={loading}
      errorTip={errorTip}
      {...rest}
    />
  );
};

EmailInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.bool,
  required: PropTypes.bool,
  validateEmail: PropTypes.bool
};

export default EmailInput;
