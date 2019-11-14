import React, { Component } from 'react';
import { Input } from 'aera-react-library';
import { searchDimMeaFromList } from '../../shared/utils';
import { dimensionsListPropTypes } from './types';
import { AeList } from '../../shared/components';

export default class DimensionsList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchQuery: '',
    };
  }

  createCustomDimension = () => {
    if (this.props.createCustomDimension instanceof Function) {
      this.props.createCustomDimension();
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
    const dataList = searchDimMeaFromList(listItems, searchQuery, true);
    return (
      <div className="ae-dimensions-list">
        <div className="ae-list-header">
          <div className="ae-list-Header-title"> Dimensions</div>
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
          showOptionKey={ 'custom' }
          iconForItem={ 'outline-budicon-two-grids' }
          displayProperty={ 'attributeName' }
          handleDeleteClick={ this.deleteCustomAttr }
          handleEditClick={ this.editCustomAttr }
        />
      </div>
    );
  }
}

DimensionsList.propTypes = dimensionsListPropTypes;
