import React from 'react';

import Analytics from '../../components/Analytics';
import Users from '../../components/Users';
import Games from '../../components/Games';
import AdminUsers from '../../components/AdminUsers';
import DepositVouchers from '../../components/DepositVouchers';
import AnalyticsIcon from '../../vectors/AnalyticsIcon';
import UserIcon from '../../vectors/UserIcon';
import GamesIcon from '../../vectors/GamesIcon';
import AdminIcon from '../../vectors/AdminIcon';
import VouchersIcon from '../../vectors/VouchersIcon';

export const DASHBOARD_ROUTES = [
  {
    label: 'Analytics',
    path: '/Analytics',
    icon: <AnalyticsIcon />,
    component: Analytics,
    permissions: ['*']
  },
  {
    label: 'Users',
    path: '/users',
    icon: <UserIcon />,
    component: Users,
    permissions: ['players:read', 'players:write']
  },
  {
    label: 'Manage Games',
    path: '/games',
    icon: <GamesIcon />,
    component: Games,
    permissions: ['game:read', 'game:write']
  },
  {
    label: 'Admin',
    path: '/admin-users',
    icon: <AdminIcon />,
    component: AdminUsers,
    permissions: ['*']
  },
  {
    label: 'Deposit Vouchers',
    path: '/deposit-vouchers',
    icon: <VouchersIcon />,
    component: DepositVouchers,
    permissions: ['*']
  }
];

export const HEADER_MENUS = {
  '/admin-users': {
    path: '/admin-users/new',
    label: 'CREATE ADMIN USER'
  },
  '/games': {
    path: '/games/new',
    label: 'CREATE GAME'
  }
};
