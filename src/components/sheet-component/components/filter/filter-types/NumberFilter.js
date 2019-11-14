import React from 'react';
import { object, func } from 'prop-types';
import { PageHeader } from 'antd';
import './NumberFilter.scss';

const NumberFilter = props => {
  const onCloseClicked = () => {
    props.onClose();
  };
  return (
    <div className="number-filter-container">
      <PageHeader
        title="Add Filter"
        extra={<i className="btn-modal-close solid-budicon-cross-ui" onClick={onCloseClicked}/>}/>
      {`${props.item.name} ${props.item.condition} ${props.item.value.join(',')}`}
    </div>
  );
};

NumberFilter.propTypes = {
  item: object,
  onClose: func
};

export default NumberFilter;
