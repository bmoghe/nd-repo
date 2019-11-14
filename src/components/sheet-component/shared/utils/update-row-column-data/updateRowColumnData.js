import { getSheetData, setSheetData } from '../../context-model';

/**
 * @name updateRowColumnData
 * @desc update Row/Column section of table of sheet model
 * @param {String} sheetId
 * @param {Object} value
 */

export const updateRowColumnData = (sheetId, value) => {
  const sheet = getSheetData();
  sheet.pivot = { ...value };
  setSheetData(sheet);
};
