import * as actionTypes from '../../../../shared/constants/action-types/ActionTypes';
import initialState from '../../../../reducers/initialState';
import * as utils from '../../utils/sheet-list-utils';
//import { saveDrawerOnMVS } from '../components/ae-multi-view/aeMVSUtil';
import { aeDiscoverDocData, saveDiscoverDocData } from '../../../../shared/constants/discovery-doc-data/Discovery-doc-data';


export default function sheetListReducer(state = initialState.sheetList, action) {
  let sheetList, list;
  switch (action.type) {
    case actionTypes.FETCH_SHEET_LIST_PENDING:
      return { ...state, loading: true };

    case actionTypes.FETCH_SHEET_LIST_FULFILLED:
      sheetList = action.payload;
      return { ...state, loading: false, sheetList };

    case actionTypes.FETCH_SHEET_LIST_REJECTED:
      return { ...state, loading: false, error: `${action.payload.message}` };

    case actionTypes.ADD_SHEET_TO_LIST:
      sheetList = utils.addSheetToList(action.meta);
      return { ...state, loading: false, sheetList };

    case actionTypes.REMOVE_SHEET_FROM_LIST:
      sheetList = utils.removeSheet(state.sheetList, action.meta.sheet, action.meta.handleClicksFromFooter);
      return { ...state, loading: false, sheetList };

    case actionTypes.UPDATE_SHEET_FROM_LIST:
      list = aeDiscoverDocData.data.sheets;
      sheetList = utils.updateItemName(list, action.meta);
      return { ...state, loading: false, sheetList };

    case actionTypes.DUPLICATE_SHEET_FROM_LIST:
      sheetList = utils.duplicateSheet(state.sheetList, action.meta.sheet, action.meta.handleClicksFromFooter);
      return { ...state, loading: false, sheetList };

    // case actionTypes.UPDATE_MVS_DRAWER:
    //   sheetList = saveDrawerOnMVS(action.meta);
    //   return { ...state, loading: false, sheetList };

    case actionTypes.INIT_SHEET_LIST:
      sheetList = [];
      sheetList.push(utils.addSheetToList("DISCOVERY_SHEET", true));
      sheetList.push(utils.addSheetToList("MULTIVIEW_SHEET", true));
      saveDiscoverDocData("dataSheet", sheetList);
      return { ...state, loading: false, sheetList };
      
    default:
      return state;
  }
}