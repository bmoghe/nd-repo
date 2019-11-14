const getRenderType = (index) => {
  if (index === 0) {
    return '';
  } else if (index === 1) {
    return 'line';
  } else if (index === 2) {
    return 'area';
  }
  return '';
};
export const prepareChartData = (gridData, chartProperties, xAxisItems, yAxisItems) => {
  const chartData = {
    chart: {
      ...chartProperties,
      yaxisname: yAxisItems.map(item => item.name).join(', '),
      theme: 'fusion'
    },
    categories: [
      {
        category: []
      }
    ],
    dataset: []
  };
  const activeDimension = xAxisItems.find(dim => !dim.isDisabled);
  gridData.rowData.forEach(row => {
    chartData.categories[0].category.push({ label: row[activeDimension.id] });
  });
  yAxisItems.forEach((measure, index) => {
    const series = {
      seriesname: measure.name,
      plottooltext: `${measure.name}: $dataValue`,
      renderas: getRenderType(index),
      data: []
    };
    gridData.rowData.forEach(row => {
      series.data.push({ value: row[measure.id] });
    });
    chartData.dataset.push(series);
  });
  console.log(chartData);
  return chartData;
};
