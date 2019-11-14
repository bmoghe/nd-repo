import { connect } from 'react-redux';
import SheetsSwitcher from '../../react/sheets-switcher';
import { withRouter } from "react-router-dom";


function mapStateToProps(state) {
  return {
    data: state
  };
}
function mapDispatchToProps(dispatch) {
  return {};
}

const SheetsSwitcherContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SheetsSwitcher);

export default withRouter(SheetsSwitcherContainer);