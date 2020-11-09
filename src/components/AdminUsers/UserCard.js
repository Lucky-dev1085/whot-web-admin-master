import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import cx from 'classnames';

import {
  userCard,
  userCarduserName,
  userCardEmail,
  userCardRoleLabel,
  userCardRole,
  disabledRoleSelect
} from './AdminUsers.module.sass';
import { UserConsumer } from '../../contexts/UserContext';
import CircleUserIcon from '../../vectors/CircleUserIcon';
import CircleCogIcon from '../../vectors/CircleCogIcon';
import { SelectInput } from '../../components/FormControls';
import { ADMIN_ROLES as adminRoles } from '../../config';

const UserCard = ({ user, id, name, email, roles, createdAt, updateUser }) => {
  const roleValue = roles.length && roles[0].name;
  const [role, setRole] = useState(roleValue);
  const isLoggedInUser = user.id === id;

  const onRoleChange = (name, role) => {
    const userData = { roles: { set: [role] } };
    setRole(role);
    updateUser(id, userData);
  };

  return (
    <div className={userCard}>
      <div>
        <CircleUserIcon />
        <div>
          <h3 className={userCarduserName}>{name}</h3>
          <span className={userCardEmail}>{email}</span>
        </div>
      </div>
      <div>
        <CircleCogIcon />
        <div className={cx({ [disabledRoleSelect]: isLoggedInUser })}>
          <span className={userCardRoleLabel}>ROLE</span>
          <SelectInput
            className={userCardRole}
            options={adminRoles}
            name="role"
            value={role}
            onChange={onRoleChange}
            disabled={isLoggedInUser}
          />
        </div>
      </div>
      <div>
        <div>
          <span>JOINED ON</span>
          <time dateTime={createdAt}>
            {moment(createdAt).format('DD MMM YYYY')}
          </time>
        </div>
      </div>
    </div>
  );
};

UserCard.propTypes = {
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  email: PropTypes.string.isRequired,
  roles: PropTypes.array,
  createdAt: PropTypes.string
};

export default UserConsumer(UserCard);
