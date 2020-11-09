import Request from '../../utils/requests';

export const users = new Request('/users');
export const signIn = new Request('/auth/login');
export const passwordReset = new Request('/auth/password-reset');
export const playerDetails = new Request('/player-details');
