import {
  aeDiscoverDocData,
  documentDetails,
  getId,
  saveDiscoverDocData
} from "../../shared/constants";
import { HeaderService } from '../header/services';

export const updateDiscoveryAfterSaveAndPublish = (data, corporate) => {
  saveDiscoverDocData('dataModelId', data.dataObject.dataobjectID);
  if (aeDiscoverDocData.CollectionID) {
    HeaderService.addDiscoveryToCollection(data.dataObject.bioid, aeDiscoverDocData.CollectionID);
  }
  saveDiscoverDocData("id", data.dataObject.bioid);
  saveDiscoverDocData("name", data.dataObject.dataobjectName);
  saveDiscoverDocData("description", data.dataObject.description);
  saveDiscoverDocData("isEdited", false);
  saveDiscoverDocData("corporate", corporate);
};

export const updateApplicationURL = (discoveryId) => {
  const urlParams = getId(window.location.hash);
  if (urlParams.CollectionID) {
    let newURL = `#/project/${documentDetails.projectID}/document/${discoveryId}`;
    window.history.replaceState('', '', newURL);
  }
};
