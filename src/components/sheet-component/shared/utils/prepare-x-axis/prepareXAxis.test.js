// export const prepareXAxis = (sheetId, attribute, chartData, pivotData) => {
//   const chart = { ...chartData };
//   const pivot = { ...pivotData };
//   chart.xAxisItems.push(attribute);
//   pivot.row.push(attribute);
//   chart.xAxisItems.forEach(item => {
//     item.isDisabled = item.id !== attribute.id;
//   });
//   return { pivot, chart };
// };

import { prepareXAxis } from './prepareXAxis';

describe('prepareXAxis should return object', () => {
  test(' with pivot row item length should increase', () => {
    const attribute = { name: 'ABC', id: 'ASD_ASD', isDisabled: false };
    const chartData = { xAxisItems: [], yAxisItems: [] };
    const pivotData = { column: [], row: [] };
    const data = prepareXAxis('ASD_ASD', attribute, chartData, pivotData);
    expect(data.pivot.row.length).toBe(1);
  });

  test('with chart xAxisItems item length should increase', () => {
    const attribute = { name: 'ABC', id: 'ASD_ASD', isDisabled: false };
    const chartData = { xAxisItems: [], yAxisItems: [] };
    const pivotData = { column: [], row: [] };
    const data = prepareXAxis('ASD_ASD', attribute, chartData, pivotData);
    expect(data.chart.xAxisItems.length).toBe(1);
  });

  test('with chart xAxisItems item length should increase and disable previous all item', () => {
    const attribute = { name: 'ABC', id: 'ASD_ASD', isDisabled: false };
    const chartData = { xAxisItems: [ { name: 'BBC', id: 'BS_ASD', isDisabled: false } ], yAxisItems: [] };
    const pivotData = { column: [], row: [] };
    const data = prepareXAxis('ASD_ASD', attribute, chartData, pivotData);
    expect(data.chart.xAxisItems.length).toBe(2);
    expect(data.chart.xAxisItems[0].isDisabled).toBe(true);
    // console.log(data.chart.xAxisItems);
  });

});
