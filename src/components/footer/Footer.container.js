import { connect } from 'react-redux';
import * as actions from '../sheet-list/redux/actions/SheetListActions';
//import { removeDroppedSheet } from '../actions/AeMvsActions';
import { withRouter } from 'react-router-dom';

import { Footer } from './Footer.component';

function mapStateToProps(state) {
  return {
    data: state
  };
}
function mapDispatchToProps(dispatch) {
  return {
    fetchSheetList: () => {
      dispatch(actions.fetchSheetList());
    },
    addSheet: (sheet, handleClicksFromFooter) => {
      dispatch(actions.addSheet(sheet, handleClicksFromFooter));
    },
    updateSheet: (sheet) => {
      dispatch(actions.updateSheet(sheet));
    },
    removeSheet: (list, sheet, handleClicksFromFooter) => {
      dispatch(actions.removeSheet(sheet, handleClicksFromFooter));
    },
    duplicateSheet: (sheet, handleClicksFromFooter) => {
      dispatch(actions.duplicateSheet(sheet, handleClicksFromFooter));
    }
    // ,
    // removeDroppedSheet: (mvsId, widgetId) => {
    //   dispatch(removeDroppedSheet(mvsId, widgetId));
    // }
  };
}

const FooterContainer = withRouter(connect(
  mapStateToProps,
  mapDispatchToProps
)(Footer));

export { FooterContainer };
