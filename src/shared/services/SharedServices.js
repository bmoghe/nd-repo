import axios from 'axios';

const SharedServices = {

  publishDataModel: req => {
   // return API.post()
    return axios(`${URL.SERVER_URL}${PUBLISH_DATA_MODEL}?accessToken=${accessToken}`,
      {
        method: "post",
        headers: {
          "Content-type": "application/json; charset=UTF-8"
        },
        data: req
      }
    );
  },
};

export default SharedServices;