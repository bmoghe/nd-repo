import { API } from '../../../shared/services';

const GetAuthToken = (email, password) => {
  const params = new URLSearchParams();
  params.append('grant_type', 'password');
  params.append('client_id', '43F39AB3-1C26-455D-8607-67A00026EB4F');
  params.append('client_secret', '4243df804afc13e072275beed49ff465');
  params.append('username', email);
  params.append('password', password);
  let path = process.env.REACT_APP_LOGIN_URL;
  let headers = {
    'Content-type': 'application/x-www-form-urlencoded',
  };
  return API.post(path, params, headers);
};

export default GetAuthToken;