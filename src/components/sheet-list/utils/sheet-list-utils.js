import lodash from 'lodash';
import uuid from 'uuid';
import {
  aeDiscoverDocData,
  saveDiscoverDocData,
  getSheet
} from '../../../shared/constants';
import initialState from '../../../reducers/initialState';
import { DISCOVERY_SHEET_NAME, MULTIVIEW_SHEET_NAME } from '../../../shared/constants/messages/Messages.constant'
import { aeFooterConst, ACTIVE_TAB } from "../../footer/Footer.constants";

/**
 * @name nameGenerator
 * @returns {string}
 * @desc function that returns unique name sheet & save it to storage
 */
export function nameGenerator(type) {
  let name;
  let dataSheets = aeDiscoverDocData.data.sheets;
  let sheetNames = [];
  let sheetNos = [];
  let mulSheetNos = [];
  let nextNo = 1;
  let nextMulNo = 1;
  lodash.forEach(dataSheets, function (value) {
    sheetNames.push(value.name);
    if (value.type === "DISCOVERY_SHEET") {
      let substr = value.name.split(DISCOVERY_SHEET_NAME).pop();
      let check = isNaN(substr);
      if (!check && substr) {
        sheetNos.push(parseInt(substr));
      }
    } else {
      let substr = value.name.split(MULTIVIEW_SHEET_NAME).pop();
      let check = isNaN(substr);
      if (!check) {
        mulSheetNos.push(substr);
      }
    }
  });
  switch (type) {
    case "DISCOVERY_SHEET":
      if (sheetNos.length > 0) {
        nextNo = Math.max(...sheetNos) + 1;
      }
      name = "" + DISCOVERY_SHEET_NAME + nextNo;
      return name;

    case 'MULTIVIEW_SHEET':
      if (mulSheetNos.length > 0) {
        nextMulNo = Math.max(...mulSheetNos) + 1;
      }
      name = "" + MULTIVIEW_SHEET_NAME + nextMulNo;
      return name;
    default:
      return;
  }
};

export function addSheetToList(meta, initialising) {
  let newSheet;
  let initDataSheet = initialState.dataSheet;
  if (initialising) {
    saveDiscoverDocData("dataSheet", []);
  }
  initDataSheet.name = nameGenerator(meta.sheet);
  initDataSheet.id = uuid().toUpperCase();
  initDataSheet.type = meta.sheet;
  initDataSheet.sidebarToggle = true;
  initDataSheet.expandCollapseToggle = true;
  initDataSheet.viewType = 'table';
  initDataSheet.filters = [];

  switch (meta.sheet) {
    case 'DISCOVERY_SHEET':
      newSheet = initDataSheet;
      break;
    case 'MULTIVIEW_SHEET':
      newSheet = {
        name: nameGenerator(meta.sheet), id: uuid().toUpperCase(), type: meta.sheet,
        filters: [], droppedSheets: [],
        isEditableCanvas: false,
        drawer: { leftOpen: true, rightOpen: false, leftDocked: false, rightDocked: false, }
      };
      break;
    default:
      break;
  }
  if (initialising) {
    return newSheet;
  }
  if (newSheet) {
    /***********  TO ADD NEW SHEET INTO LOCALSTORAGE  ****************/
    saveDiscoverDocData("newDataSheet", newSheet);
    /***********  TO ADD NEW SHEET INTO LOCALSTORAGE  ****************/
  }
  updateActiveSheet(newSheet);
  setTimeout(() => {
    meta.handleClicksFromFooter(newSheet);
  }, 1000);
  return aeDiscoverDocData.data.sheets;
};


/**
 * @name updateItemName
 * @param {arra,object} list currentsheet
 * @returns {array}
 * @desc function that updates sheet name & save it to storage
 */
export function updateItemName(list, currentsheet) {
  let item = {};
  let newList = [];
  switch (currentsheet.type) {
    case "DISCOVERY_SHEET":
      item = getSheet(currentsheet.id);
      item.name = currentsheet.name;
      newList = lodash.map(list, function (a) {
        return a.id === item.id ? a = item : a;
      });
      break;

    case "MULTIVIEW_SHEET":
      item = getSheet(currentsheet.id);
      item.name = currentsheet.name;
      newList = lodash.map(list, function (a) {
        return a.id === item.id ? a = item : a;
      });
      break;
    default:
      return;
  }
  saveDiscoverDocData("dataSheet", newList);
  return newList;
}

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

}

