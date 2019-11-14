import React, { Component } from 'react';
import { func, object, string, bool, array } from 'prop-types';
import Sheet from './Sheet';
import { getSheetData, SheetContext } from '../../shared/context-model';
import {
  isDataPresentInArray,
  isValidPivot,
  prepareChartRequest,
  showNotification
} from '../../shared/utils';
import { ERROR_TYPE } from '../../shared/constants/messageTypes';
import { setAccessToken } from '../../config/getAccessToken';
import { LoadingIndicator } from 'aera-react-library';
import ShowHideSidebar from './helper-components/ShowHideSidebar';
class SheetWrapper extends Component {

  componentDidMount() {
    const { sheetData, initSheet, measures, dimensions } = this.props;
    setAccessToken(this.props.accessToken);
    initSheet(sheetData, measures.concat(dimensions));
  }

  componentDidUpdate(prevProps, prevState) {
    // only update if the sheet id has changed
    if (prevProps.data.sheetData.id !== this.props.data.sheetData.id) {
      const { sheetData, initSheet, measures, dimensions } = this.props;
      setAccessToken(this.props.accessToken);
      initSheet(sheetData, measures.concat(dimensions));
    }
  };
  /**
   * @name saveToggleState
   * @desc update state and update sheets in discovery data model
   * @param {Boolean} value
   */
  onToggleComplete = (value) => {
    const { toggleSheetSideBar, sheetData } = this.props;
    if (toggleSheetSideBar instanceof Function) {
      toggleSheetSideBar(value, sheetData.id);
    }
  };

  /**
   * @name dropZoneToggle
   * @desc update state of drop zone of table & chart and update sheets in discovery data model
   * @param {Boolean} value
   */
  dropZoneToggle = (value) => {
    const { dropZoneToggle, sheetData } = this.props;
    if (dropZoneToggle instanceof Function) {
      dropZoneToggle(value, sheetData.id);
    }
  };

  /**
   * @name saveViewTypeToggleState
   * @desc update state and update sheets in discovery on changing view type of sheet
   * @param {Boolean} ev
   */
  viewTypeChanged = (ev) => {
    const { saveViewTypeState, sheetData } = this.props;
    const { chart, filters } = this.props.data.sheetData;
    const data = prepareChartRequest(chart.xAxisItems, chart.yAxisItems, filters);
    console.log(data);
    if (saveViewTypeState instanceof Function) {
      saveViewTypeState(ev.target.value, sheetData.id);
    }
  };

  createCustomDimension = () => {
    // console.log('createCustomDimension is called');
  };

  createCustomMeasure = () => {
    // console.log('createCustomMeasure is called');
  };

  addDimMeaInColumn = (event) => {
    const data = event.dataTransfer.getData('ELEMENT_DATA');
    if (data) {
      const column = [...this.props.data.sheetData.pivot.column];
      const row = [...this.props.data.sheetData.pivot.row];
      column.push(JSON.parse(data));
      const validPivot = isValidPivot(column, row);
      if (validPivot) {
        if (this.props.setDimMeaInColumn instanceof Function) {
          this.props.setDimMeaInColumn(JSON.parse(data)).then(() => {
            const { measures, dimensions } = this.props;
            this.props.getSheetData(this.props.sheetData.id, measures.concat(dimensions));
          });
        }
      } else {
        showNotification('asdasd', ERROR_TYPE);
      }
    }
  };

  addDimMeaInRow = (event) => {
    const data = event.dataTransfer.getData('ELEMENT_DATA');
    if (data) {
      const column = [...this.props.data.sheetData.pivot.column];
      const row = [...this.props.data.sheetData.pivot.row];
      row.push(JSON.parse(data));
      const validPivot = isValidPivot(column, row);
      if (validPivot) {
        if (this.props.setDimMeaInRow instanceof Function) {
          this.props.setDimMeaInRow(JSON.parse(data));
        }
      } else {
        showNotification('asdasd', ERROR_TYPE);
      }
    }
  };

