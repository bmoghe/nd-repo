import { connect } from 'react-redux';
import { SheetWrapper } from './';

// import {
//   initSheet, toggleSheetSideBar, changeAndSaveViewType,
//   attributeDroppedInRow, attributeDroppedInColumn,
//   deleteDimMeaFromTable, onXaxisDrop, onYaxisDrop, deleteDimMeaFromchart
// } from "./AeSheet.actions";

import {
  initSheet, dropZoneToggle, toggleSheetSideBar, saveViewTypeState, setDimMeaInColumn,
  setDimMeaInRow, setDimMeaInXaxis, setDimMeaInYaxis, getSheetDataFromAPI, getDataOfPagination,
} from './Sheet.actions';

function mapStateToProps (state) {
  return {
    data: state,
  };
}

function mapDispatchToProps (dispatch) {
  return {
    initSheet: (sheetData, meaDimList) => {
      dispatch(initSheet(sheetData, meaDimList));
    },
    dropZoneToggle: (value, sheetId) => {
      dispatch(dropZoneToggle(value, sheetId));
    },
    saveViewTypeState: (value, sheetId) => {
      dispatch(saveViewTypeState(value, sheetId));
    },
    toggleSheetSideBar: (value, sheetId) => {
      dispatch(toggleSheetSideBar(value, sheetId));
    },
    setDimMeaInColumn: (dimMea) => {
      return new Promise(function (resolve, reject) {
        dispatch(setDimMeaInColumn(dimMea));
        resolve();
        reject();
      });
    },
    setDimMeaInRow: (dimMea) => {
      dispatch(setDimMeaInRow(dimMea));
    },
    setDimMeaInXaxis: (dimMea) => {
      dispatch(setDimMeaInXaxis(dimMea));
    },
    setDimMeaInYaxis: (dimMea) => {
      dispatch(setDimMeaInYaxis(dimMea));
    },
    getSheetData: (sheetId, meaDimList) => {
      dispatch(getSheetDataFromAPI(sheetId, meaDimList));
    },
    paginationChanged: (sheetRequest, pageData, meaDimList) => {
      dispatch(getDataOfPagination(sheetRequest, pageData, meaDimList));
    },

    // changeAndSaveViewType: (value, sheetId) => {
    //   dispatch(changeAndSaveViewType(value, sheetId));
    // },
    // onXaxisDrop: (sheetId, attribute) => {
    //   dispatch(onXaxisDrop(sheetId, attribute));
    // },
    // onYaxisDrop: (sheetId, attribute) => {
    //   dispatch(onYaxisDrop(sheetId, attribute));
    // },
    // attributeDroppedInRow: (sheetId, attribute) => {
    //   dispatch(attributeDroppedInRow(sheetId, attribute));
    // },
    // deleteDimMeaFromChart: (sheetId, dimensionMeasure) => {
    //   dispatch(deleteDimMeaFromchart(sheetId, dimensionMeasure));
    // },
    // deleteDimMeaFromTable: (sheetId, dimensionMeasure) => {
    //   dispatch(deleteDimMeaFromTable(sheetId, dimensionMeasure));
    // },
    // attributeDroppedInColumn: (sheetId, attribute) => {
    //   return new Promise((resolve, reject) => {
    //     dispatch(attributeDroppedInColumn(sheetId, attribute));
    //     resolve();
    //     reject();
    //   });
    // },
  };
}

const SheetContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(SheetWrapper);

export default SheetContainer;
