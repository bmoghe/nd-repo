/** @module AeDataJoin.utils */
import * as lodash from 'lodash';
import { aeDiscoverDocData } from '../Constants';

/**
 * @name createDomElement
 * @param {string} x : left
 * @param {string} y : top
 * @param {string} title : innerHTML
 * @param {string} uid
 * @param {callbackfunction} callbackhandleNodeClickEvent
 * @returns {object}
 * @desc Create html element <div class="node" title="_title_" id="_uid_" style="left: _x_px; top: _y_px;">_title_</div> ,
 */
export function createDomElement(x, y, title, uid, callbackhandleNodeClickEvent) {
  const d = document.createElement('div');
  const rmIcon = document.createElement('i');
  const id = lodash.startsWith(uid, 'AE_') ? uid : 'AE_'.concat(uid || null);
  d.className = 'node';
  d.innerHTML = `<div class="text">${title}</div>`;
  rmIcon.className = 'outline-budicon-trash float-right ae-delete-node-icon';
  d.tooltip = title;
  d.title = title;
  d.id = id;
  d.style.left = `${x}px`;
  d.style.top = `${y}px`;
  if(aeDiscoverDocData.data.publishedDataModel){
    const report = lodash.find(aeDiscoverDocData.data.publishedDataModel.dataObject.reports, { doid: id.split('AE_')[1] });
    if (!report){
      d.appendChild(rmIcon);
      if (!lodash.isUndefined(callbackhandleNodeClickEvent)) {
        rmIcon.addEventListener('click', evt => callbackhandleNodeClickEvent(evt));
      }
    }
  }else{
    d.appendChild(rmIcon);
    if (!lodash.isUndefined(callbackhandleNodeClickEvent)) {
      rmIcon.addEventListener('click', evt => callbackhandleNodeClickEvent(evt));
    }
  }
  return { node: d, id: d.id, name: d.innerText, y, x };
}

/**
 * @name removeConnectedNodes
 * @desc removeConnectedNodes function removes node Id present as connection Ids in node list
 * @param {array} removeNodeId
 */
export function removeConnectedNodes(connection, node, removeNodeId) {
  if (connection.length > 0) {
    lodash.forEach(connection, (item) => {
      if (node[item.id].connections.length > 0) {
        removeConnectedNodes(node[item.id].connections, node, removeNodeId);
      }
      else {
        removeNodeId.push(item.id);
      }
      removeNodeId.push(item.id);
    });
  }
}

/**
   * @name getDependentNodeList
   * @desc function that returns list of nodes which are connected to node passed in paramenter
   * @param {object} reportSheet
   * @returns {Array} nodeList
   */
export function getDependentNodeList(reportSheet) {
  let nodeList = [];
  lodash.forEach(reportSheet.connections, function (node) {
    nodeList.push(aeDiscoverDocData.data.join[node.id].name);
  });
  return nodeList;
}

/**
   * @name getDependentSheetList
   * @desc function that returns array of sheet names which are using measure/dimension of reportSheet passed.
   * @param {object} reportSheet
   * @returns {Array} sheetList
   */
export function getDependentSheetList(reportSheet) {
  let dataSheets = aeDiscoverDocData.data.sheets;
  let dmList = [];
  let sheetList = [];
  lodash.forEach(reportSheet.data.dimensions, function (item) {
    dmList.push(item.id);
  });
  lodash.forEach(reportSheet.data.measures, function (item) {
    dmList.push(item.id);
  });
  lodash.forEach(dataSheets, function (sheet) {
    if (sheet.type === "DISCOVERY_SHEET") {
      lodash.forEach(sheet.pivot.column, function (item) {
        if (dmList.indexOf(item.id) !== -1) {
          if (sheetList.indexOf(sheet.name) === -1)
            sheetList.push(sheet.name);
        }
      });
      lodash.forEach(sheet.pivot.row, function (item) {
        if (dmList.indexOf(item.id) !== -1) {
          if (sheetList.indexOf(sheet.name) === -1)
            sheetList.push(sheet.name);
        }
      });
      lodash.forEach(sheet.chart.xAxisItems, function (item) {
        if (dmList.indexOf(item.id) !== -1) {
          if (sheetList.indexOf(sheet.name) === -1)
            sheetList.push(sheet.name);
        }
      });
      lodash.forEach(sheet.chart.yAxisItems, function (item) {
        if (dmList.indexOf(item.id) !== -1) {
          if (sheetList.indexOf(sheet.name) === -1)
            sheetList.push(sheet.name);
        }
      });
      lodash.forEach(sheet.chart.zAxisItems, function (item) {
        if (dmList.indexOf(item.id) !== -1) {
          if (sheetList.indexOf(sheet.name) === -1)
            sheetList.push(sheet.name);
        }
      });
    }
  });
  return sheetList;
}
