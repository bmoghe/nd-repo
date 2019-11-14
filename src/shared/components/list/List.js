import React, { Component } from 'react';
import PropTypes from 'prop-types';

const style = {
  listContainer: {
    listStyle: 'none',
    fontFamily: 'FaktPro-Normal, Open Sans, sans-serif'
  },
  listItem: {
    fontFamily: 'FaktPro-Normal, Open Sans, sans-serif',
    padding: '6px 5px 5px 15px',
    fontSize: 14,
    userSelect: 'none',
    cursor: 'pointer',
    color: '#546A80',
    fontWeight: 500
  },
  selected: {
    backgroundColor: '#F6FAFE',
    color: '#00619E',
  }
};

class List extends Component {
  static propTypes = {
    listItems: PropTypes.arrayOf(PropTypes.object).isRequired,
    handleOnClick: PropTypes.func,
    dragStart: PropTypes.func,
    dragOver: PropTypes.func,
    dragEnd: PropTypes.func,
    onDelete: PropTypes.func,
    onFilter: PropTypes.func,
    isItemDraggable: PropTypes.bool,
    bindObjectToAttr: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    parentClassName: PropTypes.string,
    bindData: PropTypes.bool,
    showDeletIcon: PropTypes.bool,
    showIcon: PropTypes.bool,
    iconClass: PropTypes.string,
    showFilterIcon: PropTypes.bool,
    className: PropTypes.string,
    dropRestrict: PropTypes.string,
    showGearIcon: PropTypes.bool,
    onShowFilterMenu: PropTypes.func,
    isItemDisabled: PropTypes.bool,
    setSelectableStyle: PropTypes.bool
  }
  constructor(props) {
    super(props);
    this.selectedItem = null;
    this.state = {
      filterPopoverOpen: false
    };
  }

  /**
   * @name onClick
   * @desc callback function to handle onClick Event.
   * @param {Object} item 
   **/
  onClick = (item, event) => {
    if (this.props.handleOnClick) {
      if (this.selectedItem)
        this.selectedItem = this.removeSelectedStyle(this.selectedItem);
      if (!this.props.setSelectableStyle)
        this.selectedItem = this.props.isItemDisabled && item.disabled ? null : this.setSelectedStyle(event.target.nodeName === "P" ? event.target.parentElement : event.target);
      this.props.handleOnClick(item);
    }
  }

  /**
   * @name setSelectedStyle
   * @desc function to add style to a selected item on add data source page.
   * @param {Object} item 
   **/
  setSelectedStyle(item) {
    item.style.backgroundColor = style.selected.backgroundColor;
    item.style.color = style.selected.color;
    item.style.fontWeight = style.selected.fontWeight;
    return item;
  }

  /**
   * @name removeSelectedStyle
   * @desc function to remove style from item on add data source page.
   * @param {Object} item 
   **/
  removeSelectedStyle(item) {
    item.style.backgroundColor = '#fff';
    item.style.color = style.listItem.color;
    item.style.fontWeight = style.listItem.fontWeight;
    return item;
  }

  /**
   * @name clickOnDelete
   * @desc callback function to handle onClick Event.
   * @param {Object} item 
   **/
  clickOnDelete(item) {
    if (this.props.onDelete) {
      this.props.onDelete(item);
    }
  }

  /**
   * @name clickOnFilter
   * @desc callback function to handle onClick Event.
   * @param {Object} item 
   **/
  clickOnFilter(item) {
    if (this.props.onFilter) {
      this.props.onFilter(item);
    }
  }

  showFilterMenu(item) {
    if (this.props.onShowFilterMenu) {
      this.props.onShowFilterMenu(item);
    }
  }
  /**
   * @name onDragStart
   * @desc callback function to handle onDragStart Event.
   * @param {*Event} event 
   **/
  onDragStart(item, event) {
    if (this.props.dragStart) {
      this.props.dragStart(event);
      if (this.props.showFilterIcon) {
        event.dataTransfer.setDragImage(document.getElementById(item.id), 10, 10);
      }

    }
  }
  /**
   * @name onDragOver
   * @desc callback function to handle onDragOver Event.
   * @param {*Event} event 
   **/
  onDragOver(item, event) {
    if (this.props.dragOver) {
      this.props.dragOver(event);
    }
  }
  /**
   * @name onDragEnd
   * @desc callback function to handle onDragEnd Event.
   * @param {*Event} event 
   **/
  onDragEnd(item, event) {
    if (this.props.dragEnd) {
      this.props.dragEnd(event);
    }
  }
  /**
   * @name toggleFilterPopup
   * @desc callback function to handle toggle the popover Event.
   * @param {object} item 
   **/
  toggleFilterPopup(item) {
    item.filterPopoverOpen = !item.filterPopoverOpen;
    this.setState({});
  }

  render() {
    return (
      <div className={this.props.parentClassName}>
        <ul className={this.props.className} style={style.listContainer}>
          {
            this.props.listItems.map((item, index) => {
              return (
                <li style={this.props.className ? null : style.listItem}
                  value={item.id}
                  disabled={this.props.isItemDisabled && item.disabled}
                  onClick={this.onClick.bind(this, item)}
                  draggable={this.props.isItemDraggable && !item.disabled}
                  onDragStart={this.onDragStart.bind(this, item)}
                  onDragOver={this.onDragOver.bind(this, item)}
                  onDragEnd={this.onDragEnd.bind(this, item)}
                  dataobj={typeof (this.props.bindObjectToAttr) === 'string' ? this.props.bindObjectToAttr : JSON.stringify(this.props.bindObjectToAttr)}
                  datatable={this.props.bindData && item ? JSON.stringify(item) : null}
                  key={index}
                  droprestrict={this.props.dropRestrict}>
                  {this.props.showIcon ?
                    <span className={this.props.iconClass} />
                    : ''
                  }
                  {item.name}
                  {item.reportName}
                  {item.dataModelName}

                  {/*<span id={""+item.id}  title={item.name}>{item.name}</span> */}
                  {
                    item.reportSheetName ? <div>{item.reportSheetName}</div> : null
                  }
                  {this.props.showDeletIcon ?
                    <button type="button" onClick={this.clickOnDelete.bind(this, item)} className="close " aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button> : null
                  }
                  {this.props.showFilterIcon ?
                    <div className="ae-icon-filter_small ae-float-right" onClick={this.clickOnFilter.bind(this, item)} /> : null
                  }
                  {
                    item.reportPath !== "null" && item.reportPath ?
                      <p className="ae-description">{item.reportPath} </p> : ''
                  }
                </li>
              );
            })
          }
        </ul>
      </div>
    );
  }
};

export { List };
