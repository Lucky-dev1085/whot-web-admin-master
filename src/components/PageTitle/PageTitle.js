import React from 'react';
import PropTypes from 'prop-types';

import { pageTitle } from './PageTitle.module.sass';

const PageTitle = ({ label }) => <h4 className={pageTitle}>{label}</h4>;

PageTitle.propTypes = {
  label: PropTypes.string.isRequired
};

export default PageTitle;
