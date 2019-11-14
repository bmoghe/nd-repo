import { cloneDeep, keys, forEach, isEqual, isString, find } from 'lodash';
import uuid from 'uuid';
import initialState from '../../../reducers/initialState';

export const getId = (url) => {
  let params = {};
  let access_token = localStorage.getItem(window.location.host + '_access_token');
  let SheetID = url.split("#document/")[1];
  let CollectionID = url.split("#document?collection_id=")[1];
  if (SheetID) {
    params.SheetID = SheetID;
    params.CollectionID = null;
  } else if (CollectionID) {
    params.SheetID = null;
    params.CollectionID = CollectionID;
  }
  params.access_token = access_token;
  return params;
};

export let aeDiscoverDocData = {
  data: {
    sheets: [],
    selectedDataSources: [],
    join: {},
    DataJoinData: {},
    MeasureMinMaxValue: [],
    isEditable: true,
    isEdited: false,
    isDataJoinDrawerOpen: true,
    isDatapreparationOpen: true
  },
  CollectionID: getId(window.location.href).CollectionID
};

export let aeDiscoverySavedData = {
  data: {
    sheets: [],
    selectedDataSources: [],
    join: {},
    DataJoinData: {},
    MeasureMinMaxValue: [],
    isEditable: false,
    name: "Untitled"
  }
};

export function updateAeDiscoverySavedData(newValue) {
  aeDiscoverySavedData = cloneDeep(newValue);
};

export function setDiscoverDocData(newValue) {
  aeDiscoverDocData = newValue;
};

export function saveDiscoveryDoc(data) {
  updateAeDiscoverySavedData(data);
  data.editable = data.editable === 'Y';
  data.favorite = data.favorite === 'Y';
  setDiscoverDocData(data);
};

export const getListOfDataModelID = (dataModelsUsedInJoins) => {
  let listOfDataModelIds = [];
  const keys = Object.keys(dataModelsUsedInJoins);
  keys.forEach(value => listOfDataModelIds.push(value.replace('AE_', '')));
  return listOfDataModelIds;
};

const getJoinData = (join, dataObjectID) => {
  const id = `AE_${dataObjectID}`;
  return join[id].data;
};

const getReport = (listOfReports, dataObjectID) => {
  const report = find(listOfReports, { doid: dataObjectID });
  return { ...report };
};

export const updateDiscoveryDoc = (discoveryDocData, data) => {
  let discoveryDoc = { ...discoveryDocData };
  let { join, previewRequest } = discoveryDoc.data;
  let reports = [];
  // let listOfDataModelIds = getListOfDataModelID(join);
  data.forEach((value) => {
    let joinData = getJoinData(join, value.dataObject.dataobjectID);
    let report = getReport(previewRequest.reports, value.dataObject.dataobjectID);
    joinData.dimensions = value.dimensions;
    joinData.measures = value.measures;
    report.row = value.dataObject.row;
    report.mea = value.dataObject.mea;
    reports.push(report);
  });
  discoveryDoc.data.join = join;
  discoveryDoc.data.previewRequest.reports = reports;
  return discoveryDoc;
};

export function saveMappedAttrInDoc(connection, mappedAttributes) {
  const data = find(aeDiscoverDocData.data.join[connection.sourceId].connections, { id: connection.targetId });
  data.mappedAttr = mappedAttributes;
};

export function saveJoinType(sourceId, targetId, type) {
  find(aeDiscoverDocData.data.join[sourceId].connections, { id: targetId }).joinType = type;
};

