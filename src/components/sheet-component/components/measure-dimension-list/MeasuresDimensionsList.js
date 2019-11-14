import React, { Component } from 'react';
import { DimensionsList, MeasuresList } from './index';
import './MeasuresDimensionsList.style.scss';
import { measuresDimensionsListPropTypes } from './types';

export default class MeasuresDimensionsList extends Component {
  render() {
    const {measuresList, dimensionsList, createCustomDimension, createCustomMeasure} = this.props;
    return (
      <div className="ae-measures-dimensions-list">
        <DimensionsList
          listItems={ dimensionsList }
          createCustomDimension={ createCustomDimension }
        />
        <MeasuresList
          listItems={ measuresList }
          createCustomMeasure={ createCustomMeasure }
        />
      </div>
    );
  }
}

MeasuresDimensionsList.propTypes = measuresDimensionsListPropTypes;
