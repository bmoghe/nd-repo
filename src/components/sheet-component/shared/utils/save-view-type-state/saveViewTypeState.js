import { aeDiscoverDocData } from '../../../Constants';

/**
 * @name saveViewTypeState
 * @desc update view type of sheets in discovery data model
 * @param {Boolean} value
 * @param {String} sheetId
 */
export const saveViewTypeState = (value, sheetId) => {
  const sheets = [ ...aeDiscoverDocData.data.sheets ];
  sheets.forEach((sheet) => {
    if (sheetId === sheet.id) {
      sheet.viewType = value;
    }
  });
  // TODO Remove comment wile COMPONENT_INTEGRATION
  // saveDiscoverDocData('dataSheet', sheets);
};
