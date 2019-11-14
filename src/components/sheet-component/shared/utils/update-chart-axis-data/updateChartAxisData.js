import { getSheetData, setSheetData } from '../../context-model';

/**
 * @name updateChartAxisData
 * @desc update X-Axis/Y-Axis section of chart of sheet model
 * @param {String} sheetId
 * @param {Object} value
 */
export const updateChartAxisData = (sheetId, value) => {
  const sheet = getSheetData();
  sheet.chart = { ...value };
  setSheetData(sheet);
};
