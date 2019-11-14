import React, { Component } from 'react';
import { searchDimMeaFromList } from '../../shared/utils';
import { measuresListPropTypes } from './types';
import { AeList } from '../../shared/components';
import { Input } from 'aera-react-library';

export default class MeasuresList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  createCustomMeasure = () => {
    if (this.props.createCustomMeasure instanceof Function) {
      this.props.createCustomMeasure();
    }
  };

  onSearchQuery = (event, value) => {
    this.setState({searchQuery: value});
  };

  editCustomAttr = (param) => {
    if (this.props.editCustomAttr instanceof Function) {
      this.props.editCustomAttr(param);
    }
  };

  deleteCustomAttr = (param) => {
    if (this.props.deleteCustomAttr instanceof Function) {
      this.props.deleteCustomAttr(param);
    }
  };

  render() {
    const {searchQuery} = this.state;
    const {listItems} = this.props;
    const dataList = searchDimMeaFromList(listItems, searchQuery, false);
    return (
      <div className="ae-measures-list">
        <div className="ae-list-header">
          <div className="ae-list-Header-title"> Measures</div>
          <div className="ae-list-Header-option"> + Custom</div>
        </div>
        <Input
          label=''
          small="true"
          placeholder={ 'Search' }
          onChange={ this.onSearchQuery }/>
        <AeList
          list={ dataList }
          isItemDraggable={ true }
          isItemDisabled={ true }
          iconForItem={ 'outline-budicon-two-grids' }
          displayProperty={ 'name' }
          handleDeleteClick={ this.deleteCustomAttr }
          handleEditClick={ this.editCustomAttr }
          createCustomMeasure={ this.createCustomMeasure }
          onSearchFunction={ searchDimMeaFromList }
        />
      </div>
    );
  }
}

MeasuresList.propTypes = measuresListPropTypes;