export function removeSheet(list, sheet, handleClicksFromFooter) {
  let index = lodash.findIndex(list, function (item) {
    return item.id === sheet.id;
  });
  let navigateTo;
  if (index < list.length - 1) { //deleted item is not last item
    navigateTo = list[index + 1];
  } else { //deleted item is last item
    navigateTo = list[index - 1];
  }
  lodash.remove(list, function (item) {
    return item.id === sheet.id;
  });

  /***********  TO REMOVE SHEET FROM LOCALSTORAGE  ****************/
  let dataSheet = aeDiscoverDocData.data.sheets;
  lodash.remove(dataSheet, function (n) {
    return n.id === sheet.id;
  });
  saveDiscoverDocData("dataSheet", dataSheet);
  /***********  TO REMOVE SHEET FROM LOCALSTORAGE  ****************/
  updateActiveSheet(navigateTo);
  setTimeout(() => {
    handleClicksFromFooter(navigateTo);
  }, 100);
  return list;
}

/**
 * @name duplicateSheet
 * @param {arra,object} list currentsheet
 * @returns {array}
 * @desc function that create duplicate sheet & save it to storage
 */
export function duplicateSheet(list, currentsheet, handleClicksFromFooter) {
  let newSheet;
  let sheet = getSheet(currentsheet.id);
  let dataSheet = aeDiscoverDocData.data.sheets;
  let newSummaries = lodash.cloneDeep(sheet.summaries);
  const mvsId = uuid().toUpperCase();
  const summaryId = uuid().toUpperCase();

  switch (sheet.type) {
    case "DISCOVERY_SHEET":
      newSheet = {
        name: nameGenerator("DISCOVERY_SHEET"),
        id: uuid().toUpperCase(),
        type: lodash.cloneDeep(sheet.type),
        viewType: lodash.cloneDeep(sheet.viewType),
        chartType: lodash.cloneDeep(sheet.chartType),
        filters: lodash.cloneDeep(sheet.filters),
        pivot: lodash.cloneDeep(sheet.pivot),
        chart: lodash.cloneDeep(sheet.chart),
        gmap: lodash.cloneDeep(sheet.gmap),
        columnLevelSummaries: lodash.cloneDeep(sheet.columnLevelSummaries),
        sidebarToggle: lodash.cloneDeep(sheet.sidebarToggle),
        expandCollapseToggle: lodash.cloneDeep(sheet.expandCollapseToggle),
        dataset: lodash.cloneDeep(sheet.dataset),
        chartProperties: lodash.cloneDeep(sheet.chartProperties)
      };
      break;
    case 'MULTIVIEW_SHEET':

      newSummaries = lodash.map(newSummaries, (summary) => {
        summary.summarySettings.metadata.summaryId = summaryId;
        summary.summarySettings.metadata.mvsId = mvsId;
        return summary;
      });

      newSheet = {
        name: nameGenerator("MULTIVIEW_SHEET"),
        id: mvsId,
        type: lodash.cloneDeep(sheet.type),
        filters: lodash.cloneDeep(sheet.filters),
        summaries: newSummaries,
        columnLevelSummaries: lodash.cloneDeep(sheet.columnLevelSummaries),
        droppedSheets: lodash.cloneDeep(sheet.droppedSheets),
        drawer: lodash.cloneDeep(sheet.drawer)
      };
      break;
    default:
      break;
  }
  if (newSheet) {
    dataSheet.splice(lodash.findIndex(dataSheet, function (o) {
      return o.id === sheet.id;
    }) + 1, 0, newSheet);
    saveDiscoverDocData("dataSheet", dataSheet);
    updateActiveSheet(newSheet);
    setTimeout(() => {
      handleClicksFromFooter(newSheet);
    }, 1000);
  }
  return dataSheet;
}
