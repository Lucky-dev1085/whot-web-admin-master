import React from 'react';
import WarningIcon from '../../vectors/WarningIcon';
import SuccessIcon from '../../vectors/SuccessIcon';
import LockPadlockIcon from '../../vectors/LockPadlockIcon';
import UnlockPadlock from '../../vectors/UnlockPadlock';

export const TYPE_CLASS_NAMES = {
  success: 'successToast',
  error: 'errorToast',
  inactivity: 'logoutToast',
  logout: 'logoutToast'
};

export const TYPE_ICON = {
  success: <SuccessIcon />,
  error: <WarningIcon />,
  inactivity: <LockPadlockIcon />,
  logout: <UnlockPadlock />
};
