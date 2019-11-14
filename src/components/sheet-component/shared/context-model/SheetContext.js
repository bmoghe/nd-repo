import React from 'react';

export const SheetContext = React.createContext({
  column: [],
  row: [],
  xAxisItem: [],
  apiData: {
    columnDefs: [],
    rowData: [],
  },
});
