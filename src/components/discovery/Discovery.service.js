import  API  from '../../shared/services/API';
import AccessTokenServices from '../../shared/services/AccessTokenService';


const DiscoveryServices = {
  getDiscoveryDocument: reqParam => {
    const path = `${process.env.REACT_APP_GET_DISCOVERY_DOCUMENT}${reqParam.id}?accessToken=${AccessTokenServices.getAccessToken()}`;
    return API.get(path);
  },
  getMulipleDataModelDetails: listOfDataModelIDs => {
    let path = `${process.env.REACT_APP_MULTIPLE_DATA_MODEL_DETAILS_URL}?accessToken=${AccessTokenServices.getAccessToken()}`;
    return API.post(path, listOfDataModelIDs);
  }
};

export default DiscoveryServices;