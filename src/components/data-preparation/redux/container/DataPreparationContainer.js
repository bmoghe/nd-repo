import { connect } from 'react-redux';
import * as actions from '../actions/SelectedDatasourceActions';
//import { getDataSourceDetails } from '../actions/AeAddDataviewActions';
//import { initSheetList } from '../../../sheet-list/redux/actions/SheetListActions';
import DataPreparation from '../../react/DataPreparation';

function mapStateToProps(state) {
  return {
    data: state
  };
};

function mapDispatchToProps(dispatch) {
  return {
    removeDataSource: (dataSource) => {
      dispatch(actions.removeDataSource(dataSource));
    },
    fetchDataSourceList: (dataSource) => {
      dispatch(actions.fetchDataSourceList(dataSource));
    },
    disableDataSource: (dataSourceId) => {
      dispatch(actions.disableDataSource(dataSourceId));
    },
    enableDataSource: (arrayOfId) => {
      dispatch(actions.enableDataSource(arrayOfId));
    },
    getDataJoinFacts: (data) => {
      dispatch(actions.getDataJoinFacts(data));
    },
    removeJoinTableContent: () => {
      dispatch(actions.removeJoinTableContent());
    },
    loadReport: (reportId, sheetId) => {
      dispatch(actions.loadReport(reportId, sheetId));
    },
    updateDrawerState: () => {
      dispatch(actions.updateDrawerState());
    },
    initSheetList: () => {
     // dispatch(initSheetList());
    },
    previewDataViewData: () => {
      dispatch(actions.previewDataViewData());
    },
    publishDataModel: (dataModelName, getDataSourceDetails, handleNavigation) => {
      dispatch(actions.publishDataModel(dataModelName, getDataSourceDetails, handleNavigation));
    }
    // getDataSourceDetails: (id) => {
    //   dispatch(getDataSourceDetails(id, true));
    // }
  };
};

const DataPreparationContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DataPreparation);

export default DataPreparationContainer;
