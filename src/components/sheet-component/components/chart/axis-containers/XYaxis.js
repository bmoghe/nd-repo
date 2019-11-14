import React, { useContext } from 'react';
import { SheetContext } from '../../../shared/context-model';
import { Tag, Scroll, AeSidebar } from '../../../shared/components';
import { EMPTY_ROW_COLUMN } from '../../../shared/constants/emptyStateMessages';

const XYAxis = () => {
  const { expandCollapseToggle, dropZoneToggle, addDimMeaInXaxis, xAxisItems, addDimMeaInYaxis, yAxisItems } = useContext(SheetContext);

  /**
   * @method Pivot#onDragOver
   * @description  function that calls event.preventDefault() on onDragOver event
   * @return {boolean}
   **/
  const allowDragOver = (event) => {
    event.preventDefault();
  };

  const deleteItem = (item) => {
    console.log('deleting item ====> ', item);
  };

  return (
    <AeSidebar
      style={{ height: 80 }}
      isExpanded={expandCollapseToggle}
      onToggleComplete={dropZoneToggle}
      collapsedTitle={
        <div className="collapse-header">
          <div className='ae-x-axis-icon'/>
          X-Axis
          <div className="ae-y-axis-icon"/>
          Y-Axis
        </div>}
      direction='vertical'>
      <div className='ae-row-column'>
        <div
          id='TABLE_COLUMN_CONTAINER' className='ae-column-container'
          onDragOver={allowDragOver} onDrop={addDimMeaInXaxis}>
          <div className='title-container'>
            <div className='ae-x-axis-icon'/>
            X-Axis
          </div>
          <div className="items-container">
            <Scroll
              scrollLeftBy={50} scrollRightBy={50}
              actionBtnPosition="right" style={{ width: '100%' }}>
              {
                xAxisItems.length ?
                  xAxisItems.map((item) => {
                    return <Tag
                      key={item.id} item={item} displayKey={item.isMeasure ? 'name' : 'attributeName'}
                      useDisableEnable={true} deleteDimension={deleteItem}/>;
                  }) : <div className="empty-message">{EMPTY_ROW_COLUMN}</div>
              }
            </Scroll>
          </div>
        </div>
        <div
          id="TABLE_ROW_CONTAINER" className="ae-row-container"
          onDragOver={allowDragOver} onDrop={addDimMeaInYaxis}>
          <div className="title-container">
            <div className="ae-y-axis-icon"/>
            Y-Axix
          </div>
          <div className="items-container">
            <Scroll
              scrollLeftBy={50} scrollRightBy={50}
              actionBtnPosition="right" style={{ width: '100%' }}>
              {
                yAxisItems.length ?
                  yAxisItems.map((item) => {
                    return <Tag
                      key={item.id} item={item} displayKey={item.isMeasure ? 'name' : 'attributeName'}
                      useDisableEnable={true} deleteDimension={deleteItem}/>;
                  }) : <div className="empty-message">{EMPTY_ROW_COLUMN}</div>
              }
            </Scroll>
          </div>
        </div>
      </div>
    </AeSidebar>
  );
};

export default XYAxis;
