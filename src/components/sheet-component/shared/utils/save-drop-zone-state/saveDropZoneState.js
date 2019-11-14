import { getSheetData, setSheetData } from '../../context-model';

/**
 * @name saveSidebarState
 * @desc update sheet Model
 * @param {Boolean} value
 * @param {String} sheetId
 */
export const saveDropZoneState = (value) => {
  const sheet = getSheetData();
  sheet.expandCollapseToggle = value;
  setSheetData(sheet);
};
