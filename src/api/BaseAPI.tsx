import { API_URL } from '../common/constants/AppConstants';

export const baseGetAPICall = async (route, headers, callback) => {
  try {
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'GET',
      headers: headers,
    });
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};

export const getAPICall = async (route, callback) => {
  return await baseGetAPICall(route, {'Content-Type': 'application/json'}, callback);
};

export const basePostAPICall = async (route, headers, body, callback) => {
  try {
    const response = await fetch(`${API_URL}/${route}`, {
      method: 'POST',
      headers: headers,
      body: body,
    });
    
    if(response.ok){
      const jsonRes = await response.clone().json();
      
      if (jsonRes) {
        callback(jsonRes, response.status, null);
      }
    }else{
      callback(null, response.status, response.statusText);
    }
    
    return response;
  } catch (error) {
    console.log(error);
    callback(null, 500, error);
    return error;
  }
};

export const postAPICall = async (route, payload, callback) => {
  return await basePostAPICall(route, {'Content-Type': 'application/json'}, JSON.stringify(payload), callback);
};
