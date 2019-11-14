/** @module PrepareGridData */
import * as lodash from 'lodash';
import numeral from 'numeral';
import {
  aeDiscoverDocData,
  saveDiscoverDocData,
  getSheet
} from '../../constants/discovery-doc-data/Discovery-doc-data';
import { ParamsGenerator2 } from '../params-generator/ParamsGenerator2';
import { joinTypes, pageConfig } from '../../../components/data-preparation/constants/DataPreparationConstant';

const createColumnDef = () => {
  let columnDefs = [];
  lodash.forEach(aeDiscoverDocData.data.join, (node) => {
    const meaDim = lodash.concat(node.data.dimensions, node.data.measures);
    lodash.forEach(meaDim, (attr) => {
      columnDefs.push({
        field: attr.id,
        headerName: attr.attributeName || attr.name,
        headerComponentParams: {
          template: headerTemplate(node.data.color)
        },
        cellStyle: function (params) {
          return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
        }
      });
    });
  });
  return columnDefs;
};

export const prepareRowData = (data) => {
  let newRowData = [];
  lodash.forEach(data.data, row => {
    let attrData = {};
    lodash.map(row, (value, key) => {
      attrData[data.metadata[key]] = value;
    });
    newRowData.push(attrData);
  });
  return newRowData;
};

export const prepareDataTable = (data) => {
  let columnDefs = createColumnDef();
  const rowData = prepareRowData(data);
  return { columnDefs, rowData: rowData ? rowData : [] };
};

/**
 * @name headerTemplate
 * @desc return string which contain dom. headerTemplate used to show custom color.
 * @param {String} color
 **/
function headerTemplate(color) {
  return '<div class="ag-cell-label-container" role="presentation" style="border-bottom: 2px solid ' + color + '">' +
    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>' +
    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>' +
    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>' +
    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>' +
    '    <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>' +
    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
    '  </div>' +
    '</div>';
}

/**
 * @name PrepareGridData
 * @desc creates gridData by calling createColumnDefs & createRowData methods & return the same
 * @param {object} data
 * @param {object} gridData
 **/
export function PrepareGridData(data) {
  if (data.metaData instanceof Object) {
    let gridData = createColumnRowData(data);
    return gridData;
  } else {
    return { columnDefs: [], rowData: [] };
  }
}

/**
 * @name createColumnDefs
 * @desc creates column defination of grid
 * @param {object} data
 * @param {array} columnDefs
 **/
export function createColumnRowData(data) {
  let obj = initializeRowCol(data);
  let rawCol = obj.rawCol;
  let rawRow = obj.rawRow;
  let columnDefs = [];
  let rowData = [];
  lodash.forEach(rawCol, (value) => {
    let attr;
    attr = lodash.find(aeDiscoverDocData.data.publishedDataModel.dimensions, { id: value.name });
    if (!(attr instanceof Object)) {
      attr = lodash.find(aeDiscoverDocData.data.publishedDataModel.measures, { id: value.name.split("|")[0] });
    }
    if (attr) {
      const name = attr.attributeName ? attr.attributeName : `${value.name.split("|")[1] ? value.name.split("|")[1] : ''} ${attr.name}`;
      columnDefs.push({
        colId: attr.id,
        // dmId: attr.id,
        headerName: name,
        field: lodash.camelCase(`${attr.id}${attr.attributeName || attr.name}`),
        isDimension: attr.isDimension,
        isMeasure: attr.isMeasure,
        cellStyle: (params) => {
          return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
        }
      });
    } else if (value.name === "latitude" || value.name === "longitude") {
      columnDefs.push({
        colId: value.name,
        // dmId: value.name,
        headerName: value.name,
        field: `${value.id}${value.name}`,
        headerComponentParams: {
          template: headerTemplate("#ffffff")
        },
        cellStyle: (params) => {
          return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
        }
      });
    }
  });

  lodash.forEach(rawRow, (value) => {
    let temp = {};
    lodash.forEach(value, (item, key) => {
      if (columnDefs[key]) {
        temp[columnDefs[key].field] = value[key];
      }
    });
    rowData.push(temp);
  });

  let gridData = {};
  if (data.summaries) {
    lodash.forEach(data.summaries, (value, key) => {
      let row = {};
      let count = 0;
      columnDefs.forEach((column, index) => {
        if (column.isMeasure) {
          row[column.field] = value[count];
          count++;
        } else {
          row[column.field] = index === 0 ? key : '';
        }
      });
      rowData.push(row);
    });
  }
  gridData.columnDefs = columnDefs;
  gridData.rowData = rowData;
  return lodash.cloneDeep(gridData);
}

