let accessToken = null;

export const setAccessToken = data => {
  accessToken = data;
};

export const getAccessToken = () => {
  return accessToken;
};
