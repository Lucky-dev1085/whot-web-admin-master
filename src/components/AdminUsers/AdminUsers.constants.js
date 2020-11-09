import UsersList from './UsersList';
import CreateUser from './CreateUser';

import { ADMIN_ROLES as adminRoles } from '../../config';

export const ROUTES = [
  {
    path: '/admin-users',
    component: UsersList
  },
  {
    path: '/admin-users/new',
    component: CreateUser
  }
];

export const DEFAULT_CREATE_FORM_FIELDS = {
  email: { value: '', isValid: false },
  role: { value: adminRoles[0].value, isValid: true }
};
