import { BASE_URL } from '../common/constants/AppConstants';
import { baseGetAPICall, postAPICall } from './BaseAPI';

export const login = (email, password, callback) => {
  const payload = { email, password };
  postAPICall('login', payload, callback);
};

export const logout = async (callback) => {
  return await postAPICall('logout', {}, callback);
};

export const signup = (email, password, name, callback) => {
  const payload = { email, password, name };
  postAPICall('signup', payload, callback);
};

export const privateSync = (token, callback) => {
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  baseGetAPICall('private', headers, callback);
};

export const resetPass = (email, callback) => {
  const payload = {
    email,
    clientHost: BASE_URL,
  };
  postAPICall('resetpass', payload, callback);
};

export const newPasword = (recoveryId, password, callback) => {
  const payload = { recoveryId, password };
  postAPICall('newpassword', payload, callback);
};
