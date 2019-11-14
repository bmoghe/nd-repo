import * as actionTypes from '../../../../shared/constants/action-types/ActionTypes';
import initialState from '../../../../reducers/initialState';
import { find } from "lodash";
import { getUniqColor, getUniqKey, loadReport } from '../../../../shared/utils/report-sheet-details/ReportSheeetDetails.util';
import * as utils from '../../../../shared/utils/common-utils/CommonUtils';
import {
  aeDiscoverDocData,
  saveDiscoverDocData,
  aeNavigationConstants,
  savePublishedDataModelDetails,
  prepareDiscoveryDocument
} from '../../../../shared/constants';
import { message } from 'antd';
import { checkStatus, checkPreviewStatus } from '../../utils/DataSource.util';
import { prepareDataTable } from '../../../../shared/utils/prepare-grid-data/PrepareGridData';
import { HeaderService } from '../../../header/services';
import * as errMsg from '../../../../shared/constants/messages/Messages.constant';
import { updateApplicationURL, updateDiscoveryAfterSaveAndPublish } from "../../../discovery/Discovery.utils";

export default function dataSourceListReducer(state = initialState.selectedDatasource, action) {
  let selectedDatasource, data;
  let dataJoinTable;
  let reportSheet;
  let gettingDataViewProperties = false;
  let msg = null;
  switch (action.type) {
    case actionTypes.FETCH_DATASOURCE_LIST_PENDING:
      return { ...state, loading: true };

    case actionTypes.FETCH_DATASOURCE_LIST_FULFILLED:
      selectedDatasource = action.payload;
      state.isDrawerOpen = aeDiscoverDocData.data.isDataJoinDrawerOpen;
      return { ...state, loading: false, selectedDatasource };

    case actionTypes.FETCH_DATASOURCE_LIST_REJECTED:
      return { ...state, loading: false, error: `${action.payload.message}` };

    case actionTypes.REMOVE_DATASOURCE:
      selectedDatasource = utils.removeItem(state.selectedDatasource, action.meta);
      return { ...state, loading: false, selectedDatasource };

    case actionTypes.ADD_DATASOURCE:
      reportSheet = { ...action.meta };
      reportSheet.tempId = getUniqKey();
      reportSheet.color = getUniqColor(state.selectedDatasource);
      reportSheet.disabled = false;
      selectedDatasource = state.selectedDatasource;
      selectedDatasource.push(reportSheet);
      saveDiscoverDocData("selectedDataSources", selectedDatasource);
      return { ...state, loading: false, selectedDatasource };

    case actionTypes.DISABLE_DATASOURCE:
      selectedDatasource = utils.enableDisableDataSources(actionTypes.DISABLE_DATASOURCE, state.selectedDatasource, action.meta);
      return { ...state, loading: false, selectedDatasource };

    case actionTypes.ENABLE_DATASOURCE:
      selectedDatasource = utils.enableDisableDataSources(actionTypes.ENABLE_DATASOURCE, state.selectedDatasource, action.meta);
      return { ...state, loading: false, selectedDatasource };

    case actionTypes.GET_DATAJOIN_FACTS_PENDING:
      state.GET_DATAJOIN_FACTS_PENDING = true;
      return { ...state, loading: true };

    case actionTypes.GET_DATAJOIN_FACTS_FULFILLED:
      if (action.payload.status === 500) {
        dataJoinTable = { columnDefs: [], rowData: [] };
      } else {
        dataJoinTable = utils.saveDataJoinData(action.payload);
        if (dataJoinTable.error) {
          message.error(dataJoinTable.error.message);
        }
      }
      state.GET_DATAJOIN_FACTS_PENDING = false;
      return { ...state, loading: false, dataJoinTable };

    case actionTypes.GET_DATAJOIN_FACTS_REJECTED:
      state.GET_DATAJOIN_FACTS_PENDING = false;
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };

    // STARTED========> CASES FOR THE DATA VIEW DATA FOR JOIN
    case actionTypes.GET_DATA_VIEW_DATA_PENDING:
      state.GET_DATA_VIEW_DATA_PENDING = true;
      gettingDataViewProperties = true;
      return { ...state, loading: true, gettingDataViewProperties };

    case actionTypes.GET_DATA_VIEW_DATA_FULFILLED:
      state.GET_DATA_VIEW_DATA_PENDING = false;
      dataJoinTable = checkPreviewStatus(action.payload) ? prepareDataTable(action.payload.data) : {
        columnDefs: [],
        rowData: []
      };
      gettingDataViewProperties = false;
      return { ...state, loading: false, dataJoinTable, gettingDataViewProperties };

    case actionTypes.GET_DATA_VIEW_DATA_REJECTED:
      state.GET_DATA_VIEW_DATA_PENDING = false;
      dataJoinTable = { columnDefs: [], rowData: [] };
      gettingDataViewProperties = false;

      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);

      return { ...state, dataJoinTable, loading: false, error: `${action.payload.message}`, gettingDataViewProperties };
    // ENDED========> CASES FOR THE DATA VIEW DATA FOR JOIN

    // STARTED========> CASES FOR THE PUBLISH DATA MODEL
    case actionTypes.PUBLISH_DATA_MODEL_PENDING:
      return { ...state, loading: true };

    case actionTypes.PUBLISH_DATA_MODEL_FULFILLED:
      if (checkStatus(action.payload.status)) {
        data = action.payload.data;
        updateDiscoveryAfterSaveAndPublish(data);
        savePublishedDataModelDetails(action.payload);
        reportSheet = find(aeDiscoverDocData.data.sheets, { type: "DISCOVERY_SHEET" });
        updateApplicationURL(data.dataObject.bioid);
        if (aeDiscoverDocData.CollectionID) {
          HeaderService.addDiscoveryToCollection(data.dataObject.bioid, aeDiscoverDocData.CollectionID);
        }
        setTimeout(() => {
          action.meta.handleNavigation(aeNavigationConstants.DISCOVERY_SHEET, reportSheet)();
          utils.updateActiveSheet(reportSheet);
        }, 0);
        message.success('Document is published and saved successfully');
      } else {
        message.error(action.payload.data === "" ? "Something went wrong" : action.payload.data["ERROR MESSAGE"]);
        saveDiscoverDocData('dataModelId', null);
      }
      return { ...state, loading: false };

    case actionTypes.PUBLISH_DATA_MODEL_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };
    // ENDED========> CASES FOR THE PUBLISH DATA MODEL

    // STARTED========> CASES FOR THE PUBLISH AND UPDATE DATA MODEL
    case actionTypes.PUBLISH_AND_UPDATE_DATA_MODEL_PENDING:
      return { ...state, loading: true };

    case actionTypes.PUBLISH_AND_UPDATE_DATA_MODEL_FULFILLED:
      if (checkStatus(action.payload.status) && action.payload.data !== "" && action.payload.data.SUCCESS !== "false") {
        HeaderService.getDataSourceDetails(aeDiscoverDocData.data.REPORTID).then(function (result) {
          // reportSheet = cloneDeep(aeDiscoverDocData.data.publishedDataModel);
          // reportSheet.dataObject.reports = action.meta.request.reports;
          // reportSheet.dataObject.requestJoins = action.meta.request.requestJoins;
          savePublishedDataModelDetails(result);
          action.meta.saveDocument(
            prepareDiscoveryDocument(
              aeDiscoverDocData.name,
              aeDiscoverDocData.description,
              aeDiscoverDocData.id,
              aeDiscoverDocData.corporate), false, false);
        });
      } else {
        message.error(action.payload.data === "" ? "Something went wrong" : action.payload.data["ERROR MESSAGE"]);
        // saveDiscoverDocData('dataModelId', null);
      }
      return { ...state, loading: false };

    case actionTypes.PUBLISH_AND_UPDATE_DATA_MODEL_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };
    // ENDED========> CASES FOR THE PUBLISH AND UPDATE DATA MODEL

    case actionTypes.REMOVE_JOIN_TABLE_CONTENT:
      dataJoinTable = { columnDefs: [], rowData: [] };
      return { ...state, loading: false, dataJoinTable };

    case actionTypes.LOAD_REPORT_PENDING:
      return { ...state, loading: true };

    case actionTypes.LOAD_REPORT_FULFILLED:
      loadReport(action.meta, action.payload);
      return { ...state, loading: false };

    case actionTypes.LOAD_REPORT_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };

    case actionTypes.UPDATE_DRAWER_STATE:
      state.isDrawerOpen = !aeDiscoverDocData.data.isDataJoinDrawerOpen;
      saveDiscoverDocData("isDataJoinDrawerOpen", state.isDrawerOpen);
      return { ...state, loading: false };

    default:
      return state;
  }
}