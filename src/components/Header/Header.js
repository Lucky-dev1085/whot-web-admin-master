import React from 'react';
import PropTypes from 'prop-types';

import { UserConsumer } from '../../contexts/UserContext';
import {
  header,
  headerBtn,
  userName,
  dropDownIndicator
} from './Header.module.sass';
import { LinkButton } from '../Button';

const Header = ({ user, btnPath, btnLabel }) => (
  <header className={header}>
    <div>
      {btnPath && btnLabel && (
        <LinkButton to={btnPath} type="sm" className={headerBtn}>
          {btnLabel}
        </LinkButton>
      )}
      <span className={userName}>{user.name}</span>
      <span className={dropDownIndicator} />
    </div>
  </header>
);

Header.propTypes = {
  btnPath: PropTypes.string,
  btnLabel: PropTypes.string
};

export default UserConsumer(Header);
