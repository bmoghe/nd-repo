const AccessTokenServices = {

  getAccessToken: () => {

    if (localStorage.getItem('access_token')) {
      return localStorage.getItem('access_token');
    } else {
      console.log('No Access token');
      //getAccessTokenFromServer();
    }
  },

  setAccessToken: (token) => {
    localStorage.setItem('access_token', token);
  }

  //getAccessTokenFromServer: ()
};

export default AccessTokenServices;