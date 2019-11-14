import { message } from "antd";
import { find } from "lodash";

export const prepareDataNotAvailableMessages = (params) => {
  message.destroy();
  message.warn(`Data not availabe for ${params ? params : 'selected datasource'}`);
};

export const prepareDataSourceDetails = (data) => {
  let dataSrc = {};
  if (data) {
    dataSrc["factId"] = data.dataObject.fid;
    dataSrc["bioid"] = data.dataObject.bioid;
    // dataSrc.factName = fact ? fact.name : '';
    // dataSrc.reportId = sheet.sheetMetadata.id;
    // dataSrc.reportName = sheet.sheetMetadata.ObjectName;
    dataSrc["doid"] = data.dataObject.dataobjectID;
    dataSrc.desc = data.dataObject.description;
    dataSrc["sheetId"] = data.dataObject.dataobjectID;
    dataSrc["sheetName"] = data.dataObject.dataobjectName;
    dataSrc["dataobjectName"] = data.dataObject.dataobjectName;
    dataSrc["reportPath"] = data.dataObject.reportPath;

    if (data.mea !== "") {
      dataSrc["measures"] = data.measures.map(measure => {
        measure.isDimension = false;
        measure.isMeasure = true;
        return measure;
      });
    } else {
      dataSrc["measures"] = [];
    }
    if (data.row !== "") {
      dataSrc["dimensions"] = data.dimensions.map(dimension => {
        dimension.isDimension = true;
        dimension.isMeasure = false;
        return dimension;
      });
    } else {
      dataSrc["dimensions"] = [];
    }
  }
  return dataSrc;
};

export const prepareListofDataSources = (list, alreadySelectedList) => {
  if (list.length) {
    return list.map((item) => {
      const isItem = find(alreadySelectedList, (value) => {
        return item.dataobjectID === value.doid;
      });
      if (isItem) {
        item.disabled = true;
      } else {
        item.disabled = false;
      }
      return item;
    });
  } else {
    return [];
  }
};

export const checkStatus = (status) => {
  if (status === 200) {
    return true;
  } else {
    message.destroy();
    message.error("Service not available");
    return false;
  }
};

export const checkPreviewStatus = (payload) => {
  if (payload.status === 200) {
    if (payload.data !== "") {
      return true;
    }
    // message.destroy();
    // message.error("Data not available");
    return false;
  }
  message.destroy();
  message.error("Service not available");
  return false;
};
