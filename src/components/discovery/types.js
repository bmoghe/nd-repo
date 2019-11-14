import { string, object, func } from 'prop-types';

const discoveryPropTypes = {
  docId: string.isRequired,
  data: object,
  fetchDiscoveryDocument: func,
  initDiscoveryDoc: func
};

export default discoveryPropTypes;