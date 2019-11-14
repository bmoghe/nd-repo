import {
  INIT_SHEET_DATA,
  TOGGLE_SHEET_VIEW_TYPE,
  TOGGLE_SHEET_SIDEBAR,
  SET_DIM_MEA_IN_COLUMN,
  SET_DIM_MEA_IN_ROW,
  TOGGLE_DROP_ZONE,
  SET_DIM_MEA_IN_X_AXIS,
  SET_DIM_MEA_IN_Y_AXIS,
  API_GET_SHEET_DATA,
  API_PAGINATION_CHANGE,
} from './Sheet.constant';
import { getTableData } from './api-services';
import { getSheetData } from '../../shared/context-model';

export const initSheet = (sheetData, meaDimList) => {
  return {
    type: INIT_SHEET_DATA,
    payload: getTableData(sheetData.joinRequest),
    meta: { sheetData, meaDimList },
  };
};

export const getSheetDataFromAPI = (sheetId, meaDimList) => {
  const sheet = getSheetData();
  return {
    type: API_GET_SHEET_DATA,
    payload: getTableData(sheet.joinRequest),
    meta: { sheetId, meaDimList },
  };
};

export const saveViewTypeState = (value, sheetId) => {
  return {
    type: TOGGLE_SHEET_VIEW_TYPE,
    meta: { value, sheetId },
  };
};

export const dropZoneToggle = (value, sheetId) => {
  return {
    type: TOGGLE_DROP_ZONE,
    meta: { value, sheetId },
  };
};

export const toggleSheetSideBar = (value, sheetId) => {
  return {
    type: TOGGLE_SHEET_SIDEBAR,
    meta: { value, sheetId },
  };
};

export const setDimMeaInColumn = (dimMea) => {
  return {
    type: SET_DIM_MEA_IN_COLUMN,
    meta: { dimMea },
  };
};

export const setDimMeaInRow = (dimMea) => {
  return {
    type: SET_DIM_MEA_IN_ROW,
    meta: { dimMea },
  };
};

export const setDimMeaInXaxis = (dimMea) => {
  return {
    type: SET_DIM_MEA_IN_X_AXIS,
    meta: { dimMea },
  };
};

export const setDimMeaInYaxis = (dimMea) => {
  return {
    type: SET_DIM_MEA_IN_Y_AXIS,
    meta: { dimMea },
  };
};


export const getDataOfPagination = (sheetRequest, pageData, meaDimList) => {
  return {
    type: API_PAGINATION_CHANGE,
    payload: getTableData(sheetRequest),
    meta: { sheetRequest, pageData, meaDimList },
  };
};
