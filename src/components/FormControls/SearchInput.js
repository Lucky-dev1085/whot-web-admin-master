import React from 'react';
import PropTypes from 'prop-types';

import { searchInput } from './FormControl.module.sass';
import TextInput from './TextInput';
import SearchIcon from '../../vectors/SearchIcon';

const SearchInput = props => (
  <div className={searchInput}>
    <SearchIcon />
    <TextInput {...props} />
  </div>
);

SearchInput.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  validator: PropTypes.func,
  required: PropTypes.bool
};

export default SearchInput;
