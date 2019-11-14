import axios from 'aera-react-library/dist/utils/aeraAxios';
// import { getAccessaeToken } from './getAccessToken';

export const API = axios.create();
// Add a request interceptor
API.interceptors.request.use(config => {
  // Do something before request is sent
  // TODO Add access token in header as bearer tokens
  // config.headers['Authorization'] = `Bearer ${getAccessToken()}`
  return config;
}, error => {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
API.interceptors.response.use(response => {

  // Do something with response data

  return response;
}, error => {
  // Do something with response error
  return Promise.reject(error);
});
