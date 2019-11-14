import { string, object, func, bool } from 'prop-types';

const headerPropTypes = {
  title: string,
  onClose: func,
  shareDocument: func,
  saveNewDocument: func,
  saveDocument: func,
  isConfirmationModal: bool,
  enableDisableEditDoc: func,
  clearSelectedUsers: func,
  toggleShareModal: func,
  data: object,
  getDataSourceDetails: func,
  publishDataModel: func,
  publishAndUpdate: func,
  handleNavigation: func,
  toggleSaveDscoveryModal: func,
  toggleSetDiscoveryAsFav: func
};

export default headerPropTypes;

