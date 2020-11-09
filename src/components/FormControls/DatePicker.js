import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import DateSelect from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import styles from './FormControl.module.sass';
import DateInput from './DateInput';

const DatePicker = ({
  selected,
  name,
  onChange,
  dateFormat,
  timeSelect,
  required,
  placeholder,
  className,
  label,
  disabled,
  withIcon,
  ...datePickerProps
}) => {
  const [touched, setTouched] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);
  const isValid = !required || (required && selected);
  const inputError = touched && !isValid;

  const onInputChange = value => {
    const isValidInput = !required || (required && value);
    onChange(name, value, isValidInput);
  };

  const onInputFocus = () => {
    setInputFocused(true);
  };

  const onInputBlur = () => {
    setInputFocused(false);
    !touched && setTouched(true);
  };

  const timeProps = timeSelect
    ? {
        showTimeSelect: true,
        showTimeSelectOnly: true,
        timeIntervals: 15,
        dateFormat: 'h:mm aa'
      }
    : {};

  return (
    <>
      <div
        className={cx(styles.formGroup, styles.datePicker, className, {
          [styles.dateError]: inputError,
          [styles.isDisabled]: disabled
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
        <DateSelect
          selected={selected}
          onChange={onInputChange}
          customInput={<DateInput withIcon={withIcon} />}
          dateFormat={dateFormat}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          placeholderText={placeholder}
          {...timeProps}
          {...datePickerProps}
        />
      </div>
    </>
  );
};

DatePicker.propTypes = {
  selected: PropTypes.object,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  dateFormat: PropTypes.string,
  timeSelect: PropTypes.bool,
  className: PropTypes.string,
  placeholder: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  withIcon: PropTypes.bool
};

DatePicker.defaultProps = {
  dateFormat: 'dd MMM, yyyy'
};

export default DatePicker;
