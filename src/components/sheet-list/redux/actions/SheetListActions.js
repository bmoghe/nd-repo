import * as types from '../../../../shared/constants/action-types/ActionTypes';
import uuid from 'uuid/v4';
import {
  aeDiscoverDocData,
  saveDiscoverDocData
} from '../../../../shared/constants/discovery-doc-data/Discovery-doc-data';
import { DISCOVERY_SHEET_NAME, MULTIVIEW_SHEET_NAME } from '../../../../shared/constants/messages/Messages.constant'
import initialState from '../../../../reducers/initialState';

export function fetchSheetList() {
  return {
    type: types.FETCH_SHEET_LIST,
    payload: fetch('').then(() => {
      let dataSheet = aeDiscoverDocData.data.sheets;
      if (dataSheet.length > 0) {
        return dataSheet;
      }
      else {
        let discoverySheetId = uuid().toUpperCase();
        let multiViewSheetId = uuid().toUpperCase();
        let initDataSheet = initialState.dataSheet;
        initDataSheet.name = DISCOVERY_SHEET_NAME + "1";
        initDataSheet.id = discoverySheetId;
        initDataSheet.type = 'DISCOVERY_SHEET';
        initDataSheet.sidebarToggle = true;
        initDataSheet.expandCollapseToggle = true;
        initDataSheet.viewType = 'table';

        saveDiscoverDocData("dataSheet", [initDataSheet,
          { name: MULTIVIEW_SHEET_NAME + "1", isEditableCanvas: false, id: multiViewSheetId, type: 'MULTIVIEW_SHEET', filters: [], drawer: { leftOpen: true, rightOpen: false, leftDocked: false, rightDocked: false, } }
        ]);
        return [initDataSheet,
          { name: MULTIVIEW_SHEET_NAME + "1", isEditableCanvas: false, id: multiViewSheetId, type: 'MULTIVIEW_SHEET', filters: [], drawer: { leftOpen: true, rightOpen: false, leftDocked: false, rightDocked: false, } }
        ];
      }
    }),
  };
}

export function addSheet(sheet, handleClicksFromFooter) {
  return {
    type: types.ADD_SHEET_TO_LIST,
    meta: { sheet, handleClicksFromFooter },
  };
}

export function updateSheet(sheet) {
  return {
    type: types.UPDATE_SHEET_FROM_LIST,
    meta: sheet,
  };
}

export function removeSheet(sheet, handleClicksFromFooter) {
  return {
    type: types.REMOVE_SHEET_FROM_LIST,
    meta: { sheet, handleClicksFromFooter },
  };
}

export function duplicateSheet(sheet, handleClicksFromFooter) {
  return {
    type: types.DUPLICATE_SHEET_FROM_LIST,
    meta: { sheet, handleClicksFromFooter },
  };
}

export function updateMVSDrawer(MvsId, drawerState) {
  const param = { MvsId, drawerState };
  return {
    type: types.UPDATE_MVS_DRAWER,
    meta: { ...param }
  };
}

export function initSheetList() {
  return {
    type: types.INIT_SHEET_LIST
  };
}