import { isDataPresentInArray, showNotification } from '..';
import { WARN_TYPE } from '../../constants/messageTypes';

/**
 * @name prepareColumn
 * @desc this function will call when user drag and drop attribute/measure in column section. This will perform validation in column
 * @param {String} sheetId
 * @param {Object} attribute
 * @param {Object} pivotData
 * @param {Object} chartData
 * @return {Object} {pivot, chart}
 */
export const prepareColumn = (sheetId, attribute, pivotData, chartData) => {
  const isItemInRow = isDataPresentInArray(pivotData.row, attribute.id);
  const isItemInColumn = isDataPresentInArray(pivotData.column, attribute.id);

  const pivot = {...pivotData};
  const chart = {...chartData};

  if (!isItemInColumn) {
    if (attribute.isMeasure) {
      const meaArray = pivot.row.filter(item => item.isMeasure === true);
      pivot.column = pivot.column.concat(meaArray);
      pivot.row = pivot.row.filter(item => item.isMeasure !== true);
      if (!isItemInRow) {
        pivot.column.push(attribute);
        chart.yAxisItems.push(attribute);
      } else {
        showNotification('All measures must be present either in Row or Column.', WARN_TYPE);
      }
    } else if (isItemInRow) {
      pivot.row = pivot.row.filter(item => item.id !== attribute.id);
      pivot.column.push(attribute);
    } else {
      pivot.column.push(attribute);
      chart.xAxisItems.push(attribute);
    }
  } else {
    showNotification('Duplicate attributes or measures not allowed.', WARN_TYPE);
  }
  return {pivot, chart};
};
