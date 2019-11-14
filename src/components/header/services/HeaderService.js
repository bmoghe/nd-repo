import { API } from '../../../shared/services';
import AccessTokenServices from '../../../shared/services/AccessTokenService';
import axios from 'axios';
//TODO: need to remove these consts until next comment
const accessToken = '';
const GET_CUSTOM_DIMENSION_MEASURE_LIST = '';
const SAVE_CUSTOM_DIMENSION_MEASURE_LIST = '';

//TODO: please remove above consts
const HeaderService = {

  addDiscoveryToCollection: (documentId, CollectionID) => {
    const data = {
      ids: documentId,
      cid: CollectionID
        ? CollectionID
        : "859B3C16_4C87_43C5_B054_CC502BA5438B"
    };
    const config = {
      Headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    return API.post(process.env.REACT_APP_ADD_DISCOVERY_TO_COLLECTION, data, config);
  },

  getDataSourceDetails: dataobjectID => {
    let DATA_VIEW_DETAILS_URL_WITH_NAME = process.env.REACT_APP_DATA_VIEW_DETAILS_URL.replace(
      "ID",
      dataobjectID
    );
    return API.get(`${DATA_VIEW_DETAILS_URL_WITH_NAME}?accessToken=${AccessTokenServices.getAccessToken()}`)
  },
  shareDocument: (documentId, userArray, description) => {
    let reqParam = {
      users: userArray.map(user => user.split(":-")[1]),
      message: description
    };
    const url = `${process.env.REACT_APP_GET_DISCOVERY_DOCUMENT}${documentId}/share?accessToken=${AccessTokenServices.getAccessToken()}`;
    return API.post(url, JSON.stringify(reqParam));
  },
  fetchUsersList: discoveryId => {
    //const url = `/ispring/client/v2/discovery/documents/${discoveryId}/users`;
    const url = `${process.env.REACT_APP_GET_DISCOVERY_DOCUMENT}${discoveryId}/users?accessToken=${AccessTokenServices.getAccessToken()}`;
    return API.get(url);
    // return aedata.ajax.Ajax.get(
    //   `${URL.SERVER_URL}${url}?accessToken=${accessToken}`,
    //   null,
    //   null
    // );
  },
  saveDiscoveryDocApi: reqParam => {
    //let req = reqParam;
    // const bioid = aeDiscoverDocData.data.publishedDataModel
    //   ? aeDiscoverDocData.data.publishedDataModel.dataObject.bioid
    //   : "";
    // const factId = aeDiscoverDocData.data.publishedDataModel
    //   ? aeDiscoverDocData.data.publishedDataModel.dataObject.fid
    //   : "";
    // req.id = req.id ? req.id : bioid;
    // req.factId = factId;
    // return axios(`${URL.SERVER_URL}${SAVE_DISCOVERY_DOC}?accessToken=${accessToken}`, {
    //   method: "post",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   },
    //   data: reqParam
    // });
  },
  setFavouriteDocument: favorite => {
    //const url = "/ispring/client/v2/discovery/documents/favourite";
    // return axios(`${URL.SERVER_URL}${url}?accessToken=${accessToken}`, {
    //   method: "PUT",
    //   headers: {
    //     "Content-type": "application/json; charset=UTF-8"
    //   },
    //   data: {
    //     favorite: !favorite,
    //     id: aeDiscoverDocData.id
    //   }
    // });
  },

  getListOfCustomDimensionMeasure: id => {
    return axios.get(`${URL.SERVER_URL}${GET_CUSTOM_DIMENSION_MEASURE_LIST}/${id}`, {
      params: {
        accessToken: accessToken
      }
    });
  },
  saveCustomDimensionMeasuresList: customMeasureList => {
    return axios(
      `${URL.SERVER_URL}${SAVE_CUSTOM_DIMENSION_MEASURE_LIST}?accessToken=${accessToken}`,
      {
        method: "POST",
        data: customMeasureList
      }
    );
  },
  // saveAsDiscoveryDocApi: reqParam => {
  //  // let req = reqParam;
  //   // const bioid = aeDiscoverDocData.data.publishedDataModel
  //   //   ? aeDiscoverDocData.data.publishedDataModel.dataObject.bioid
  //   //   : "";
  //   // req.id = req.id ? req.id : bioid;
  //   // return axios(`${URL.SERVER_URL}${SAVE_DISCOVERY_DOC}?accessToken=${accessToken}`, {
  //   //   method: "post",
  //   //   headers: {
  //   //     "Content-type": "application/json; charset=UTF-8"
  //   //   },
  //   //   data: reqParam
  //   // });
  // }
};

export default HeaderService;








// export default addDiscoveryToCollection;