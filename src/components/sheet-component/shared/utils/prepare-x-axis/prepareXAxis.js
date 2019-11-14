/**
 * @name prepareXAxis
 * @desc this function will call when user drag and drop attribute/measure in X Axis section.
 * Also update the table's row section
 * @param {String} sheetId
 * @param {Object} attribute
 * @param {Object} chartData
 * @param {Object} pivotData
 * @return {Object} {pivot, chart}
 */
export const prepareXAxis = (sheetId, attribute, chartData, pivotData) => {
  const chart = { ...chartData };
  const pivot = { ...pivotData };
  chart.xAxisItems.push(attribute);
  pivot.row.push(attribute);
  chart.xAxisItems.forEach(item => {
    item.isDisabled = item.id !== attribute.id;
  });
  return { pivot, chart };
};
