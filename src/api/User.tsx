import { BASE_URL } from '../common/constants/AppConstants';
import { baseGetAPICall, getAPICall, postAPICall } from './BaseAPI';

export const getDrivers = (cb=(jR, s, e)=>{}) => {
  getAPICall('user/getdrivers/', cb);
}
