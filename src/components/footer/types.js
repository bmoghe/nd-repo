import { string, object, func, oneOfType, number } from 'prop-types';

const footerPropTypes = {
  handleNavigation: func,
  data: object,
  addSheet: func,
  updateSheet: func,
  fetchSheetList: func,
  duplicateSheet: func,
  removeSheet: func,
  saveDiscoveryDoc: func,
  removeDroppedSheet: func,
  reloadSheetList: func,
  bindObjectToAttr: oneOfType([string, object]),
  isGotoSheetCalled: string,
  navigateToThisSheet: object,
  resetPopoverState: func
};

export const sheetLinksPropTypes = {
    sheet: object,
    navigateSheet: func,
    handleOnClick: func,
    updateName: func,
    createDuplicateSheet: func,
    deleteSelectedSheet: func,
    removeDroppedSheet: func,
    index: oneOfType([
      string,
      number
    ]),
    data: object
};

export default footerPropTypes;