/**
 * @name initializeRowCol
 * @desc initialize row & col as per data provided
 * @param {object} data
 * @param {object}
 **/
export function initializeRowCol(data) {
  let rawCol = [];
  let rawRow = [];
  if (lodash.keys(data).length > 0) {
    rawCol = data.metaData.fields;
    rawRow = data.data;
  } else {
    rawCol = [];
    rawRow = [];
  }
  return { rawCol: rawCol, rawRow: rawRow };
}

const generateReport = (data) => {
  let report = data;
  if (!report.columns) {
    report.columns = data.dimensions;
  }
  if (!report.filters) {
    report.filters = [];
  }
  if (!report.groups) {
    report.groups = [];
  }
  return report;
};

const prepareRelationItems = (mappedAttr) => {
  let relationItems = [];
  lodash.forEach(mappedAttr, (value) => {
    const leftItemId = value.leftItem.id;
    const rightItemId = value.rightItem.id;
    relationItems.push({ leftItemId, rightItemId });
  });
  return relationItems;
};

const prepareAssocition = (connections, dataJoin) => {
  let association = [];
  lodash.forEach(connections, (value) => {
    const id = dataJoin[value.id].data.doid;
    const joinType = value.joinType;
    const relationItems = prepareRelationItems(value.mappedAttr);
    association.push({ id, joinType, relationItems });
  });
  return association;
};

export const previewDataOfDataJoinRequest = () => {
  let dataJoin = lodash.cloneDeep(aeDiscoverDocData.data.join);
  let dataJoinRequest = { requestJoins: [], reports: [] };
  lodash.forEach(dataJoin, (value) => {
    if (value.connections.length) {
      const id = value.data.doid;
      const name = value.name;
      const associations = prepareAssocition(value.connections, dataJoin);
      dataJoinRequest.requestJoins.push({ id, name, associations });
    }
    let report = ParamsGenerator2.getParams(generateReport(value.data));
    report.sheetid = value.data.sheetId;
    report.fid = value.data.factId;
    report.bioid = value.data.bioid;
    report.doid = value.data.doid;
    report.sheetName = value.data.sheetName;
    dataJoinRequest.reports.push(report);
  });
  saveDiscoverDocData('previewRequest', dataJoinRequest);
};

/**
 * @name updateRequest
 * @desc function that update the object passed to it & returns the same
 * @param {object} report
 * @returns {object} report
 */
const updateRequest = (report) => {
  report.bioid = null;
  report.in_val = "[]";
  report.currency = null;
  report.rate = null;
  report.currencyDate = "T";
  report.filter = null;
  report.mea = report.mea || '';
  return report;
};


const generateJoin = (sourceData, targetData, mappedAttributes, type) => {
  let join = {};
  join.type = lodash.find(joinTypes, { id: type }).type;
  join.factId = sourceData.factId;
  join.on = [];
  if (mappedAttributes) {
    for (let i = 0, len = mappedAttributes.length; i < len; i++) {
      join.on.push([mappedAttributes[i].leftItem.id, mappedAttributes[i].rightItem.id]);
    }
    join.sIds = [sourceData.sheetId, targetData.sheetId];
  }
  return join;
};

/**
 * @name AeDataPreparation#updateDiscoverySheets
 * @param {object} newJoin
 * @desc function that update DiscoverySheets as per new/updated join
 */
const updateDiscoverySheets = (newJoin) => {
  let sheets = aeDiscoverDocData.data.sheets;
  lodash.forEach(sheets, function (sheet) {
    if (sheet.type === "DISCOVERY_SHEET" && sheet.joinRequest) {
      sheet.joinRequest.join = newJoin;
    }
  });
  saveDiscoverDocData("sheets", sheets);
};

const callJoinAPI = (data, paramPageConfig) => {
  if (data.join && data.reports) {
    let obj = {};
    obj.join = data.join;
    obj.reports = data.reports;
    obj.source = "report";
    saveDiscoverDocData("joinRequest", obj);
    lodash.forEach(obj.join, function (item) {
      delete item.sIds;
    });
    updateDiscoverySheets(obj.join);
    let request = {};
    request.intersect = JSON.stringify(obj);
    request.plimit = paramPageConfig ? paramPageConfig.plimit : pageConfig.plimit;
    request.page = paramPageConfig ? paramPageConfig.page : pageConfig.page;
    request.pstart = paramPageConfig ? paramPageConfig.pstart : pageConfig.pstart;
  } else {
    data.plimit = paramPageConfig ? paramPageConfig.plimit : pageConfig.plimit;
    data.page = paramPageConfig ? paramPageConfig.page : pageConfig.page;
    data.pstart = paramPageConfig ? paramPageConfig.pstart : pageConfig.pstart;
  }
};

