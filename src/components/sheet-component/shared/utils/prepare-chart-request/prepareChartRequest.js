import { getRequestPayload } from '..';

export const prepareChartRequest = (xAxisItems, yAxisItems, filters) => {
  if (xAxisItems.length || yAxisItems.length) {
    const request = getRequestPayload();
    const row = xAxisItems.find(item => !item.isDisabled);
    request.row = row.id;
    const mea = yAxisItems.map(item => {
      return `${item.id}|${item.func}|||||`;
    });
    request.mea = mea.length === 1 ? mea[0] : mea.join(',');
    request.filters = filters;
    console.log(request);
  }
};

