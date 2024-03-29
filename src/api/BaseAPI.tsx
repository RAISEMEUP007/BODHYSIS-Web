import { API_URL } from '../common/constants/AppConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { navigateToLogin } from '../common/utils/NavigationUtils';

export const baseGetAPICall = async (route, headers, callback=(jR, s, e)=>{}) => {
  const token = await AsyncStorage.getItem('access-token');
  headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'GET',
      headers: headers,
    });

    if (response.status === 401) {
      await AsyncStorage.removeItem('access-token');
      navigateToLogin();
      return;
    }
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      const jsonRes = await response.clone().json();
      if(jsonRes){
        callback(jsonRes, response.status, response.statusText);
      }else callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};

export const getAPICall = async (route, callback=(jR, s, e)=>{}) => {
  return await baseGetAPICall(route, {'Content-Type': 'application/json'}, callback);
};

export const basePostAPICall = async (route, headers, body, callback=(jR, s, e)=>{}) => {
  try {
    const token = await AsyncStorage.getItem('access-token');
    headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    if (response.status === 401) {
      await AsyncStorage.removeItem('access-token');
      navigateToLogin();
      return;
    }
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      const jsonRes = await response.clone().json();
      if(jsonRes){
        callback(jsonRes, response.status, response.statusText);
      }else callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};


export const basePutAPICall = async (route, headers, body, callback=(jR, s, e)=>{}) => {
  try {
    const token = await AsyncStorage.getItem('access-token');
    headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'PUT',
      headers: headers,
      body: body,
    });
    
    if (response.status === 401) {
      await AsyncStorage.removeItem('access-token');
      navigateToLogin();
      return;
    }
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      const jsonRes = await response.clone().json();
      if(jsonRes){
        callback(jsonRes, response.status, response.statusText);
      }else callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};

export const postAPICall = async (route, payload, callback=(jR, s, e)=>{}) => {
  return await basePostAPICall(route, {'Content-Type': 'application/json'}, JSON.stringify(payload), callback);
};

export const putAPICall = async (route, payload, callback=(jR, s, e)=>{}) => {
  return await basePutAPICall(route, {'Content-Type': 'application/json'}, JSON.stringify(payload), callback);
};