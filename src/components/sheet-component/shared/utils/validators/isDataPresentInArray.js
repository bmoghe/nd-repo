/**
 * @name isDataPresentInArray
 * @desc function will check item is available in collection
 * @param {Object} id
 * @param {Array} array
 * @return {boolean}
 */
export const isDataPresentInArray = (array, id) => {
  return !!array.find(sheet => sheet.id === id);
};
