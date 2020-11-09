import React from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';

import {
  userCard,
  userSummary,
  userCardUserDetails,
  editLink,
  transactionsSummary,
  bankAccounts,
  activeBank,
  actionDates
} from './Users.module.sass';
import CircleUserIcon from '../../vectors/CircleUserIcon';
import CircleMoneyBag from '../../vectors/CircleMoneyBag';
import CircleEdit from '../../vectors/CircleEdit';

const UserCard = ({ user, name, mobile, createdAt, editUser }) => (
  <div className={userCard}>
    <div className={userSummary}>
      <div>
        <CircleUserIcon />
        <div>
          <h3>{name}</h3>
          <span className={userCardUserDetails}>
            <span>{mobile}</span> <i /> <span>{user && user.email}</span>
          </span>
        </div>
      </div>
      <span onClick={editUser} className={editLink}>
        <CircleEdit />
      </span>
    </div>
    <div>
      <CircleMoneyBag />
      <div>
        <h3>₦13,230</h3>
      </div>
      <div className={transactionsSummary}>
        <span>DEPOSIT POT</span>
        <h4>₦6,230</h4>
      </div>
      <div className={transactionsSummary}>
        <span>WITHDRAWALS</span>
        <h4>₦7,000</h4>
      </div>
    </div>
    <div className={bankAccounts}>
      <span>BANK ACCOUNTS</span>
      <div>
        <span className={activeBank}>Fidelity Bank</span>
        <span>Citibank</span>
        <span>Diamond Bank</span>
      </div>
    </div>
    <div className={actionDates}>
      <div>
        <span>ADDED ON</span>
        <time dateTime={createdAt}>
          {moment(createdAt).format('DD MMM YYYY')}
        </time>
      </div>
      <div>
        <span>LAST TRANSACTION</span>
        <time dateTime={createdAt}>12 July 2019; 12:00PM</time>
      </div>
    </div>
  </div>
);

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  mobile: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired,
  editUser: PropTypes.func.isRequired
};

export default UserCard;
