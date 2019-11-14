import axios from 'axios';
import AccessTokenService from './AccessTokenService';

class API {
  constructor() {
    let service = axios.create({
      headers: { 'Content-type': 'application/json; charset=UTF-8' }
    });
    service.interceptors.response.use(this.handleSuccess, this.handleError);
    service.interceptors.request.use(this.handleSuccess, this.handleError);
    this.service = service;
  }

  handleSuccess(response) {
    return response;
  }

  handleError = (error) => {
    switch (error.response.status) {
      case 401:
        this.redirectTo(document, '/')
        break;
      case 404:
        this.redirectTo(document, '/404')
        break;
      default:
        this.redirectTo(document, '/500')
        break;
    }
    return Promise.reject(error)
  }

  redirectTo = (document, path) => {
    console.log('Path: ' + document);
    console.log(path);
  }

  get(path) {
    if (process.env.REACT_APP_SERVER_URL) {
      path = process.env.REACT_APP_SERVER_URL + path;
      return this.service.get(path);
    } else {
      console.log('Base URL is not defined!')
      return;
    }
    // path = process.env.REACT_APP_SERVER__URL
  }
  // get(path, callback) {
  //   return this.service.get(path).then(
  //     (response) => callback(response.status, response.data)
  //   );
  // }

  patch(path, payload, callback) {
    return this.service.request({
      method: 'PATCH',
      url: path,
      responseType: 'json',
      data: payload
    }).then((response) => callback(response.status, response.data));
  }

  post(path, payload, options) {
    path = process.env.REACT_APP_SERVER_URL + path;
    return this.service.request({
      method: 'POST',
      url: path,
      responseType: 'json',
      data: payload,
      headers: options
    });
  }
}

export default new API();