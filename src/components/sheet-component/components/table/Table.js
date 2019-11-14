import React, { useContext } from 'react';
import { TablePropTypes } from './types';
import { AgGridReact } from 'ag-grid-react';
import RowColumn from './row-column/RowColumn';
import { SheetContext } from '../../shared/context-model';
import { normalGridOptions } from '../../shared/constants/normalGridOptions';
import { ViewTypeToggle } from '../../shared/components';
import Filter from '../filter/Filter';
import { setGridAPI } from '../../shared/utils';
import { Pagination } from 'antd';

const Table = () => {
  const { apiData, viewType, onViewTypeChanged, isSheetEditable, pageConfig, paginationChanged } = useContext(SheetContext);
  const onGridReady = (param) => {
    setGridAPI(param);
  };

  const onShowSizeChange = (current, pageSize) => {
    console.log(current, pageSize);
    paginationChanged({
      page: current,
      plimit: pageSize,
      pstart: (current - 1) * pageSize
    });
  };

  const onPageChanage = (page, pageSize) => {
    console.log(page, pageSize);
    paginationChanged({
      page: page,
      plimit: pageSize,
      pstart: (page - 1) * pageSize
    });
  };

  return (
    <div className="ae-table-container">
      {isSheetEditable ?
        <>
          <RowColumn/>
          <Filter/>
          <ViewTypeToggle viewType={viewType} onViewTypeChanged={onViewTypeChanged}/>
        </> : ''
      }

      {apiData && apiData.columnDefs.length && apiData.rowData.length ?
        <div className="ag-theme-balham aera-normal-table">
          <AgGridReact
            gridOptions={normalGridOptions}
            columnDefs={apiData.columnDefs}
            rowData={apiData.rowData}
            onGridReady={onGridReady}
          />
          <div className="ae-table-pagination">
            <div className="table-total-rows">Total {apiData.totalRows} rows</div>
            <Pagination
              showSizeChanger
              showQuickJumper
              size={'small'}
              defaultCurrent={pageConfig.page}
              defaultPageSize={pageConfig.plimit}
              pageSizeOptions={[ '20', '50', '100' ]}
              onShowSizeChange={onShowSizeChange}
              onChange={onPageChanage}
              total={apiData.totalRows}/>
          </div>

        </div> : 'No Data'
      }
    </div>
  );
};

Table.propTypes = TablePropTypes;

export default Table;