export function saveDiscoverDocData(setTo, value) {
  switch (setTo) {
    case 'setFavourite':
      aeDiscoverDocData.favorite = cloneDeep(value);
      break;
    case 'dataSheet':
      aeDiscoverDocData.data.sheets = cloneDeep(value);
      break;
    case 'selectedDataSources':
      aeDiscoverDocData.data.selectedDataSources = cloneDeep(value);
      break;
    case 'node':
      aeDiscoverDocData.data.join = cloneDeep(value);
      if (keys(value).length <= 1) {
        aeDiscoverDocData.data.DataJoinData = {};
      }
      break;
    case 'DataJoinData':
      aeDiscoverDocData.data.DataJoinData = cloneDeep(value);
      break;
    case 'joinRequest':
      aeDiscoverDocData.data.joinRequest = cloneDeep(value);
      break;
    case 'previewRequest':
      aeDiscoverDocData.data.previewRequest = cloneDeep(value);
      break;
    case 'dataModelId':
      aeDiscoverDocData.data.REPORTID = cloneDeep(value);
      break;

    case 'newDataSheet':
      aeDiscoverDocData.data.sheets.push(cloneDeep(value));
      break;
    case 'MeasureMinMaxValue':
      aeDiscoverDocData.data.MeasureMinMaxValue = cloneDeep(value);
      break;
    case 'isEditable':
      aeDiscoverDocData.data.isEditable = cloneDeep(value);
      break;
    case 'isEdited':
      aeDiscoverDocData.data.isEdited = cloneDeep(value);
      break;
    case 'isDataJoinDrawerOpen':
      aeDiscoverDocData.data.isDataJoinDrawerOpen = cloneDeep(value);
      break;
    case 'id':
      aeDiscoverDocData.id = cloneDeep(value);
      break;
    case 'name':
      aeDiscoverDocData.name = cloneDeep(value);
      break;
    case 'corporate':
      aeDiscoverDocData.corporate = cloneDeep(value);
      break;
    case 'description':
      aeDiscoverDocData.description = cloneDeep(value);
      break;
    case 'publishedDataModel':
      aeDiscoverDocData.data.publishedDataModel = cloneDeep(value);
      break;
    case 'joinRequestWithNewFid':
      aeDiscoverDocData.data.joinRequestWithNewFid = cloneDeep(value);
      break;
    case 'opList':
      aeDiscoverDocData.data.opList = cloneDeep(value);
      break;
    case 'UPDATE_SUMMERIES_AT_COLUMN_LEVEL':
      forEach(aeDiscoverDocData.data.sheets, (sheet) => {
        if (sheet.id === value.sheetId) {
          if (sheet.columnLevelSummaries) {
            sheet.columnLevelSummaries[value.type] = cloneDeep(value.checked);
          } else {
            sheet['columnLevelSummaries'] = cloneDeep(initialState.dataSheet.columnLevelSummaries);
            sheet.columnLevelSummaries[value.type] = cloneDeep(value.checked);
          }
          // if (!isMeasureInRow(sheet.id) && !find(sheet.pivot.column, { isMeasure: true })) {
          //   message.destroy();
          //   message.warning('Select a measure for Summary');
          // }
        }
      });
      // updateSheetJoinRequest(value.sheetId);
      setTimeout(() => {
        value.applyFilter(value.sheetId);
      }, 0);
      break;
    case 'isDatapreparationOpen':
      aeDiscoverDocData.data.isDatapreparationOpen = cloneDeep(value);
      break;
    case 'saveRangesList':
      forEach(aeDiscoverDocData.data.sheets, (sheet) => {
        if (value.sheetId === sheet.id) {
          if (sheet.pivot.metadata) {
            sheet.pivot.metadata.rangesList[value.columnId] = value.rangesList[value.columnId];
          } else if (sheet.pivot) {
            sheet.pivot.metadata = { rangesList: value.rangesList };
          }
        }
      });
      break;
    default:
      break;
  }
};

export const aeNavigationConstants = {
  HOME: 'home',
  DATA_PREPARATION: 'dataPreparation',
  DISCOVERY_SHEET: 'discoverySheet',
  MULTI_VIEW_SHEET: 'multiViewSheet',
};

export let documentDetails = {
  SheetID: null,
  CollectionID: null,
  projectID: null,
  access_token: null,
};

export function preparePublishAndUpdateRequest() {
  let reports = [];
  let request = {};
  let requestJoins = aeDiscoverDocData.data.previewRequest.requestJoins;
  let dataObjectName = aeDiscoverDocData.data.publishedDataModel.dataObject.dataobjectName;
  let description = aeDiscoverDocData.data.publishedDataModel.dataObject.description;
  let dataobjectID = aeDiscoverDocData.data.publishedDataModel.dataObject.dataobjectID;
  description = description ? description : '""';

  forEach(aeDiscoverDocData.data.previewRequest.reports, (rprt) => {
    const data = find(aeDiscoverDocData.data.publishedDataModel.dataObject.reports, { doid: rprt.doid });
    let report = cloneDeep(rprt);
    report["operation"] = data ? "UPDATE" : "NEW";
    reports.push(report);
  });
  request = { dataobjectID, dataObjectName, description, reports, requestJoins };
  return cloneDeep(request);
};

