let sheetData = {};

export const getSheetData = () => {
  return { ...sheetData };
};

export const setSheetData = (value) => {
  sheetData = { ...value };
};
