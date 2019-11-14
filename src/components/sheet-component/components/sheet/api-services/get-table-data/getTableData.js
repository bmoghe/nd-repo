import { SHEET_DATA } from '../../../../shared/constants/urlConstant';
import uuid from 'uuid/v4';
import { getAccessToken } from '../../../../config/getAccessToken';
import { API } from '../../../../config/axoisInterceptors';

export const getTableData = (request) => {
  const apiRequest = { ...request };
  apiRequest.requestID = uuid().toUpperCase();
  apiRequest.serviceName = 'ExecuteBIObjectData';

  // TODO Remove access token from url as it handled axois interceptor.
  return API(`${SHEET_DATA}?accessToken=${getAccessToken()}`, {
    method: 'post',
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
    data: JSON.stringify(apiRequest),
  });
};
