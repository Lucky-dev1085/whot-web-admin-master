import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';

import TextInput from './TextInput';
import { baseURL } from '../../utils/requests';
import { isValidPromoCode } from '../../utils';

const PromoCodeInput = ({ name, value, onChange, onBlur, ...rest }) => {
  const [loading, setLoading] = useState(false);
  const [invalidSerial, setInvalidSerial] = useState(false);
  const [searched, setSearched] = useState();

  if (invalidSerial) {
    rest.pattern = '%%';
  }

  const serialError = 'Invalid promo code';
  const errorTip = value && serialError;

  const onInputChange = (name, value) => {
    value !== searched && setInvalidSerial(false);
    onChange(name, value, false);
  };

  const onInputBlur = inputValid => {
    onBlur && onBlur();

    if (!value || !inputValid) {
      onChange(name, value, inputValid);
      return;
    }

    setLoading(true);
    setSearched(value);

    axios
      .get(`${baseURL}player-available?serial=${value}`)
      .then(({ data }) => {
        const { exists, expired } = data;
        const invalidSerial = !exists || expired;
        setLoading(false);
        setInvalidSerial(invalidSerial);
        onChange(name, value, !invalidSerial);
      })
      .catch(error => {
        setLoading(false);
      });
  };

  return (
    <TextInput
      type="tel"
      name={name}
      value={value}
      onChange={onInputChange}
      onBlur={onInputBlur}
      validator={isValidPromoCode}
      disabled={loading}
      errorTip={errorTip}
      maxLength={8}
      {...rest}
    />
  );
};

PromoCodeInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  hideIcon: PropTypes.bool,
  required: PropTypes.bool
};

export default PromoCodeInput;