export const prepareJoinRequest = (parameters, mappedAttributes, type) => {
  let join = aeDiscoverDocData.data.joinRequest && aeDiscoverDocData.data.joinRequest.join ? aeDiscoverDocData.data.joinRequest.join : [];
  let alreadyExists = false;
  let index;
  lodash.forEach(join, function (item, key) {
    if (item.sIds[0] === parameters.source.id.split("AE_")[1] && item.sIds[1] === parameters.target.id.split("AE_")[1]) {
      alreadyExists = true;
      index = key;
    }
  });
  let newJoin = generateJoin(parameters.source.data, parameters.target.data, mappedAttributes, type);
  if (alreadyExists) {
    join[index] = newJoin;
  } else {
    join.push(newJoin);
  }

  let reports = aeDiscoverDocData.data.joinRequest && aeDiscoverDocData.data.joinRequest.reports ? aeDiscoverDocData.data.joinRequest.reports : [];
  reports = checkSheetIdAlreadyExists(reports, parameters.source.data);
  reports = checkSheetIdAlreadyExists(reports, parameters.target.data);
  callJoinAPI({ join: join, reports: reports });
  return join;

};


const checkSheetIdAlreadyExists = (reports, data) => {
  let sheetIdExists = lodash.find(reports, { sheetid: data.sheetId });
  let report = {};
  if (sheetIdExists) {
    return reports;
  } else {
    report = ParamsGenerator2.getParams(generateReport(data));
    report.sheetid = data.sheetId;
    report.fid = data.factId;
    reports.push(updateRequest(report));
  }
  return reports;
};

// =======================>  PIVOT GRID PREPARATION UTILITIES  <=============================

// Format the column values if they are numbers
function columnValueFormatter(sheetId, item, params) {
  const sheet = getSheet(sheetId);
  let value = params.value;
  let formatConfig = {};
  if (item.isMeasure && item.displayProperties && item.displayProperties.numberFormat) {
    value = numeral(value).format(item.displayProperties.numberFormat);
  }
  if (sheet && sheet.pivot.metaData && sheet.pivot.metaData.formatConfig) {
    formatConfig = lodash.find(sheet.pivot.metaData.formatConfig, { field: params.column.colDef.field });
    if (formatConfig) {
      value = numeral(value).format(formatConfig.format);
    }
  }
  return value;
}

// Prepare the column definations
export function getColumnDefinition(tempgridData, pivot) {
  let tempColumnDefs = [];

  lodash.each(pivot.row, (item) => {
    let col = lodash.find(tempgridData.columnDefs, { colId: item.id });
    if (col) {
      if (item.isMeasure) {
        col.isMeasure = true;
      }
      if (item.isDimension) {
        col.isDimension = true;
      }
      tempColumnDefs.push(col);
    }
  });

  let columnMeasureExists = false;
  lodash.each(pivot.column, (item) => {
    let col = lodash.find(tempgridData.columnDefs, { colId: item.id });
    if (col) {
      col.isPivot = true;
      if (item.isMeasure) {
        columnMeasureExists = true;
        col.isMeasure = true;
      }
      if (item.isDimension) {
        col.isDimension = true;
      }
      tempColumnDefs.push(col);
    }
  });

  let tempdata = {};
  tempdata.tempColumnDefs = tempColumnDefs;
  tempdata.columnMeasureExists = columnMeasureExists;
  return tempdata;
}

// Prepare the row data and for measures in column
export function getGridDataForColumnMeasure(tempgridData, dataSheet) {
  lodash.each(dataSheet.pivot.row, (item) => {
    let col = lodash.find(tempgridData.columnDefs, { colId: item.id });

    if (col && item.isMeasure) {
      col['aggFunc'] = 'sum';
      col['cellStyle'] = function (params) {
        return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
      };
    } else if (col && item.isDimension) {
      col['rowGroup'] = true;
      col['cellStyle'] = function () {
        return { backgroundColor: '#e7e7e7' };
      };
    } else if (col) {
      col['pivot'] = true;
    }

    if (col && item.isMeasure) {
      col['valueFormatter'] = columnValueFormatter.bind(this, dataSheet.id, item);
    }
    col['menuTabs'] = ['generalMenuTab', 'columnsMenuTab'];
  });

  lodash.each(dataSheet.pivot.column, (item) => {
    let col = lodash.find(tempgridData.columnDefs, { colId: item.id });

    if (col && item.isMeasure) {
      col['aggFunc'] = 'sum';
      col['cellStyle'] = function (params) {
        return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
      };
    } else if (col) {
      col['pivot'] = true;
    }
    if (col && item.isMeasure) {
      col['valueFormatter'] = columnValueFormatter.bind(this, dataSheet.id, item);
    }
    col['menuTabs'] = ['generalMenuTab', 'columnsMenuTab'];
  });

  return tempgridData;
}

