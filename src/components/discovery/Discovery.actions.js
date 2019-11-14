import * as types from './Discovery.actionTypes';
import { API } from '../../shared/services';

export function fetchDiscoveryDocument(documentId) {
  return {
    type: types.FETCH_DISCOVERY_DOCUMENT,
    payload: API.getDiscoveryDocument(documentId),
    meta: documentId
  };
}
export function fetchDefaultDiscoveryDocument() {
  return {
    type: types.FETCH_BLANK_DISCOVERY_DOCUMENT,
  };
}

export const initDiscoveryDoc = (data, publishData) => {
  return {
    type: types.FETCH_DISCOVERY_DOCUMENT,
    meta: {data, publishData}
  };
};

export const initDataSourceDetails = (data) => {
  return {
    type: types.FETCH_DATA_SOURCE_DETAILS,
    meta: data
  };
};


