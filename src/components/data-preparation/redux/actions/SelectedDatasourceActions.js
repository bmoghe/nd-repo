import * as types from '../action-types/ActionTypes';
import { aeDiscoverDocData, preparePublishAndUpdateRequest } from '../../../../shared/constants/discovery-doc-data/Discovery-doc-data';
import { API } from '../../../../shared/services';
import DataPraparationServices from '../../services/DataPreparationService';
import { forEach } from "lodash";
//import * as utils from "../utils/Utils";

export function addDataSource(dataSource) {
  return {
    type: types.ADD_DATASOURCE,
    meta: dataSource
  };
}

export function removeDataSource(dataSource) {
  return {
    type: types.REMOVE_DATASOURCE,
    meta: dataSource
  };
}

export function fetchDataSourceList(dataSource) {
  const data = aeDiscoverDocData.data.selectedDataSources ? aeDiscoverDocData.data.selectedDataSources : [];
  return {
    type: types.FETCH_DATASOURCE_LIST,
    payload: fetch('').then(() => {
      return data ? data : [];
    }),
    meta: dataSource
  };
}

export function disableDataSource(id) {
  return {
    type: types.DISABLE_DATASOURCE,
    meta: id
  };
}

export function enableDataSource(arrayOfId) {
  return {
    type: types.ENABLE_DATASOURCE,
    meta: arrayOfId
  };
}


export function getDataJoinFacts(data) {
  return {
    type: types.GET_DATAJOIN_FACTS,
    payload: API.getDataJoinFacts(data),
    meta: data
  };
}

export function previewDataViewData(data) {
  return {
    type: types.GET_DATA_VIEW_DATA,
    payload: DataPraparationServices.getDataViewData(data),
    meta: data
  };
}

const preparePublishAndSaveDoc = (dataModelName, desc, corporate) => {
  let dataModel = aeDiscoverDocData.data.previewRequest;
  dataModel.dataObjectName = dataModelName;
  dataModel.description = desc;
  forEach(dataModel.reports, (report) => {
    if (!report.hasOwnProperty("operation")) {
      report.operation = "NEW";
    }
  });
  //const discoveryDoc = utils.prepareDiscoveryDocument(dataModelName, desc, '', corporate);
  //return { dataModel, discoveryDoc };
};

export function publishDataModel(dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate) {
  const request = preparePublishAndSaveDoc(dataModelName, desc, corporate);
  return {
    type: types.PUBLISH_DATA_MODEL,
    payload: API.publishDataModel(request),
    meta: { dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate, ...request }
  };
}

export function publishAndUpdate(saveDocument) {
  const request = preparePublishAndUpdateRequest();
  return {
    type: types.PUBLISH_AND_UPDATE_DATA_MODEL,
    payload: API.publishAndUpdate(request),
    meta: { saveDocument, request }
  };
}

export function removeJoinTableContent() {
  return {
    type: types.REMOVE_JOIN_TABLE_CONTENT
  };
}

export function loadReport(reportId, sheetId) {
  return {
    type: types.LOAD_REPORT,
    payload: API.getReportSheetDetails({ id: reportId, sheetId }),
    meta: { reportId, sheetId }
  };
}

export function updateDrawerState() {
  return {
    type: types.UPDATE_DRAWER_STATE
  };
}
