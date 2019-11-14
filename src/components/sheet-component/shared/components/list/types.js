import { array, bool, func, node, string } from 'prop-types';

export const AeListPropTypes = {
  displayProperty: string,
  list: array,
  showOptionKey: string,
  isItemDraggable: bool,
  isItemDisabled: bool,
  iconForItem: node,
  handleDeleteClick: func,
  handleEditClick: func,
};
