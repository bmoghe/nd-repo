import { connect } from 'react-redux';
import * as actions from '../actions/Discovery.actions';
import { Discovery } from '../..';

function mapStateToProps(state) {
  return {
    data: state
  };
}
function mapDispatchToProps(dispatch) {
  return {
    initDiscoveryDoc: (data, publishData) => {
      dispatch(actions.initDiscoveryDoc(data, publishData));
    },
    initDataSourceDetails: (data) => {
      dispatch(actions.initDataSourceDetails(data));
    },
    fetchDiscoveryDocument: (documentId) => {
      if (documentId.id) {
        dispatch(actions.fetchDiscoveryDocument(documentId));
      } else {
        dispatch(actions.fetchDefaultDiscoveryDocument());
      }
    },
  };
}

const DiscoveryContainer = connect(mapStateToProps, mapDispatchToProps)(Discovery);

export { DiscoveryContainer };
