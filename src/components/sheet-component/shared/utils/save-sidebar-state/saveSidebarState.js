import { aeDiscoverDocData } from '../../../Constants';

/**
 * @name saveSidebarState
 * @desc update state and update sheets in discovery data model
 * @param {Boolean} value
 * @param {String} sheetId
 */
export const saveSidebarState = (value, sheetId) => {
  const sheets = [ ...aeDiscoverDocData.data.sheets ];
  sheets.forEach((sheet) => {
    if (sheetId === sheet.id) {
      sheet.sidebarToggle = value;
    }
  });
  // TODO Remove comment while COMPONENT_INTEGRATION
  // saveDiscoverDocData('dataSheet', sheets);
};
