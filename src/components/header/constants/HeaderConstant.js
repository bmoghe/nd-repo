import { cloneDeep, find, forEach, uniqBy } from 'lodash';
import { aeDiscoverDocData } from '../../../shared/constants/discovery-doc-data/Discovery-doc-data';

export const HeaderTooltipText = {
  CLOSE: 'Close',
  REMOVE_FAVOURITE: 'Remove from favourites',
  MARK_FAVOURITE: 'Mark as favourite',
  SHARE: 'Share'
};


export const aeDiscoveryHeaderTooltipText = {
  CLOSE: 'Close',
  REMOVE_FAVOURITE: 'Remove from favourites',
  MARK_FAVOURITE: 'Mark as favourite',
  SHARE: 'Share'
};

export function createNewDiscoveryStore(payload, meta) {
  let discoveryDocObj = cloneDeep(aeDiscoverDocData);
  let mappingJSON = generateMappingJSON(discoveryDocObj, payload);
  let newDiscoveryStore = replaceIds(discoveryDocObj, mappingJSON);
  newDiscoveryStore.name = meta.discoveryDoc.name;
  newDiscoveryStore.description = meta.discoveryDoc.description;
  newDiscoveryStore.corporate = meta.discoveryDoc.corporate;
  newDiscoveryStore.factId = payload.data.dataObject.fid;
  return { newDiscoveryStore, mappingJSON };
}


export function getCustomDimensionMeasures(discoveryDocObj) {
  let dimensionAttrList = discoveryDocObj.data.publishedDataModel.dimensions.filter(function (m) {
    return m.custom === true;
  });
  let measureList = discoveryDocObj.data.publishedDataModel.measures.filter(function (d) {
    return d.custom === true;
  });
  return { measureList, dimensionAttrList };
}

export function generateMappingJSON(discoveryDocObj, payload) {
  let mappingJSON = [];
  //mapping for dimensions
  forEach(payload.data.dimensions, (dimension) => {
    if (dimension.dataSource && dimension.dataSource.oldId) {
      let temp = find(discoveryDocObj.data.publishedDataModel.dimensions, { dataSource: { oldId: dimension.dataSource.oldId } });
      mappingJSON.push({ oldId: temp.id, newId: dimension.id });
      mappingJSON.push({ oldId: temp.attributeId, newId: dimension.attributeId });
      mappingJSON.push({ oldId: temp.dimensionId, newId: dimension.dimensionId });
    }
  });
  //mapping for measures
  forEach(payload.data.measures, (measure) => {
    if (measure.dataSource && measure.dataSource.oldId) {
      let temp = find(discoveryDocObj.data.publishedDataModel.measures, { dataSource: { oldId: measure.dataSource.oldId } });
      mappingJSON.push({ oldId: temp.id, newId: measure.id });
    }
  });
  //mapping for factId, dataobjectID, bioid
  mappingJSON.push({ oldId: discoveryDocObj.data.publishedDataModel.dataObject.dataobjectID, newId: payload.data.dataObject.dataobjectID });
  mappingJSON.push({ oldId: discoveryDocObj.data.publishedDataModel.dataObject.bioid, newId: payload.data.dataObject.bioid });
  mappingJSON.push({ oldId: discoveryDocObj.data.publishedDataModel.dataObject.fid, newId: payload.data.dataObject.fid });
  mappingJSON = uniqBy(mappingJSON, (e) => { return e.oldId; });
  return mappingJSON;
}


export function replaceIds(discoveryDocObj, mappingJSON) {
  let doc = JSON.stringify(discoveryDocObj);
  forEach(mappingJSON, (item) => {
    doc = replaceAll(doc, item.oldId, item.newId);
  });
  return JSON.parse(doc);
}

export function replaceAll(str, replaceWhat, replaceTo) {
  let re = new RegExp(replaceWhat, 'g');
  return str.replace(re, replaceTo);
}

export function updateDataObjectId(customDimensionMeasures, dataObjectId, factId) {
  forEach(customDimensionMeasures.dimensionAttrList, (item) => {
    item.dataObjectId = dataObjectId;
    item.factId = factId;
    item.saveAsOldId = item.id;
    delete item.id;
  });
  forEach(customDimensionMeasures.measureList, (item) => {
    item.dataObjectId = dataObjectId;
    item.factId = factId;
    item.saveAsOldId = item.id;
    delete item.id;
  });
  return customDimensionMeasures;
}

export function replaceCustomAttrIds(data, newDiscoveryStore) {
  let mappingJSON = [];
  forEach(data.dimensionAttrList, (dimension) => {
    mappingJSON.push({ oldId: dimension.saveAsOldId, newId: dimension.id });
  });
  forEach(data.measureList, (measure) => {
    mappingJSON.push({ oldId: measure.saveAsOldId, newId: measure.id });
  });

  return replaceIds(newDiscoveryStore, mappingJSON);
}