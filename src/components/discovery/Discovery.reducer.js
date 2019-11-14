import { cloneDeep } from 'lodash';
import { message } from "antd";
import * as actionTypes from './Discovery.actionTypes';
import initialState from '../../reducers/initialState';
import * as DD from '../../shared/constants';
import * as errMsg from '../../shared/constants/messages/Messages.constant';

export function discoveryDocReducer(state = initialState.discoveryDoc, action) {
  let discoveryDoc;
  let msg = null;
  switch (action.type) {
    case actionTypes.FETCH_DISCOVERY_DOCUMENT_PENDING:
      state.facts = [];
      return { ...state, loading: true };

    case actionTypes.FETCH_BLANK_DISCOVERY_DOCUMENT:
      discoveryDoc = cloneDeep(DD.aeDiscoverDocData);
      discoveryDoc.editable = 'Y';
      DD.saveDiscoveryDoc(discoveryDoc);
      return { ...state, loading: false, discoveryDoc };

    case actionTypes.FETCH_DISCOVERY_DOCUMENT:
      discoveryDoc = action.meta;
      if (discoveryDoc.error) {
        return { ...state, loading: false, error: `${discoveryDoc.error}` };
      } else {
        discoveryDoc = discoveryDoc.data;
        // TODO - Update isEditable flag with API response
        if (discoveryDoc.data) {
          discoveryDoc.data.isEditable = false;
        }
        DD.saveDiscoveryDoc(discoveryDoc);
        DD.savePublishedDataModelDetails(action.meta.publishData);
        return { ...state, loading: false, discoveryDoc };
      }

    case actionTypes.FETCH_DISCOVERY_DOCUMENT_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };

    default:
      return state;
  }
}