export function savePublishedDataModelDetails(response) {
  if (response.data) {
    forEach(response.data.dimensions, (item) => {
      item.isDimension = true;
      /**
       * Changes to extract sheet names for the dimensions -> DD-498
       **/
      if (item.dataSource && item.dataSource.sheets) {
        let sheet = item.dataSource.sheets;
        if (sheet.length >= 1)
          item.dimSheetName = sheet.map(key => key.name);
      }
    });
    forEach(response.data.measures, (item) => {
      item.isMeasure = true;
      /**
       * Changes to extract sheet names for the measures -> DD-498
       **/
      if (item.dataSource && item.dataSource.sheets) {
        let sheet = item.dataSource.sheets;
        if (sheet.length >= 1)
          item.mesSheetName = sheet.map(key => key.name);
      }
    });
    saveDiscoverDocData("publishedDataModel", response.data);
    let { dataObject } = response.data;
    let joinRequestWithNewFid = {
      "sheetid": dataObject.sheetid ? dataObject.sheetid : "",
      "bioid": dataObject.bioid,
      "fid": dataObject.fid,
      "row": "",
      "col": "",
      "mea": "",
      "filter": null,
      "sort": "",
      "dir": "",
      "page": 1,
      "pstart": 0,
      "plimit": 100,
      "source": "discovery",
      "in_val": [],
      "currency": "",
      "rate": "",
      "currencyDate": "T",
      "requestID": uuid().toUpperCase()
    };
    saveDiscoverDocData("joinRequestWithNewFid", joinRequestWithNewFid);
  }
};

export function updateRequestForColumnSummaries(data, sheetId, droppedSheetId) {
  const sheet = find(aeDiscoverDocData.data.sheets, { id: sheetId });
  if (sheet.type === "DISCOVERY_SHEET") {
    let aggregateFunctionData = [];
    forEach(sheet.columnLevelSummaries, (value, key) => {
      if (value) {
        aggregateFunctionData.push(key);
      }
    });
    if (aggregateFunctionData.length && sheet.viewType !== "chart") {
      data.rptaggfn = aggregateFunctionData.join(",");
    } else {
      delete data.rptaggfn;
    }
  } else if (sheet.type === "MULTIVIEW_SHEET") {
    const droppedSheet = find(sheet.droppedSheets, { sheetId: droppedSheetId });
    const dataOfDroppedSheet = find(aeDiscoverDocData.data.sheets, { id: droppedSheetId });
    if (droppedSheet.viewTypeOnMVS !== "chart" && dataOfDroppedSheet.columnLevelSummaries) {
      let aggregateFunctionData = [];
      forEach(dataOfDroppedSheet.columnLevelSummaries, (value, key) => {
        if (value) {
          aggregateFunctionData.push(key);
        }
      });
      data.rptaggfn = aggregateFunctionData.join(",");
    } else {
      delete data.rptaggfn;
    }
  }
  return data;
};


const handleDefaultSheet = (data) => {
  let defaultSheet = find(data.sheets, { 'isDefault': true });
  if (defaultSheet) {
    forEach(data.sheets, (sheet) => {
      sheet.isActive = (sheet.id === defaultSheet.id);
    });
    data.isDatapreparationOpen = false;
  }
  return data;
}
// prepare the request payload to save all data as discovery document
export const prepareDiscoveryDocument = (name, desc, id, corporate) => {
  let data = cloneDeep(aeDiscoverDocData.data);
  data.DataJoinData = null;
  delete data.publishedDataModel;
  forEach(data.sheets, (sheet) => {
    if (sheet.type === "DISCOVERY_SHEET") {
      sheet.gridData = {};
      delete sheet.rankData;
      delete sheet.rankFields;
    }
  });
  data = handleDefaultSheet(data);
  let discoveryObj = {
    corporate: corporate,
    name: name ? name : aeDiscoverDocData.name,
    type: "discovery",
    description: isString(desc) ? desc : aeDiscoverDocData.description,
    data: data,
    id: "",
    oid: "",
    measureList: "",
    factId: "",
    tags: "",
    CollectionID: aeDiscoverDocData.CollectionID,
    filters: "",
    report_request_data: []
  };
  if (id) {
    discoveryObj.id = aeDiscoverDocData.id;
    return discoveryObj;
  } else {
    return discoveryObj;
  }
};

