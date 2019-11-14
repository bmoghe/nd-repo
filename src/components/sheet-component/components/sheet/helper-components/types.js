import {bool, func, string, array} from 'prop-types';

export const showHideSidebarPropTypes = {
  isEditable: bool,
  sidebarToggle: bool,
  onToggleComplete: func,
  dataobjectName: string,
  createCustomDimension: func,
  createCustomMeasure: func,
  measures: array,
  dimensions: array,
};
