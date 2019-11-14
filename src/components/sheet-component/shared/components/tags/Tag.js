import React from 'react';
import { object, string, func, bool } from 'prop-types';
import './Tags.scss';

export const Tag = (props) => {
  const dragElementStarted = (event) => {
    // console.log(this.props.item);
    event.dataTransfer.setData('ELEMENT_DATA', JSON.stringify(props.item));
  };

  const deleteDimension = () => {
    if (props.deleteDimension instanceof Function) {
      props.deleteDimension(props.item);
    }
  };

  const { item, useDisableEnable, displayKey } = props;
  const isActiveClass = useDisableEnable && item.isDisabled ? 'inactive-attr' : 'active-attr';
  return (
    <div
      id={item.id} className={`tag-container ${isActiveClass}`}
      draggable={true} onDragStart={dragElementStarted}>
      {
        item.func ?
          <div className="tag-title">{`${item.func} ( ${item[displayKey]} )`}</div> :
          <div className="tag-title">{item[displayKey]}</div>
      }
      <div className="tag-option solid-budicon-cross-ui" onClick={deleteDimension}/>
    </div>
  );
};

Tag.propTypes = {
  item: object,
  displayKey: string,
  useDisableEnable: bool,
  deleteDimension: func,
};
