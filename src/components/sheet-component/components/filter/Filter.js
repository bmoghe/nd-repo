import React, { useState, useContext } from 'react';
import { SheetContext } from '../../shared/context-model';
import { FilterTag } from '../../shared/components';
import { EMPTY_ROW_COLUMN } from '../../shared/constants/emptyStateMessages';
import { Modal, LoadingIndicator } from 'aera-react-library';
import NumberFilter from './filter-types/NumberFilter';

// import PropTypes from 'prop-types';

const Filter = () => {
  const [ filterModal, toggleFilterModal ] = useState(false);
  const [ filterComponent, setFilterTypeComponent ] = useState(<LoadingIndicator/>);
  const { filters, addDimMeaInFilter } = useContext(SheetContext);

  const handleOnClose = () => {
    toggleFilterModal(false);
  };

  /**
   * @method Pivot#onDragOver
   * @description  function that calls event.preventDefault() on onDragOver event
   * @return {boolean}
   **/
  const allowDragOver = (event) => {
    event.preventDefault();
  };

  const onEnableDisableFilter = (filterItem) => {
    console.log(filterItem);
  };

  const editFilter = (filterItem) => {
    console.log(filterItem);
    // TODO Open Modal for the different type of filters
    setFilterTypeComponent(<NumberFilter item={filterItem} onClose={handleOnClose}/>);
    toggleFilterModal(true);
  };

  const onDeleteFilter = (filterItem) => {
    console.log(filterItem);
  };

  return (
    <div className='filter-section'>
      <div
        id='FILTER_CONTAINER' className='filter-container'
        onDragOver={allowDragOver} onDrop={addDimMeaInFilter}>
        <div className='filter-title-container'>
          <div className='ae-filter-icon'/>
          Filters
        </div>
        <div className="filter-items-container">
          {
            filters.length ?
              filters.map((item) => {
                return <FilterTag
                  key={item.id}
                  item={item}
                  disabled={item.isEnable}
                  onEnableDisableFilter={onEnableDisableFilter}
                  onEditFilter={editFilter}
                  onDeleteFilter={onDeleteFilter}/>;
              }) : <div className="empty-message">{EMPTY_ROW_COLUMN}</div>
          }
        </div>
      </div>
      <Modal
        open={filterModal}
        onClose={handleOnClose}
        disableBackdropClick={true}>
        <div className='small-filter-modal'>
          {filterComponent}
        </div>
      </Modal>
    </div>
  );
};

Filter.propTypes = {};

export default Filter;
