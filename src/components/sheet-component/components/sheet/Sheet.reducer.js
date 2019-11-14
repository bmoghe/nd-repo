import {
  INIT_SHEET_DATA_PENDING,
  INIT_SHEET_DATA_FULFILLED,
  INIT_SHEET_DATA_REJECTED,
  SET_DIM_MEA_IN_COLUMN,
  TOGGLE_SHEET_SIDEBAR,
  SET_DIM_MEA_IN_ROW,
  TOGGLE_SHEET_VIEW_TYPE,
  SET_DIM_MEA_IN_X_AXIS,
  SET_DIM_MEA_IN_Y_AXIS,
  TOGGLE_DROP_ZONE,
  API_GET_SHEET_DATA_PENDING,
  API_GET_SHEET_DATA_FULFILLED,
  API_GET_SHEET_DATA_REJECTED,
  API_PAGINATION_CHANGE_PENDING,
  API_PAGINATION_CHANGE_FULFILLED,
  API_PAGINATION_CHANGE_REJECTED,
} from './Sheet.constant';

import {
  prepareRow, prepareColumn, prepareXAxis, prepareYAxis, saveDropZoneState,
  saveSidebarState, saveViewTypeState, updateChartAxisData,
  updateRowColumnData, convertTableData, getCellStyles, prepareChartData, applyValueFormat
} from '../../shared/utils';

import { initialStateOfsheet } from './initial-store-for-sheet/initialStoreForSheet';
import { setSheetData } from '../../shared/context-model/SheetData';

// import { getSheetData, saveToggleState } from './AeSheet.utils';

const sheetData = (state = initialStateOfsheet, action) => {
  // let sheet = null, sidebarToggle = null, viewType = null;
  let sheet = null,
    viewType = null,
    rangesList = null,
    formatConfig = null,
    apiData = null,
    chartData = null,
    expandCollapseToggle = null,
    sidebarToggle = null;

  switch (action.type) {

    case INIT_SHEET_DATA_PENDING:
      sheet = { ...action.meta.sheetData };
      setSheetData(sheet);
      apiData = {
        columnDefs: [],
        rowData: [],
      };
      return { ...state, ...sheet, apiData, loading: true };

    case INIT_SHEET_DATA_FULFILLED:
      apiData = convertTableData(action.payload.data, action.meta.meaDimList);
      formatConfig = state.pivot.formatConfig ? state.pivot.formatConfig : [];
      // applyValueFormat(apiData, formatConfig, action.meta.meaDimList);
      apiData.columnDefs.forEach(column => {
        column['valueFormatter'] = applyValueFormat.bind(this, formatConfig, action.meta.meaDimList);
      });
      if (state.viewType === 'chart') {
        chartData = prepareChartData(apiData, state.chartProperties, state.chart.xAxisItems, state.chart.yAxisItems);
      } else {
        rangesList = state.pivot.metadata && state.pivot.metadata.rangesList ? state.pivot.metadata.rangesList : null;
        apiData.columnDefs.forEach(column => {
          column['cellStyle'] = (params) => {
            return getCellStyles(rangesList, apiData.columnDefs, params, action.meta.meaDimList);
            ;
          };
        });
        apiData.totalRows = action.payload.data.totalRows;
      }

      return { ...state, apiData, loading: false, chartData };

    case INIT_SHEET_DATA_REJECTED:
      apiData = {
        columnDefs: [],
        rowData: [],
      };
      return { ...state, apiData, loading: false };

    case API_GET_SHEET_DATA_PENDING:
      apiData = {
        columnDefs: [],
        rowData: [],
      };
      return { ...state, apiData, loading: true };

    case API_GET_SHEET_DATA_FULFILLED:
      apiData = convertTableData(action.payload.data, action.meta.meaDimList);
      apiData = formatConfig = state.pivot.metaData && state.pivot.metaData.formatConfig ? state.pivot.metaData.formatConfig : [];
      applyValueFormat(apiData, formatConfig, action.meta.meaDimList);
      apiData.columnDefs.forEach(column => {
        column['cellStyle'] = (params) => {
          return getCellStyles(state.pivot.metadata.rangesList, apiData.columnDefs, params, action.meta.meaDimList);
        };
      });
      apiData.totalRows = action.payload.data.totalRows;
      return { ...state, apiData, loading: false };

    case API_GET_SHEET_DATA_REJECTED:
      // TODO SHOW MESSAGE
      return { ...state, apiData, loading: false };

    case TOGGLE_SHEET_SIDEBAR:
      sidebarToggle = action.meta.value;
      saveSidebarState(action.meta.value, action.meta.sheetId);
      return { ...state, sidebarToggle };

    case TOGGLE_DROP_ZONE:
      expandCollapseToggle = action.meta.value;
      saveDropZoneState(action.meta.value);
      return { ...state, expandCollapseToggle };

    case TOGGLE_SHEET_VIEW_TYPE:
      viewType = action.meta.value;
      saveViewTypeState(action.meta.value, action.meta.sheetId);
      return { ...state, viewType };

    case SET_DIM_MEA_IN_COLUMN:
      sheet = prepareColumn(state.id, action.meta.dimMea, state.pivot, state.chart);
      updateChartAxisData(state.id, { ...sheet.chart });
      updateRowColumnData(state.id, { ...sheet.pivot });
      return { ...state, chart: sheet.chart, pivot: sheet.pivot, loading: false };

    case SET_DIM_MEA_IN_ROW:
      sheet = prepareRow(state.id, action.meta.dimMea, state.pivot, state.chart);
      updateChartAxisData(state.id, { ...sheet.chart });
      updateRowColumnData(state.id, { ...sheet.pivot });
      return { ...state, chart: sheet.chart, pivot: sheet.pivot, loading: false };

    case SET_DIM_MEA_IN_X_AXIS:
      sheet = prepareXAxis(state.id, action.meta.dimMea, state.chart, state.pivot);
      updateChartAxisData(state.id, { ...sheet.chart });
      updateRowColumnData(state.id, { ...sheet.pivot });
      return { ...state, chart: sheet.chart, pivot: sheet.pivot, loading: false };

    case SET_DIM_MEA_IN_Y_AXIS:
      sheet = prepareYAxis(state.id, action.meta.dimMea, state.chart, state.pivot);
      updateChartAxisData(state.id, { ...sheet.chart });
      updateRowColumnData(state.id, { ...sheet.pivot });
      return { ...state, chart: sheet.chart, pivot: sheet.pivot, loading: false };

    case API_PAGINATION_CHANGE_PENDING:
      return { ...state, loading: true };

    case API_PAGINATION_CHANGE_FULFILLED:
      sheet = convertTableData(action.payload.data, action.meta.meaDimList);
      state.apiData.rowData = sheet.rowData;
      return { ...state, loading: false };

    case API_PAGINATION_CHANGE_REJECTED:
      // TODO SHOW MESSAGE
      return { ...state, loading: false };

    default:
      return { ...state };
  }
};

export default sheetData;
