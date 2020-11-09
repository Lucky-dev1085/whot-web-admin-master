import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import TextInput from './TextInput';
import { isValidUsername } from '../../utils';
import { baseURL } from '../../utils/requests';

const UsernameInput = ({
  username,
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

  const patternError = "Special characters aren't allowed";
  const takenError = 'This username is already taken!';
  const error = taken ? takenError : patternError;
  const errorTip = value && error;

  const onInputChange = (name, value) => {
    value !== searched && setTaken(false);
    onChange(name, value, false);
  };

  const onInputBlur = inputValid => {
    onBlur && onBlur();

    if (!value || !inputValid || value === username) {
      onChange(name, value, inputValid);
      return;
    }

    setLoading(true);
    setSearched(value);

    axios
      .get(`${baseURL}player-available?name=${value}`)
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
      validator={isValidUsername}
      disabled={loading}
      errorTip={errorTip}
      {...rest}
    />
  );
};

UsernameInput.propTypes = {
  username: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool
};

export default UsernameInput;
