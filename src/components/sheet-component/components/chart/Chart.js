import React, { useContext } from 'react';
import { chartPropTypes } from './types';
import XYAxis from './axis-containers/XYaxis';
import { SheetContext } from '../../shared/context-model';
import { getGridAPI } from '../../shared/utils';
import Filter from '../filter/Filter';
import { ViewTypeToggle } from '../../shared/components';
import FusionCharts from 'fusioncharts';
import Charts from 'fusioncharts/fusioncharts.charts';
import ReactFC from 'react-fusioncharts';
import FusionTheme from 'fusioncharts/themes/fusioncharts.theme.fusion';

FusionCharts.options.creditLabel = false;
ReactFC.fcRoot(FusionCharts, Charts, FusionTheme);
const Chart = () => {
  const { viewType, onViewTypeChanged, isSheetEditable, chartData } = useContext(SheetContext);
  const gridAPI = getGridAPI();
  console.log(gridAPI);
  return (
    <div className="ae-chart-container">
      {isSheetEditable ?
        <>
          <XYAxis/>
          <Filter/>
          <ViewTypeToggle viewType={viewType} onViewTypeChanged={onViewTypeChanged}/>
        </> : ''}
      <div className="chart-section">
        <ReactFC
          type="mscombi2d"
          width="100%"
          height="100%"
          dataFormat="JSON"
          dataSource={chartData}
        />
      </div>
    </div>
  );
};

Chart.propTypes = chartPropTypes;

export default Chart;
