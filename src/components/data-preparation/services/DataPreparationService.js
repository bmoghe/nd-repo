import { API } from '../../../shared/services';
import { updateRequestForColumnSummaries } from '../../../shared/constants/discovery-doc-data/Discovery-doc-data'
import AccessTokenServices from '../../../shared/services/AccessTokenService';
import { aeDiscoverDocData } from '../../../shared/constants/discovery-doc-data/Discovery-doc-data';
import uuid from "uuid";

const DataPraparationServices = {

  getDataJoinFacts: (data, sheetId, droppedSheetId) => {
    const accessToken = AccessTokenServices.getAccessToken();

    if (sheetId) {
      data = updateRequestForColumnSummaries(data, sheetId, droppedSheetId);
    }
    else {
      delete data.rptaggfn;
    }
    data.requestID = uuid().toUpperCase();
    data.serviceName = "ExecuteBIObjectData";
    const path = process.env.REACT_APP_SHEET_DATA;
    return API.post(`${path}?accessToken=${accessToken}`, JSON.stringify(data));
  },

  getDataViewData: () => {
    const req = aeDiscoverDocData.data.previewRequest;
    req.dataobjectID = aeDiscoverDocData.data.REPORTID || null;
    return API.post(`${process.env.REACT_APP_DATA_VIEW_PREVIEW}?accessToken=${AccessTokenServices.getAccessToken()}`, req);
  },
};

export default DataPraparationServices;