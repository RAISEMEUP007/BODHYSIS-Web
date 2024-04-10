
import { BASE_URL } from './AppConstants';

export const appLinking = {
  prefixes: ['app://', BASE_URL],
  config: {
    screens: {
      Auth: 'auth',
      Home: 'home',
      RecoverPass: 'recoverpass',
      ChangePass: 'changepass',
      Dashboard: 'dashboard',
    },
  },
};
