/**
 * @name isMeasurePresentInCollection
 * @desc function will check measure type item is available in input collection
 * @param {Array} collection
 */
export const isMeasureInCollection = (collection) => {
  return !!collection.find(item => item.isMeasure === true);
};