// Prepare the row data and for measures in row
export function getGridDataForRowMeasure(tempColumnDefs, tempgridData, dataSheet) {
  let tempList = lodash.filter(tempColumnDefs, (item) => {
    return item.isDimension === true;
  });
  let measureExists = lodash.filter(tempColumnDefs, (item) => {
    return item.isMeasure === true;
  });
  if (measureExists && measureExists.length > 0) {
    tempList.push({
      colId: 'measureName',
      field: 'measureName',
      headerName: '',
      isDimension: true,
      suppressMenu: true
    });

    tempList.push({
      colId: 'measureValue',
      field: 'measureValue',
      headerName: '',
      isMeasure: true,
      suppressMenu: true
    });
  }

  let rows = [];
  lodash.each(tempgridData.rowData, (rowItem) => {
    let tempRowData = {};
    let tempDims = [];
    lodash.forEach(rowItem, (item, key) => {
      let fieldValue = item;
      let fieldName = key;
      let col = lodash.find(tempColumnDefs, { field: fieldName });
      if (col) {
        if (col.isDimension && col.isDimension === true) {
          tempRowData[fieldName] = fieldValue;
          tempDims = [];
          tempDims.push(Object.assign({}, tempRowData));
        }
        if (col.isMeasure && col.isMeasure === true) {
          if (col.isPivot) {
            tempRowData['measureName'] = "";
          } else {
            tempRowData['measureName'] = col.headerName;
          }

          tempRowData['measureValue'] = fieldValue;
          rows.push(tempRowData);

          tempRowData = {};
          lodash.forEach(rowItem, (item, key) => {
            let col = lodash.find(tempList, { field: key });
            if (col) {
              tempRowData[key] = item;
            }

          });

        }
      }

    });
  });

  lodash.each(tempList, (item) => {
    if (item.isMeasure) {
      item['aggFunc'] = 'sum';
      item['valueFormatter'] = columnValueFormatter.bind(this, dataSheet.id, item);
      item['cellStyle'] = function (params) {
        return lodash.isNumber(params.value) ? { textAlign: 'right' } : { textAlign: 'left' };
      };
    } else if (item.field === "measureName") {
      item['rowGroup'] = true;
    } else if (item.isDimension && item.field !== "measureName") {
      if (item.isPivot) {
        item["pivot"] = true;
      } else {
        item['rowGroup'] = true;
        item["hide"] = true;
        item['cellStyle'] = function () {
          return { backgroundColor: '#e7e7e7' };
        };
      }
    }
    item['menuTabs'] = ['generalMenuTab', 'columnsMenuTab'];
  });

  tempgridData.columnDefs = tempList;
  tempgridData.rowData = rows;

  return tempgridData;
}

// Prepare the row data for the pivot as per the column and row dropped items (Dimesions/Measures)
export function preparePivotGrid(dataSheet) { // TODO: Optimize function
  let { gridData } = dataSheet;
  let tempgridData = Object.assign({}, gridData);

  if (tempgridData && dataSheet.viewType === 'table') {
    let tempdata = getColumnDefinition(tempgridData, dataSheet.pivot);
    let tempColumnDefs = tempdata.tempColumnDefs;
    let columnMeasureExists = tempdata.columnMeasureExists;

    if (columnMeasureExists) {
      tempgridData = getGridDataForColumnMeasure(tempgridData, dataSheet);
    } else {
      tempgridData = getGridDataForRowMeasure(tempColumnDefs, tempgridData, dataSheet);
    }
  }
  return lodash.cloneDeep(tempgridData);
}

// Prepare the simple table if the row and column dropped item are in certain conditions
export function prepareSimpleGrid(dataSheet) {
  let { gridData } = dataSheet;
  gridData.columnDefs.forEach(item => {
    let isMeasure = item.colId.split('_').length;
    if (isMeasure === 1) {
      const data = lodash.find(aeDiscoverDocData.data.publishedDataModel.measures, { id: item.colId });
      return item['valueFormatter'] = columnValueFormatter.bind(this, dataSheet.id, data);
    }
  });
  return lodash.cloneDeep(gridData);
}
