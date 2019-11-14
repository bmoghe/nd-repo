import { getSheet } from "../../../utils/discovery-doc/prepare-request";
import { find, filter } from "lodash";

export const isRowColumnsAvailable = (sheetId) => {
  let dataSheet = getSheet(sheetId);
  if (dataSheet) {
    if (dataSheet.viewType === 'table' && (dataSheet.pivot.column.length !== 0 || dataSheet.pivot.row.length !== 0) && dataSheet.totalRows !== 0) {
      //return isSimpleTable(sheetId) ;
      return true;
    } else if (dataSheet.viewType === 'chart') {
      return (dataSheet.chart.xAxisItems.length !== 0 && dataSheet.chart.yAxisItems.length !== 0);
    } else {
      return false;
    }
  }
  return true;
};

export const isSimpleTable = (sheetId) => {
  let dataSheet = getSheet(sheetId);
  if (dataSheet) {
    let isDimensionInColumn = !!find(dataSheet.pivot.column, { isDimension: true });
    let isDimensionInRow = !!find(dataSheet.pivot.row, { isDimension: true });
    let isMeasureInRow = !!find(dataSheet.pivot.row, { isMeasure: true });
    let isMeasureInColumn = !!find(dataSheet.pivot.column, { isMeasure: true });
    return !(isDimensionInColumn && isDimensionInRow && (isMeasureInRow || isMeasureInColumn));
  }
  return true;
};

/**
 * @method isValidPivot
 * @description  function used to find out that for pivot column should not exceed dimension count than 3
 * @param1 {String} sheetId
 * @param2 {Array} columns
 **/

export const isValidPivot = ({ column, row }) => {
  if (column instanceof Array && row instanceof Array) {
    let isDimensionInColumn1 = !!find(column, { isDimension: true });
    let isDimensionInRow1 = !!find(row, { isDimension: true });
    let isMeasureInRow1 = !!find(row, { isMeasure: true });
    let isMeasureInColumn1 = !!find(column, { isMeasure: true });
    let arrayOfDimensionsInColumn = filter(column, { 'isDimension': true });
    let isPiovt = (isDimensionInColumn1 && isDimensionInRow1 && (isMeasureInRow1 || isMeasureInColumn1));
    if (isPiovt && !!(arrayOfDimensionsInColumn.length > 3)) {
      return false;
    }
  }
  return true;
};

export const isMeasureInRow = (sheetId) => {
  const sheet = getSheet(sheetId);
  if (sheet && sheet.viewType === 'table') {
    let isMeasuresInRow = !!find(sheet.pivot.row, { isMeasure: true });
    return isMeasuresInRow;
  } else {
    return false;
  }
};

export const isDimensionInColumn = (sheetId) => {
  const sheet = getSheet(sheetId);
  if (sheet && sheet.viewType === 'table') {
    return !!find(sheet.pivot.column, { isDimension: true });
  } else {
    return false;
  }
};

export const prepareLabels = (sheetId) => {
  const sheet = getSheet(sheetId);
  if (sheet && sheet.viewType === 'table') {
    let labels = {};
    if (sheet.pivot.row) {
      sheet.pivot.row.forEach(function (row) {
        if (row.isMeasure) {
          labels[row.id] = row.name;
        } else {
          labels[row.id] = row.description;
        }
      });
    }
    if (sheet.pivot.column) {
      sheet.pivot.column.forEach(function (column) {
        if (column.isMeasure) {
          labels[column.id] = column.name;
        } else {
          labels[column.id] = column.description;
        }
      });
    }
    return labels;
  } else {
    return {};
  }
};

export const getAllMeasures = (sheetId) => {
  const sheet = getSheet(sheetId);
  if (sheet && sheet.viewType === 'table') {
    let measures = [];
    if (sheet.pivot.row) {
      sheet.pivot.row.forEach(function (row) {
        if (row.isMeasure) {
          measures.push(row);
        }
      });
    }
    if (sheet.pivot.column) {
      sheet.pivot.column.forEach(function (column) {
        if (column.isMeasure) {
          measures.push(column);
        }
      });
    }
    return measures;
  } else {
    return [];
  }
};
