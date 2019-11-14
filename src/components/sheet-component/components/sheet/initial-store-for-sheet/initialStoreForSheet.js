// Initial state for the redux
export const initialStateOfsheet = {
  sheetId: '',
  loading: false,
  chart: {
    xAxisItems: [],
    yAxisItems: [],
    zAxisItems: [],
    chartType: 'mscolumn2d'
  },
  columnLevelSummaries: { total: false, avg: false, sum: false },
  expandCollapseToggle: true,
  filters: [],
  gmap: {
    location: [],
    attributes: []
  },
  gridData: {},
  id: 'ECD3A5BD-117C-4224-9323-460A754FBD9B',
  isActive: true,
  isChart: false,
  isFilterApplied: true,
  joinRequest: {},
  name: 'Sheet1',
  pivot: {
    column: [],
    row: [],
    values: []
  },
  sidebarToggle: true,
  totalRows: 1,
  type: 'DISCOVERY_SHEET',
  viewType: 'table',
};
