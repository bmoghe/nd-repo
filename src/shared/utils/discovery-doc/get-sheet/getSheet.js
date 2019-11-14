/**
 * @name getSheet
 * @param {string} id
 * @desc function that returns sheet of passed id to it.
 */
export function getSheet(id) {
  const result = lodash.find(aeDiscoverDocData.data.sheets, { id: id });
  if (result && result.type === "DISCOVERY_SHEET") {
    return result;
  }
  return result;
}