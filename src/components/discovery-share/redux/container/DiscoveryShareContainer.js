import { connect } from 'react-redux';
import * as actions from '../../../header/redux/actions/HeaderActions';
import { ShareComponent } from '../../';

function mapStateToProps(state) {
  return {
    data: state
  };
}

function mapDispatchToProps(dispatch) {
  return {
    shareDocument: (documentId, userArray, description) => {
      dispatch(actions.shareDocument(documentId, userArray, description));
    },
    fetchUsersList: (discoveryId) => {
      dispatch(actions.fetchUsersList(discoveryId));
    }
  };
}

const DiscoveryShareContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareComponent);

export { DiscoveryShareContainer };
