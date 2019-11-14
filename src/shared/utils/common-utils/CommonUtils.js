// import React from 'react';
// import { Select } from 'antd';
import * as lodash from 'lodash';
//import uuid from 'uuid/';
import * as PrepareGridData from '../prepare-grid-data/PrepareGridData';
import { aeFooterConst, ACTIVE_TAB } from '../../../components/footer/Footer.constants';
import {
 // FETCH_DIMENSION_LIST,
 // FETCH_MEASURE_LIST,
  DISABLE_DATASOURCE,
  ENABLE_DATASOURCE
} from '../../constants/action-types/ActionTypes';
import {
  aeDiscoverDocData,
  saveDiscoverDocData
} from '../../constants/discovery-doc-data/Discovery-doc-data';

export function removeItem(list, sheet) {
  lodash.remove(list, function (n) {
    return n.sheetId === sheet.sheetId;
  });
  return list;
};

export function enableDisableDataSources(action, arrayOfSelectedDataSources, itemId) {
  switch (action) {
    case DISABLE_DATASOURCE:
      lodash.find(arrayOfSelectedDataSources, { sheetId: itemId }).disabled = true;
      saveDiscoverDocData("selectedDataSources", arrayOfSelectedDataSources);
      return arrayOfSelectedDataSources;
    case ENABLE_DATASOURCE:
      lodash.each(itemId, itemId => {
        let temp = lodash.find(arrayOfSelectedDataSources, { sheetId: lodash.split(itemId, 'AE_', 2)[1] });
        if (temp) {
          temp.disabled = false;
        }
      });
      saveDiscoverDocData("selectedDataSources", arrayOfSelectedDataSources);
      return arrayOfSelectedDataSources;
    default:
      break;
  }
};

/**
 * @name saveDataJoinData
 * @param {object} Response of Join
 * @returns {object}
 * @desc function that saves data join table & retuns the parsed response of data join
 */
export function saveDataJoinData(data) {
  let dataJoinData = PrepareGridData.PrepareGridData(JSON.parse(data.response));
  saveDiscoverDocData("DataJoinData", dataJoinData);
  //FindMeasureMinMaxData(dataJoinData);
  return JSON.parse(data.response);
};

export function updateActiveSheet(item) {
  if (document.getElementById("dsList")) {
    let dsList = document.getElementById("dsList").getElementsByClassName("nav-item");
    let dataPreparation = document.querySelector(".data-preparation.d-inline-flex");
    if (item.type === aeFooterConst.DATA_PREPARATION) {
      saveDiscoverDocData("isDatapreparationOpen", true);
      dataPreparation.classList.add("active");
      lodash.forEach(aeDiscoverDocData.data.sheets, (sheet) => {
        sheet.isActive = false;
      });
      lodash.forEach(dsList, (ele) => {
        ele.classList.remove(ACTIVE_TAB);
      });
    } else {
      saveDiscoverDocData("isDatapreparationOpen", false);
      dataPreparation.classList.remove("active");
      lodash.forEach(aeDiscoverDocData.data.sheets, (sheet) => {
        sheet.isActive = (sheet.id === item.id);
      });
      lodash.forEach(dsList, (ele) => {
        if (ele.title === item.name) {
          ele.classList.add(ACTIVE_TAB);
        } else {
          ele.classList.remove(ACTIVE_TAB);
        }
      });
    }
  }
};