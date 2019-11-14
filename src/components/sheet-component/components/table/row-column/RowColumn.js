import React, { useContext } from 'react';
import { SheetContext } from '../../../shared/context-model';
import { Tag, Scroll, AeSidebar } from '../../../shared/components';
import { EMPTY_ROW_COLUMN } from '../../../shared/constants/emptyStateMessages';

const RowColumn = () => {
  const {
    column, row, expandCollapseToggle,
    dropZoneToggle, addDimMeaInColumn, addDimMeaInRow
  } = useContext(SheetContext);

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
          <div className='ae-column-icon'/>
          Column
          <div className="ae-row-icon"/>
          Row
        </div>}
      direction='vertical'>
      <div className='ae-row-column'>
        <div
          id='TABLE_COLUMN_CONTAINER' className='ae-column-container'
          onDragOver={allowDragOver} onDrop={addDimMeaInColumn}>
          <div className='title-container'>
            <div className='ae-column-icon'/>
            Column
          </div>
          <div className="items-container">
            <Scroll
              scrollLeftBy={50} scrollRightBy={50}
              actionBtnPosition="right" style={{ width: '100%' }}>
              {
                column.length ?
                  column.map((item) => {
                    return <Tag
                      key={item.id} item={item}
                      displayKey={item.isMeasure ? 'name' : 'attributeName'}
                      deleteDimension={deleteItem}/>;
                  }) : <div className="empty-message">{EMPTY_ROW_COLUMN}</div>
              }
            </Scroll>
          </div>
        </div>
        <div
          id="TABLE_ROW_CONTAINER" className="ae-row-container"
          onDragOver={allowDragOver} onDrop={addDimMeaInRow}>
          <div className="title-container">
            <div className="ae-row-icon"/>
            Row
          </div>
          <div className="items-container">
            <Scroll
              scrollLeftBy={50} scrollRightBy={50}
              actionBtnPosition="right" style={{ width: '100%' }}>
              {
                row.length ?
                  row.map((item) => {
                    return <Tag
                      key={item.id} item={item}
                      displayKey={item.isMeasure ? 'name' : 'attributeName'}
                      deleteDimension={deleteItem}/>;
                  }) : <div className="empty-message">{EMPTY_ROW_COLUMN}</div>
              }
            </Scroll>
          </div>
        </div>
      </div>
    </AeSidebar>
  );
}

export default RowColumn;
