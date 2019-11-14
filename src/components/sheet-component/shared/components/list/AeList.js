import React from 'react';
import { AeListPropTypes } from './types';
import { AeListItem } from './AeListItem';
import './AeList.style.scss';

export const AeList = (props) => {
  if (!props.list.length) {
    return 'List is Empty';
  }

  const handleDeleteClick = (item) => {
    if (props.handleDeleteClick instanceof Function)
      props.handleDeleteClick(item);
  };

  const handleEditClick = (item) => {
    if (props.handleEditClick instanceof Function)
      props.handleEditClick(item);
  };

  return (
    <div className="ae-list-container">
      {
        props.list.map((item, index) =>
          <AeListItem
            key={ index }
            item={ item }
            displayProperty={ props.displayProperty }
            iconForItem={ props.iconForItem }
            isItemDisabled={ props.isItemDisabled }
            isItemDraggable={ props.isItemDraggable }
            showOptions={ item[props.showOptionKey] }
            handleDeleteClick={ handleDeleteClick }
            handleEditClick={ handleEditClick }/>)
      }
    </div>
  );
};

AeList.propTypes = AeListPropTypes;
