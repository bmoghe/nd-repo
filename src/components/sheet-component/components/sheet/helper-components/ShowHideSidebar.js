import React from 'react';
import {AeSidebar} from '../../../shared/components';
import {MeasuresDimensionsList} from '../../measure-dimension-list';
import {showHideSidebarPropTypes} from './types';

const ShowHideSidebar = (props) => {
  if (props.isEditable) {
    return (
      <AeSidebar
        isExpanded={props.sidebarToggle}
        onToggleComplete={props.onToggleComplete}
        collapsedTitle={'Dimensions Measures'}>
        <div className="data-view-title outline-budicon-parcel">{props.dataobjectName}</div>
        <MeasuresDimensionsList
          createCustomDimension={props.createCustomDimension}
          createCustomMeasure={props.createCustomMeasure}
          measuresList={props.measures}
          dimensionsList={props.dimensions}/>
      </AeSidebar>
    );
  }
  return '';
};

ShowHideSidebar.propTypes = showHideSidebarPropTypes;

export default ShowHideSidebar;
