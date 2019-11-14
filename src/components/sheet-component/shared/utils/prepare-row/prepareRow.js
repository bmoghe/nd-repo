import { isDataPresentInArray, showNotification} from '..';
import { WARN_TYPE } from '../../constants/messageTypes';

/**
 * @name prepareRow
 * @desc this function will call when user drag and drop attribute/measure in Row section. This will perform validation in row
 * @param {String} sheetId
 * @param {Object} attribute
 * @param {Object} pivotData
 * @param {Object} chartData
 * @return {Object} pivot
 */

export const prepareRow = (sheetId, attribute, pivotData, chartData) => {
  const isItemInRow = isDataPresentInArray(pivotData.row, attribute.id);
  const isItemInColumn = isDataPresentInArray(pivotData.column, attribute.id);
  const pivot = {...pivotData};
  const chart = {...chartData};

  if (!isItemInRow) {
    if (attribute.isMeasure) {
      const meaArray = pivot.column.filter(item => item.isMeasure === true);
      pivot.row = pivot.row.concat(meaArray);
      pivot.column = pivot.column.filter(item => item.isMeasure !== true);
      if (!isItemInColumn) {
        pivot.row.push(attribute);
        chart.yAxisItems.push(attribute);
      } else {
        showNotification('All measures must be present either in Row or Column.', WARN_TYPE);
      }
    } else if (isItemInColumn) {
      pivot.column = pivot.column.filter(item => item.id !== attribute.id);
      pivot.row.push(attribute);
    } else {
      pivot.row.push(attribute);
      chart.xAxisItems.push(attribute);
    }
  } else {
    showNotification('Duplicate attributes or measures not allowed.', WARN_TYPE);
  }
  return {pivot, chart};
};
