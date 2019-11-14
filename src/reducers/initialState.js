class initialState {
  get discoveryDoc() {
    return { discoveryDoc: null, loading: true, error: null };
  }
  get addDataviewData() {
    return {
      dataViews: { name: 'Data Views', list: [] },
      reportSheets: { name: 'Report Sheets', list: [] },
      selectedDataSource: { data: {} },
      loading: false
    };
  }
  get addReportData() {
    return {
      dataSourceList: { data: null, loading: false },
      applications: { data: [], loading: false },
      facts: { data: [], loading: false },
      reports: { data: [], loading: false },
      reportSheets: { data: [], filteredData: [], loading: false },
      selectedReportSheet: { data: {}, loading: false },
      error: null
    };
  }
  get applications() {
    return { applications: [], loading: false, error: null };
  }
  get facts() {
    return { facts: [], loading: false, error: null };
  }
  get reports() {
    return { reports: [], loading: false, error: null };
  }
  get selectedDatasource() {
    return { selectedDatasource: [], loading: false, error: null, GET_DATAJOIN_FACTS_PENDING: false, isDrawerOpen: true };
  }
  get reportSheets() {
    return { reportSheets: { data: [], filteredData: [] }, loading: false, error: null };
  }
  get sheetList() {
    return { sheetList: [], loading: false, error: null };
  }
  get dimensionsList() {
    return { dimensionsList: [], loading: false, error: null, isCustomAttrModal: false, editCustomAttr: null };
  }
  get dataSheetFilterList() {
    return { dataSheetFilterList: [], loading: false, error: null };
  }
  get filterList() {
    return { filterList: [], loading: false, error: null };
  }
  get measuresList() {
    return { measuresList: [], loading: false, error: null, isCustomMeasureModal: false };
  }
  get summaryList() {
    return { summaryList: [], fontProperties: [], coulmnItems: [], loading: false, error: null };
  }
  get dataSheet() {
    return {
      name: '',
      id: '',
      type: '',
      isChart: false, chartType: "mscolumn2d", viewType: "table",
      loading: false, error: null,
      pivot: {
        column: [],
        row: [],
        values: []
      }, chart: {
        xAxisItems: [],
        yAxisItems: [],
        zAxisItems: []
      }, gmap: {
        location: [],
        attributes: []
      },
      filters: [],
      columnLevelSummaries: {
        total: false,
        avg: false,
        sum: false,
      }
    };
  }
  get multiViewSheet() {
    return {
      name: '',
      id: '',
      type: '',
      isChart: false,
      data: [],
      loading: false, error: null, filters: []
    };
  }
  get mvs() {
    return {
      info: null, droppedSheets: [], filters: [], chartConfig: {}, loading: false, error: null, drawer: { leftOpen: true, rightOpen: true, leftDocked: false, rightDocked: false, }
    };
  }
  get rangesState(){
    return {
      isShowForm : false,
      isEditClicked : false
    };
  }
}

export default new initialState();
