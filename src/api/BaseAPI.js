import { API_URL } from '../common/constants/AppConstants';

export const baseGetAPICall = (route, headers, callback) => {
  fetch(`${API_URL}/${route}`, {
    method: 'GET',
    headers: headers,
  })
  .then(async res => {
    try {
      const jsonRes = await res.json();
      if (jsonRes) {
        callback(jsonRes, res.status, null);
      }
    } catch (error) {
      console.log(error);
      callback(null, res.status, error);
    }
  })
  .catch(error => {
    console.log(error);
    callback(null, 500, error);
  });
};

export const getAPICall = (route, callback) => {
  baseGetAPICall(route, {'Content-Type': 'application/json'}, callback);
};

export const basePostAPICall = (route, headers, payload, callback) => {
  fetch(`${API_URL}/${route}`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(payload),
  })
  .then(async res => {
    try {
      const jsonRes = await res.json();
      if (jsonRes) {
        callback(jsonRes, res.status, null);
      }
    } catch (error) {
      console.log(error);
      callback(null, res.status, error);
    }
  })
  .catch(error => {
    console.log(error);
    callback(null, 500, error);
  });
};

export const postAPICall = (route, payload, callback) => {
  basePostAPICall(route, {'Content-Type': 'application/json'}, payload, callback);
};
