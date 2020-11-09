import React, { forwardRef } from 'react';
import cx from 'classnames';

import {
  formControl,
  datePlaceholder,
  dateWithIcon
} from './FormControl.module.sass';
import CalendarIcon from '../../vectors/CalendarIcon';

const DateInput = (
  { value, onClick, onFocus, onBlur, placeholder, withIcon },
  ref
) => (
  <div
    ref={ref}
    tabIndex="0"
    className={cx(formControl, { [dateWithIcon]: withIcon })}
    onClick={onClick}
    onFocus={onFocus}
    onBlur={onBlur}
  >
    {withIcon && <CalendarIcon />}
    {!value && <span className={datePlaceholder}>{placeholder}</span>}
    {value}
  </div>
);

export default forwardRef(DateInput);