  addDimMeaInXaxis = (event) => {
    let data = event.dataTransfer.getData('ELEMENT_DATA');
    data = JSON.parse(data);
    const validateAttr = isDataPresentInArray(this.props.data.sheetData.chart.xAxisItems, data.id);
    if (data && data.isDimension && !validateAttr && this.props.setDimMeaInXaxis instanceof Function) {
      this.props.setDimMeaInXaxis(data);
    }
  };

  addDimMeaInYaxis = (event) => {
    let data = event.dataTransfer.getData('ELEMENT_DATA');
    data = JSON.parse(data);
    const validateAttr = isDataPresentInArray(this.props.data.sheetData.chart.yAxisItems, data.id);
    if (data && data.isMeasure && !validateAttr && this.props.setDimMeaInYaxis instanceof Function) {
      this.props.setDimMeaInYaxis(data);
    }
  };

  addDimMeaInFilter = (event) => {
    let data = event.dataTransfer.getData('ELEMENT_DATA');
    data = JSON.parse(data);
    if (data && this.props.setDimMeaInYaxis instanceof Function) {
      this.props.setDimMeaInFilter(data);
    }
  };

  onPaginationChanged = (paginationData) => {
    const sheet = getSheetData();
    const { paginationChanged, measures, dimensions } = this.props;
    const request = { ...sheet.joinRequest };
    request.page = paginationData.page;
    request.plimit = paginationData.plimit;
    request.pstart = paginationData.pstart;
    if (paginationChanged instanceof Function) {
      paginationChanged(request, paginationData, measures.concat(dimensions));
    }
  };



  render() {
    const { isEditable } = this.props;
    const { data, measures, dimensions, dataobjectName } = this.props;
    const { sheetData } = data;
    const sheetContextData = {
      isSheetEditable: isEditable,
      ...sheetData.pivot,
      ...sheetData.chart,
      chartData: sheetData.chartData,
      filters: sheetData.filters,
      loading: sheetData.loading,
      apiData: sheetData.apiData,
      expandCollapseToggle: sheetData.expandCollapseToggle,
      viewType: sheetData.viewType,
      addDimMeaInColumn: this.addDimMeaInColumn,
      addDimMeaInRow: this.addDimMeaInRow,
      addDimMeaInXaxis: this.addDimMeaInXaxis,
      addDimMeaInYaxis: this.addDimMeaInYaxis,
      onViewTypeChanged: this.viewTypeChanged,
      dropZoneToggle: this.dropZoneToggle,
      addDimMeaInFilter: this.addDimMeaInFilter,
      paginationChanged: this.onPaginationChanged
    };

    return (
      <div className="ae-sheet-wrapper">

        <ShowHideSidebar
          isEditable={isEditable}
          sidebarToggle={sheetData.sidebarToggle}
          onToggleComplete={this.onToggleComplete}
          dataobjectName={dataobjectName}
          createCustomDimension={this.createCustomDimension}
          createCustomMeasure={this.createCustomMeasure}
          measures={measures}
          dimensions={dimensions}
        />
        <SheetContext.Provider value={sheetContextData}>
          {sheetData.loading ? <LoadingIndicator className="discovery-loader" /> : ''}
          <Sheet
            onViewTypeChanged={this.viewTypeChanged}
            viewType={sheetData.viewType}
            viewTable={sheetData.viewType === 'table'}
            sheetId={sheetData.id} />
        </SheetContext.Provider>
      </div>
    );
  }
}

SheetWrapper.propTypes = {
  isEditable: bool,
  accessToken: string.isRequired,
  sheetData: object,
  measures: array,
  dimensions: array,
  dataobjectName: string,

  data: object,
  initSheet: func,
  toggleSheetSideBar: func,
  dropZoneToggle: func,
  saveViewTypeState: func,

  setDimMeaInColumn: func,
  setDimMeaInRow: func,

  setDimMeaInXaxis: func,
  setDimMeaInYaxis: func,
  setDimMeaInFilter: func,

  getSheetData: func,
  paginationChanged: func,
};

export default SheetWrapper;
