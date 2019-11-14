import React from 'react';
import { object, func } from 'prop-types';
import './FilterTag.scss';
import { Popover } from 'antd';
import { Button } from 'aera-react-library/dist/components/Button/index';

export const FilterTag = props => {

  const onEnableDisable = () => {
    props.onEnableDisableFilter(props.item);
  };
  const onEditClick = () => {
    props.onEditFilter(props.item);
  };
  const onDeleteClick = () => {
    props.onDeleteFilter(props.item);
  };

  const content = (
    <div className="filter-tag-options">
      <Button onClick={onEnableDisable} type="tertiary">{props.item.disabled ? 'Enable' : 'Disable'}</Button>
      <Button onClick={onEditClick} type="tertiary">Edit</Button>
      <Button onClick={onDeleteClick} type="tertiary">Delete</Button>
    </div>
  );
  const tagTitle = "Test Tag Title";
  //const tagTitle = `${props.item.name} ${props.item.condition} ${props.item && props.item.value.length ? props.item.value.join(',') : ''}`;
  return (
    <div className={`filter-tag-container ${props.item.disabled}`} title={tagTitle}>
      <div className="filter-tag-title">
        {tagTitle}
      </div>
      <Popover
        overlayClassName={'filter-tag-options-container'}
        placement="bottom"
        title={''}
        content={content}
        trigger="click">
        <div className="solid-budicon-chevron-bottom" />
      </Popover>
    </div>
  );
};

FilterTag.propTypes = {
  item: object,
  onEnableDisableFilter: func,
  onEditFilter: func,
  onDeleteFilter: func,
};
