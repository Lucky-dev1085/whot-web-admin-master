import React from 'react';
import PropTypes from 'prop-types';

import NumberInput from './NumberInput';

const MoneyInput = props => (
  <div className="money-input">
    <NumberInput maxLength={11} {...props} />
  </div>
);

MoneyInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  currencyData: PropTypes.object,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  validator: PropTypes.func,
  required: PropTypes.bool,
  validatorError: PropTypes.string,
  valueMissing: PropTypes.string
};

export default MoneyInput;
