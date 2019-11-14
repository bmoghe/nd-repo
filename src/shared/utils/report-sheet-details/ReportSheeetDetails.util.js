import { find } from "lodash";
import {
  saveDiscoverDocData,
  aeDiscoverDocData
} from '../../constants/discovery-doc-data/Discovery-doc-data';
import { AE_COLORS_FOR_SHEET } from '../../constants/messages/Messages.constant';

export function getUniqColor(selectedDatasource) {
  const colorCode = find(AE_COLORS_FOR_SHEET, (colorCode) => {
    return !find(selectedDatasource, { color: colorCode });
  });
  return colorCode;
}

export function getUniqKey() {
  return (Math.random().toString(36).substr(2, 9) + '_' + Math.random().toString(36).substr(2, 9)).toUpperCase();
}

function isValidResponse(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
   * @name prepareReportSheetDetails
   * @desc create the report Sheet json from the getSheetDetails API
   * @param {Object} sheet
   * @param {Object} facts
   */
export function prepareReportSheetDetails(sheet, facts) {
  let reportSheet = {};
  const fact = find(facts, { id: sheet.sheetMetadata.factId });
  reportSheet.factId = sheet.sheetMetadata.factId;
  reportSheet.factName = fact ? fact.name : '';
  reportSheet.reportId = sheet.sheetMetadata.id;
  reportSheet.reportName = sheet.sheetMetadata.ObjectName;
  reportSheet.desc = sheet.sheetMetadata.ObjectDescription;
  reportSheet.sheetId = sheet.sheetMetadata.view.id;
  reportSheet.sheetName = sheet.sheetMetadata.view.name;
  reportSheet.measures = sheet.measures.map(measure => {
    measure.isDimension = false;
    measure.isMeasure = true;
    return measure;
  });
  reportSheet.dimensions = sheet.dimensions.map(dimension => {
    dimension.isDimension = true;
    dimension.isMeasure = false;
    return dimension;
  });
  return reportSheet;
}

/**
   * @name loadReport
   * @param {object}
   * @returns {object}
   * @desc function that loads report by calling getReportSheets API & updates join table defination as per reports saved.
   */
export function loadReport(meta, payload) {
  let selectedDataSources = aeDiscoverDocData.data.selectedDataSources;
  let selectedDataSourcesSheet = find(selectedDataSources, { sheetId: meta.sheetId });
  let response;
  let isValid = isValidResponse(payload.response);
  if (isValid) {
    response = JSON.parse(payload.response);
  }
  if (response instanceof Object && response.sheetMetadata) {
    selectedDataSourcesSheet.dimensions = response.dimensions.map(dimension => {
      dimension.isDimension = true;
      dimension.isMeasure = false;
      return dimension;
    });
    selectedDataSourcesSheet.measures = response.measures.map(measure => {
      measure.isDimension = false;
      measure.isMeasure = true;
      return measure;
    });
  }
  saveDiscoverDocData("selectedDataSources", selectedDataSources);
}
