import { message } from 'antd';
import * as actionTypes from '../action-types';
import {
  aeDiscoverDocData,
  saveDiscoverDocData,
  updateAeDiscoverySavedData
} from '../../../../shared/constants';
import * as actions from '../actions/HeaderActions';
//import { addDiscoveryToCollection } from '../services';
import * as errMsg from '../../../../shared/constants/messages/Messages.constant';
import { createNewDiscoveryStore, replaceIds, updateDataObjectId, replaceCustomAttrIds } from "../../constants/HeaderConstant";

export default function headerReducer(state = { loading: false, isSaveDiscovery: false, isSaveAsDiscovery: false, isEditable: aeDiscoverDocData.data.isEditable, userList: [], showModel: false }, action) {
  let res;
  let isEditable;
  let updatedData;
  let userList;
  let showModel, isSavingDoc = false;
  let msg = null;
  let obj = {};
  let newDiscoveryStore = null;
  let customDimensionMeasures = {
    measureList: [], dimensionAttrList: []
  };
  let url = window.location.href;
  let arr = [];
  let mappingJSON = "";
  let isCustomDimensionMeasuresUpdated = false;
  switch (action.type) {
    case actionTypes.FETCH_USER_LIST_PENDING:
      return { ...state, loading: true };

    case actionTypes.FETCH_USER_LIST_FULFILLED:
      showModel = true;
      userList = JSON.parse(action.payload.response);
      return { ...state, loading: false, userList, showModel };

    case actionTypes.TOGGLE_SHARE_MODEL:
      state.showModel = !state.showModel;
      return { ...state, loading: false };

    case actionTypes.FETCH_USER_LIST_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };

    case actionTypes.SHARE_DISCOVERY_DOCUMENT_PENDING:
      return { ...state, loading: true };

    case actionTypes.SHARE_DISCOVERY_DOCUMENT_FULFILLED:
      res = action.payload;
      message.destroy();
      if (!res.data.success) {
        message.error(res.data.error ? res.data.error.name : "Error while saving");
      } else {
        showModel = false;
        message.success(res.data.message);
      }
      return { ...state, loading: false, showModel };

    case actionTypes.SHARE_DISCOVERY_DOCUMENT_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}` };

    case actionTypes.SAVE_DISCOVERY_DOCUMENT_PENDING:
      isSavingDoc = true;
      return { ...state, loading: true, isSavingDoc };

    case actionTypes.SAVE_DISCOVERY_DOCUMENT_FULFILLED:
      res = action.payload;
      message.destroy();
      if (!res.data.success) {
        message.error(res.data.error ? res.data.error.name : "Error while saving");
      } else {
        message.success('Document saved successfully');
        updatedData = action.meta;
        updatedData.data = action.meta.data;
        // const url = parent.location.href.split('#');
        // // parent.location.replace(url);
        // if (url[1] && url[1].includes('new')) {
        //   parent.location.replace(url[0] + `#discovery/edit/${res.data.id}`);
        // }
        if (aeDiscoverDocData.CollectionID) {
          actions.addDiscoveryToCollection(res.data.id, aeDiscoverDocData.CollectionID);
        }
        state.isSaveDiscovery = false;
        state.isSaveAsDiscovery = false;
        if (action.meta.isNewDiscovery) {
          const sheet1 = document.getElementById("dsList").getElementsByClassName("nav-item")[0];
          if (sheet1) {
            sheet1.classList.add("nav-item-active");
          }
        }
        updateAeDiscoverySavedData(updatedData);
        saveDiscoverDocData("id", res.data.id);
        saveDiscoverDocData("name", action.meta.data.name);
        saveDiscoverDocData("description", action.meta.data.description);
        saveDiscoverDocData("isEdited", false);
        saveDiscoverDocData("corporate", action.meta.data.corporate);
        if (action.meta.closeDiscoveryDocument instanceof Function) {
          action.meta.closeDiscoveryDocument();
        }
      }
      isSavingDoc = false;
      return { ...state, loading: false, res, isSavingDoc };
    case actionTypes.SAVE_DISCOVERY_DOCUMENT_REJECTED:
      isSavingDoc = false;
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false, error: `${action.payload.message}`, isSavingDoc };

    case actionTypes.EDIT_DISCOVERY_DOCUMENT:
      isEditable = action.meta;
      saveDiscoverDocData("isEditable", isEditable);
      return { ...state, loading: false, isEditable };

    case actionTypes.TOGGLE_SAVE_DISCOVERY_MODAL:
      state.isSaveDiscovery = !state.isSaveDiscovery;
      return { ...state, loading: false };

    case actionTypes.TOGGLE_SAVE_AS_DISCOVERY_MODAL:
      state.isSaveAsDiscovery = !state.isSaveAsDiscovery;
      return { ...state, loading: false };

    case actionTypes.SET_FAV_DISCOVERY_DOCUMENT_PENDING:
      return { ...state, loading: true };

    case actionTypes.SET_FAV_DISCOVERY_DOCUMENT_FULFILLED:
      if (!action.payload.data.success) {
        message.error("Not able set document as favourite");
      } else {
        saveDiscoverDocData("setFavourite", !action.meta.fav);
        message.destroy();
        message.success(action.payload.data.message);
      }
      return { ...state, loading: false };

    case actionTypes.SET_FAV_DISCOVERY_DOCUMENT_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false };

    case actionTypes.SAVE_AS_PUBLISH_PENDING:
      return { ...state, loading: true, newDiscoveryStore, customDimensionMeasures };

    case actionTypes.SAVE_AS_PUBLISH_FULFILLED:
      obj = createNewDiscoveryStore(action.payload, action.meta);
      if (action.payload.data.collectionId && action.payload.data.dataObject.bioid) {
        actions.addDiscoveryToCollection(action.payload.data.dataObject.bioid, action.payload.data.collectionId);
      }
      newDiscoveryStore = obj.newDiscoveryStore;
      mappingJSON = obj.mappingJSON;
      return { ...state, loading: true, newDiscoveryStore, mappingJSON };

    case actionTypes.SAVE_AS_PUBLISH_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false };


    case actionTypes.GET_LIST_OF_CUSTOM_DM_PENDING:
      isCustomDimensionMeasuresUpdated = false;
      return { ...state, loading: true, isCustomDimensionMeasuresUpdated };

    case actionTypes.GET_LIST_OF_CUSTOM_DM_FULFILLED:
      customDimensionMeasures = replaceIds(action.payload.data, action.meta.mappingJSON);
      customDimensionMeasures = updateDataObjectId(customDimensionMeasures, action.meta.newDiscoveryStore.data.publishedDataModel.dataObject.dataobjectID, action.meta.newDiscoveryStore.factId);
      if (customDimensionMeasures.dimensionAttrList.length === 0 && customDimensionMeasures.measureList.length === 0) {
        isCustomDimensionMeasuresUpdated = true;
      }
      return { ...state, loading: true, customDimensionMeasures, isCustomDimensionMeasuresUpdated };

    case actionTypes.GET_LIST_OF_CUSTOM_DM_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false };


    case actionTypes.SAVE_CUSTOM_DM_LIST_PENDING:
      isCustomDimensionMeasuresUpdated = false;
      return { ...state, loading: true };

    case actionTypes.SAVE_CUSTOM_DM_LIST_FULFILLED:
      isCustomDimensionMeasuresUpdated = true;
      newDiscoveryStore = replaceCustomAttrIds(action.payload.data, action.meta.newDiscoveryStore);
      newDiscoveryStore = replaceIds(newDiscoveryStore, action.meta.mappingJSON);
      return { ...state, loading: true, isCustomDimensionMeasuresUpdated, newDiscoveryStore };

    case actionTypes.SAVE_CUSTOM_DM_LIST_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false };


    case actionTypes.SAVE_AS_DOCUMENT_PENDING:
      return { ...state, loading: true };

    case actionTypes.SAVE_AS_DOCUMENT_FULFILLED:
      state.isSaveAsDiscovery = false;
      arr = url.split("/");
      arr[arr.length - 1] = action.payload.data.id;
      window.location.href = arr.join("/");
      window.location.reload(true);
      return { ...state, loading: false };

    case actionTypes.SAVE_AS_DOCUMENT_REJECTED:
      message.destroy();
      msg = (action.payload.response.data && action.payload.response.data.errorMessage) ? action.payload.response.data.errorMessage : errMsg.GENERIC_ERROR_MESSAGE;
      message.error(msg);
      return { ...state, loading: false };

    default:
      return state;
  }
}
