import React, { Component } from 'react';
import { Button, Input, Spin } from 'antd';
import logo from '../../styles/images/logo_aera.svg';
import './login.scss';
import { getAuthToken } from './get-login/getAuthToken';
import { setAccessToken } from '../../model/accessTokenInfo';

class Login extends Component {
  state = {
    email: null,
    password: null,
    loading: false,
  };

  setValues = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };

  getLoggedIn = () => {
    const { email, password } = this.state;
    getAuthToken(email, password).then(this.loginSuccess, this.loginFailed);
  };

  loginSuccess = data => {
    if (data) {
      // eslint-disable-next-line camelcase
      const { access_token } = data;
      this.setState({ loading: false });
      /* eslint-disable  no-restricted-globals */
      localStorage.setItem(`${location.host}_access_token`, access_token);
      setAccessToken(access_token);
      // TODO Navigate to application
    }
  };

  loginFailed = error => {
    console.log(error);
  };

  render() {
    const { loading } = this.state;
    return (
      <Spin spinning={loading}>
        <div className="ae-login">
          <div className="ae-login-wrapper">
            <div className="header">
              <img alt="Aera Logo" src={logo} />
            </div>
            <div className="input-field">
              <Input name="email" placeholder="Email Address" type="email" onChange={this.setValues} />
            </div>
            <div className="input-field">
              <Input name="password" placeholder="Password" type="password" onChange={this.setValues} />
            </div>
            <Button type="primary" onClick={this.getLoggedIn}>
              Log in{' '}
            </Button>
          </div>
        </div>
      </Spin>
    );
  }
}

export default Login;
