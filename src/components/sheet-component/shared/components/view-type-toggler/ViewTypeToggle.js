import React from 'react';
import { Radio } from 'antd';
import { viewTypeTogglePropTypes } from './types';

export const ViewTypeToggle = props => {
  return (
    <Radio.Group
      className="toggle-view-type" defaultValue={props.viewType}
      size="small" onChange={props.onViewTypeChanged}>
      <Radio.Button value="table"><i className="outline-budicon-grid"/></Radio.Button>
      <Radio.Button value="chart"><i className="outline-budicon-graphic-moderate"/></Radio.Button>
    </Radio.Group>
  );
};

ViewTypeToggle.propTypes = viewTypeTogglePropTypes;
