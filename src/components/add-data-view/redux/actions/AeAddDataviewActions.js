import {
  FETCH_DATA_VIEWS, SEARCH_DATA_VIEWS, CHANGE_DATA_SOURCE_NAME_DESC,
  CLEAR_DATA_SOURCE_FORM_DATA, FETCH_DATA_SOURCE_DETAILS, SELECT_DATA_SOURCE_DETAILS,
  FETCH_DATA_SOURCE_PROPERTIES
} from '../constants/actionTypes';
import { API } from '../config/api';

export function clearDataSourceForm() {
  return {
    type: CLEAR_DATA_SOURCE_FORM_DATA
  };
}
export function getDataViewList(selectedDataSourceList) {
  return {
    type: FETCH_DATA_VIEWS,
    payload: API.getDataViewList(),
    meta: selectedDataSourceList
  };
}

export function searchDataViewList(query, selectedDatasourceList) {
  return {
    type: SEARCH_DATA_VIEWS,
    payload: API.searchDataViewList(query),
    meta: selectedDatasourceList
  };
}

export function getDataSourceProperties(dataSource, addDataSource, closeAddDataSourceModal) {
  return {
    type: FETCH_DATA_SOURCE_PROPERTIES,
    payload: API.getDataSourceDetails(dataSource.doid),
    meta: { dataSource, addDataSource, closeAddDataSourceModal }
  };
}

export function getDataSourceDetails(dataSource, isLoadingDataView) {
  return {
    type: FETCH_DATA_SOURCE_DETAILS,
    payload: API.getDataSourceDetails(dataSource.dataobjectID ? dataSource.dataobjectID : dataSource),
    meta: { dataSource, isLoadingDataView }
  };
}
export function changeDataSourceNameDesc(val, type) {
  return {
    type: CHANGE_DATA_SOURCE_NAME_DESC,
    meta: { val, type }
  };
}
export function selectDataSourceDetails(dataSource, isLoadingDataView) {
  return {
    type: SELECT_DATA_SOURCE_DETAILS,
    //payload: API.getDataSourceDetails(dataSource.dataobjectID ? dataSource.dataobjectID : dataSource),
    meta: { dataSource, isLoadingDataView }
  };
}

