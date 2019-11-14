import React from 'react';
import { bool, func, object, string } from 'prop-types';

export const AeListItem = (props) => {

  /**
   * @method ListItem#draggingStart
   * @description  function will call the argument function on drag start of element
   * @param {Event} event
   **/
  const onListItemDragged = (event) => {
    const data = JSON.stringify({...props.item});
    event.dataTransfer.setData('ELEMENT_DATA', data);
  };

  /**
   * @method ListItem#onDeleteClicked
   * @description  function will call when user clicks on delete icon
   **/
  const onDeleteClicked = () => {
    if (props.handleDeleteClick instanceof Function)
      props.handleDeleteClick(props.item);
  };

  /**
   * @method ListItem#draggingStart
   * @description  function will call when user clicks on edit icon
   **/
  const onEditClicked = () => {
    if (props.handleEditClick instanceof Function)
      props.handleEditClick(props.item);
  };

  return (
    <div className="ae-list-item">
      { props.iconForItem ? <div className={ `ae-list-item-icon ${ props.iconForItem }` }/> : '' }
      <div
        title={ props.item[ props.displayProperty ] }
        className="ae-list-item-title"
        draggable={ props.isItemDraggable }
        onDragStart={ onListItemDragged }>
        { props.item[ props.displayProperty ] }
      </div>
      {
        props.showOptions ?
          <div className="ae-list-item-options">
            <div
              title="Edit"
              className="ae-list-item-edit outline-budicon-pen"
              onClick={ onEditClicked }/>
            <div
              title="Delete"
              className="ae-list-item-info outline-budicon-trash"
              onClick={ onDeleteClicked }/>
          </div> :
          <div className="ae-list-item-options">
            <div className="ae-list-item-info outline-budicon-alert-sign"/>
          </div>
      }
    </div>
  );
};

AeListItem.propTypes = {
  item: object,
  displayProperty: string,
  iconForItem: string,
  isItemDraggable: bool,
  showOptions: bool,
  handleDeleteClick: func,
  handleEditClick: func,
};