/**
 * @name isDiscoverDocUpdated
 * @desc function that comapares two objects aeDiscoverDocData & aeDiscoverySavedData and
 * returns boolean depending on is anything changed in aeDiscoverDocData.
 **/
export function isDiscoverDocUpdated() {
  let temp1 = cloneDeep(aeDiscoverDocData);
  let temp2 = cloneDeep(aeDiscoverySavedData);
  delete temp1.data.isEditable;
  delete temp1.data.isEdited;
  delete temp1.corporate;
  delete temp1.tags;
  temp1.data.DataJoinData = {};
  temp1.data.MeasureMinMaxValue = [];
  temp1.data.joinRequest = "";

  delete temp2.data.isEditable;
  delete temp2.data.isEdited;
  delete temp2.corporate;
  delete temp2.tags;
  temp2.data.DataJoinData = {};
  temp2.data.MeasureMinMaxValue = [];
  temp2.data.joinRequest = "";

  forEach(temp1.data.selectedDataSources, function (dataSource) {
    dataSource.dimensions = [];
    dataSource.measures = [];
  });
  forEach(temp2.data.selectedDataSources, function (dataSource) {
    dataSource.dimensions = [];
    dataSource.measures = [];
  });

  forEach(temp1.data.sheets, function (sheet) {
    if (sheet.type === "DISCOVERY_SHEET")
      sheet.gridData = {};
  });
  forEach(temp2.data.sheets, function (sheet) {
    if (sheet.type === "DISCOVERY_SHEET")
      sheet.gridData = {};
  });
  return isEqual(temp1.data, temp2.data);
};


export function preparesaveAsDiscoveryPublish(name, desc, corporate) {
  let data = cloneDeep(aeDiscoverDocData.data);
  let discoveryObj = {
    corporate: corporate,
    name: name ? name : aeDiscoverDocData.name,
    type: "discovery",
    description: isString(desc) ? desc : aeDiscoverDocData.description,
    data: data,
    id: "",
    oid: "",
    measureList: "",
    factId: "",
    tags: "",
    saveAsDiscoveryId: data.joinRequestWithNewFid.bioid,
    filters: "",
    report_request_data: []
  };
  let { previewRequest } = data;
  let request = {
    dataModel: previewRequest,
    discoveryDoc: discoveryObj
  };
  request.dataModel.dataObjectName = name;
  request.dataModel.description = desc;
  request.dataModel.dataobjectID = null;
  forEach(request.dataModel.reports, (report) => {
    report.operation = "NEW";
  });
  return request;
};

export const getIsDataJoinEditable = () => {
  const isReportId = !!aeDiscoverDocData.data.REPORTID;
  const isPublishedDataModel = !!aeDiscoverDocData.data.publishedDataModel;
  const joinKeys = keys(aeDiscoverDocData.data.join);
  const existJoinLength = aeDiscoverDocData.data.publishedDataModel ? aeDiscoverDocData.data.publishedDataModel.dataObject.reports.length : 0;
  return isReportId && (isPublishedDataModel && (existJoinLength === joinKeys.length && isEqual(aeDiscoverDocData.data.previewRequest.requestJoins, aeDiscoverDocData.data.publishedDataModel.dataObject.requestJoins)));
};

/**
 * @name getSheet
 * @param {string} id
 * @desc function that returns sheet of passed id to it.
 */
export const getSheet = (id) => {
  const result = find(aeDiscoverDocData.data.sheets, { id: id });
  if (result && result.type === "DISCOVERY_SHEET") {
    return result;
  }
  return result;
};

/**
 * @name getClassName
 * @desc function that returns className depends on value of isEditable
 * @param {boolean} isEditable
 */
export function getClassName(isEditable) {
  if (isEditable) {
    return "";
  } else {
    return "non-editable";
  }
}
export default aeDiscoverDocData;