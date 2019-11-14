import { connect } from 'react-redux';
import * as actions from '../actions/HeaderActions';
import { Header } from '../../';

function mapStateToProps(state) {
  return {
    data: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    toggleShareModal: () => {
      dispatch(actions.toggleShareModal());
    },
    saveNewDocument: (data) => {
      dispatch(actions.saveDiscoveryDoc(data));
    },
    saveDocument: (data, closeDiscoveryDocument, isNewDiscovery) => {
      dispatch(actions.saveDiscoveryDoc(data, closeDiscoveryDocument, isNewDiscovery));
    },
    enableDisableEditDoc: (data) => {
      dispatch(actions.enableDisableEditDoc(data));
    },
    publishDataModel: (dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate) => {
      dispatch(actions.publishDataModel(dataModelName, desc, getDataSourceDetails, handleNavigation, saveDocument, corporate));
    },
    publishAndUpdate: (saveDocument) => {
      dispatch(actions.publishAndUpdate(saveDocument));
    },
    getDataSourceDetails: (id) => {
      dispatch(actions.getDataSourceDetails(id, true));
    },
    toggleSaveDscoveryModal: () => {
      dispatch(actions.toggleSaveDscoveryModal());
    },
    toggleSaveAsDscoveryModal: () => {
      dispatch(actions.toggleSaveAsDscoveryModal());
    },
    toggleSetDiscoveryAsFav: (favourite) => {
      dispatch(actions.toggleSetDiscoveryAsFav(favourite));
    },
    saveAsPublish: (data) => {
      dispatch(actions.saveAsPublish(data));
    },
    getListOfCustomDimensionMeasure: (newDiscoveryStore, mappingJSON, fid) => {
      dispatch(actions.getListOfCustomDimensionMeasure(newDiscoveryStore, mappingJSON, fid));
    },
    saveCustomDimensionMeasuresList: (customDimensionMeasures, newDiscoveryStore, mappingJSON) => {
      dispatch(actions.saveCustomDimensionMeasuresList(customDimensionMeasures, newDiscoveryStore, mappingJSON));
    },
    saveAsDocument: (data) => {
      dispatch(actions.saveAsDocument(data));
    }
  };
}

const HeaderContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);

export { HeaderContainer };
