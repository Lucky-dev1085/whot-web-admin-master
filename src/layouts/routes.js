import SignIn from '../containers/SignIn';
import ForgotPassword from '../containers/ForgotPassword';
import ResetPassword from '../containers/ResetPassword';
import ConfirmEmail from '../containers/ConfirmEmail';
import Dashboard from '../containers/Dashboard';

export default [
  {
    path: '/sign-in',
    component: SignIn,
    exact: true
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    exact: true
  },
  {
    path: '/reset-password/:token',
    component: ResetPassword,
    exact: true
  },
  {
    path: '/confirm-email/:token',
    component: ConfirmEmail,
    exact: true
  },
  {
    path: '/',
    component: Dashboard,
    isPrivate: true
  }
];
