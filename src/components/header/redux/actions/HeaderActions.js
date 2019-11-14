import * as types from '../action-types';
import { HeaderService } from '../../services';

export function shareDocument(documentId, userArray, description) {
  return {
    type: types.SHARE_DISCOVERY_DOCUMENT,
    payload: HeaderService.shareDocument(documentId, userArray, description),
  };
}

export function toggleShareModal() {
  return {
    type: types.TOGGLE_SHARE_MODEL
  };
}

export function fetchUsersList(discoveryId) {
  return {
    type: types.FETCH_USER_LIST,
    payload: HeaderService.fetchUsersList(discoveryId)
  };
}

export function saveDiscoveryDoc(data, closeDiscoveryDocument, isNewDiscovery) {
  return {
    type: types.SAVE_DISCOVERY_DOCUMENT,
    payload: HeaderService.saveDiscoveryDocApi(data),
    meta: { data, closeDiscoveryDocument, isNewDiscovery }
  };
}


export function enableDisableEditDoc(data) {
  return {
    type: types.EDIT_DISCOVERY_DOCUMENT,
    meta: data,
  };
}

export function toggleSaveDscoveryModal() {
  return {
    type: types.TOGGLE_SAVE_DISCOVERY_MODAL,
  };
}

export function toggleSaveAsDscoveryModal() {
  return {
    type: types.TOGGLE_SAVE_AS_DISCOVERY_MODAL,
  };
}

export function toggleSetDiscoveryAsFav(fav) {
  return {
    type: types.SET_FAV_DISCOVERY_DOCUMENT,
    payload: HeaderService.setFavouriteDocument(fav),
    meta: { fav }
  };
}

export function saveAsPublish(data) {
  return {
    type: types.SAVE_AS_PUBLISH,
    payload: HeaderService.publishDataModel(data),
    meta: data
  };
}

export function getListOfCustomDimensionMeasure(newDiscoveryStore, mappingJSON, fid) {
  return {
    type: types.GET_LIST_OF_CUSTOM_DM,
    payload: HeaderService.getListOfCustomDimensionMeasure(fid),
    meta: { newDiscoveryStore, mappingJSON }
  };
}

export function saveCustomDimensionMeasuresList(customDimensionMeasures, newDiscoveryStore, mappingJSON) {
  return {
    type: types.SAVE_CUSTOM_DM_LIST,
    payload: HeaderService.saveCustomDimensionMeasuresList(customDimensionMeasures),
    meta: { customDimensionMeasures, newDiscoveryStore, mappingJSON }
  };
}

export function saveAsDocument(data) {
  return {
    type: types.SAVE_AS_DOCUMENT,
    payload: HeaderService.saveAsDiscoveryDocApi(data),
    meta: data
  };
}

//Below actions are shared among others
export const addDiscoveryToCollection = (documentId, CollectionID) => {

};

export function publishDataModel(dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate) {
  // const request = preparePublishAndSaveDoc(dataModelName, desc, corporate);
  // return {
  //   type: types.PUBLISH_DATA_MODEL,
  //   payload: API.publishDataModel(request),
  //   meta: {dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate, ...request}
  // };
};

export function publishAndUpdate(saveDocument) {
  //const request = preparePublishAndUpdateRequest();
  // return {
  //   type: types.PUBLISH_AND_UPDATE_DATA_MODEL,
  //   payload: API.publishAndUpdate(request),
  //   meta: {saveDocument, request}
  // };
};

export function getDataSourceDetails(dataSource, isLoadingDataView) {
  // return {
  //   type: FETCH_DATA_SOURCE_DETAILS,
  //   payload: API.getDataSourceDetails(dataSource.dataobjectID ? dataSource.dataobjectID : dataSource),
  //   meta: { dataSource, isLoadingDataView }
  // };
}