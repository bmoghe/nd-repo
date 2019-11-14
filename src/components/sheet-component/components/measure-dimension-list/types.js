import { array, func } from 'prop-types';

export const measuresDimensionsListPropTypes = {
  measuresList: array.isRequired,
  dimensionsList: array.isRequired,
  createCustomDimension: func.isRequired,
  createCustomMeasure: func.isRequired,
};

export const dimensionsListPropTypes = {
  listItems: array,
  createCustomDimension: func,
  editCustomAttr: func,
  deleteCustomAttr: func,
};

export const measuresListPropTypes = {
  listItems: array,
  createCustomMeasure: func,
  editCustomAttr: func,
  deleteCustomAttr: func,
};
