import { aeDiscoverDocData } from '../discovery-doc/prepare-request';

export const getSheetData = (sheetId) => {
  const sheets = [ ...aeDiscoverDocData.data.sheets ];
  const sheet = sheets.find(sheet => sheet.id === sheetId);
  return {...sheet};
};

