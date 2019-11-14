import { isMeasureInCollection } from '..';

/**
 * @name prepareXAxis
 * @desc this function will call when user drag and drop attribute/measure in Y Axis section.
 * Also update the table's row/column section
 * @param {String} sheetId
 * @param {Object} attribute
 * @param {Object} chartData
 * @param {Object} pivotData
 * @return {Object} {pivot, chart}
 */
export const prepareYAxis = (sheetId, attribute, chartData, pivotData) => {
  const chart = {...chartData};
  const pivot = {...pivotData};
  if (isMeasureInCollection(pivot.column)) {
    pivot.column.push(attribute);
  } else if (isMeasureInCollection(pivot.row)) {
    pivot.row.push(attribute);
  } else {
    pivot.row.push(attribute);
  }
  chart.yAxisItems.push(attribute);
  // chart.yAxisItems.forEach(item => {
  //   item.isDisable = item.id !== attribute.id;
  // });
  return {pivot, chart};
};
