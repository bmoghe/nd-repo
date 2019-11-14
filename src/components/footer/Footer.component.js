import React, { Component } from "react";
import footerPropTypes from './types';
import { find, isEmpty } from "lodash";
import { List } from "../../shared/components";
import { Sheet } from './Footer.SheetLink';
import {
  aeDiscoverDocData,
  getIsDataJoinEditable
} from "../../shared/constants";
import {
  aeFooterConst,
  aeFooterTitleConst,
  ACTIVE_TAB,
  MENU_ITEM_ICON,
  REPORT_SHEET,
  PREVIOUS_TOOLTIP,
  NEXT_TOOLTIP
} from './Footer.constants';
import { updateActiveSheet } from '../sheet-list/utils/sheet-list-utils';
//import { jsPanel } from '../ae-multi-view/jspanel/jspanel';
import ToggleNavigationButtons from './Footer.ToggleNavigationButtons';
import { Popover } from "antd";
import './Footer.component.scss';
import { getSlashSeparatedValue } from '../../shared/utils';

import { BASE_URL } from "../../shared/constants/urls";


class Footer extends Component {

  constructor(props) {
    super(props);
    this.state = {
      popoverOpen: false,
      addSheetPopoverOpen: false,
      showSheetListPopoverOpen: false,
    };
    this.target = aeFooterConst.DATA_PREPARATION;
    this.popupMenuItems = this.popupMenuItems.bind(this);
    this.addSelectedSheet = this.addSelectedSheet.bind(this);
    this.navigateSheet = this.navigateSheet.bind(this);
    this.scrollToRight = this.scrollToRight.bind(this);
    this.scrollToLeft = this.scrollToLeft.bind(this);
    this.handleClicksFromFooter = this.handleClicksFromFooter.bind(this);
    this.navigateToPrevState = this.navigateToPrevState.bind(this);
    // this.scrollTimer;
    // this.currentOpenSheet;
  }

  componentDidMount() {
    this.props.fetchSheetList();
    this.navigateToPrevState();
  }

  componentDidUpdate(prevProps) {
    if (this.props.isGotoSheetCalled !== prevProps.isGotoSheetCalled && this.props.navigateToThisSheet) {
      this.handleClicksFromFooter(this.props.navigateToThisSheet);
      this.props.resetPopoverState();
    }
  }

  navigateToPrevState = () => {
    let itemToOpen;
    if (aeDiscoverDocData.data.isDatapreparationOpen) {
      itemToOpen = {
        type: aeFooterConst.DATA_PREPARATION
      };
    } else {
      itemToOpen = find(aeDiscoverDocData.data.sheets, { isActive: true });
    }
    this.handleClicksFromFooter(itemToOpen);
  };

  scrollToRight = () => {
    let scroll_container = document.getElementById("dsList");
    if (scroll_container) {
      scroll_container.scrollLeft -= -107;
    }
  }

  scrollToLeft() {
    let scroll_container = document.getElementById("dsList");
    if (scroll_container) {
      scroll_container.scrollLeft -= 107;
    }
  }

  popupMenuItems() {
    return [
      { name: "Add New Sheet", id: "ADD_DISCOVERY_SHEET" },
      { name: "Add New Multiview", id: "ADD_MULTIVIEW_SHEET" }
    ];
  }

  addSelectedSheet(item) {
    switch (item.id) {
      case "ADD_DISCOVERY_SHEET": {
        this.props.addSheet("DISCOVERY_SHEET", this.handleClicksFromFooter);
        break;
      }
      case "ADD_MULTIVIEW_SHEET": {
        this.props.addSheet("MULTIVIEW_SHEET", this.handleClicksFromFooter);
        break;
      }
      default:
        break;
    }
  }

  /**
   * @name handleClicksFromFooter
   * @desc callback function to handle onClick Event on li.
   * @param {Object} item
   * @param {Object} event
   **/
  handleClicksFromFooter(item, event) {
    updateActiveSheet(item);
    if (isEmpty(this.props.data.discoveryDocReducer.discoveryDoc.data.join) || !aeDiscoverDocData.data.REPORTID) {
      return true;
    }
    let ele;
    if (!event && document.getElementById("dsList")) {
      let dsList = document.getElementById("dsList").getElementsByClassName("nav-item");
      event = find(dsList, { title: item.name });
    }
    ele = document.getElementsByClassName(ACTIVE_TAB);
    if (event && event.id === MENU_ITEM_ICON)
      event = event.parentElement;
    if (ele.length) {
      ele[0].classList.remove(ACTIVE_TAB);
    }
    this.setState({
      showSheetListPopoverOpen: false
    });
    let page = item ? item.type : aeFooterConst.DATA_PREPARATION;
    this.target = page;
    // let dsList;
    // if (document.getElementById("dsList")) {
    //   dsList = document.getElementById("dsList").getElementsByClassName("nav-item");
    // }
    let sheetId = getSlashSeparatedValue(window.location.href, 'sheet', '#');
    if (event || sheetId) {
      this.props.history.push(`${BASE_URL()}/sheet/${item.id ? item.id : sheetId}`);
    } else if (page === aeFooterConst.DATA_PREPARATION) {
      this.props.history.push(`${BASE_URL()}/data-preparation`);
    }

    setTimeout(() => {
      let scroll_container = document.getElementById("dsList");
      let activeSheet = document.querySelector("#dsList .nav-item-active");
      if (scroll_container && activeSheet && activeSheet.offsetLeft > (scroll_container.offsetWidth + 10)) {
        scroll_container.scrollLeft -= -(activeSheet.offsetLeft - (scroll_container.offsetWidth + 10));
      }
    }, 1000);
  }

  /**
   * @name updateName
   * @desc function to rename the sheet in store.
   * @param {object} item
   * @param {string} name
   **/
  updateName = (item, name) => {
    const sheetDetails = item;
    sheetDetails.name = name;
    this.props.updateSheet(sheetDetails);
    //const panels = jsPanel.getPanels();
    // if (panels.length) {
    //   panels.map(widget => {
    //     if (widget.getElementsByClassName("fusioncharts-container") && widget.getElementsByClassName("fusioncharts-container").length) {
    //       if(widget.getElementsByClassName("fusioncharts-container")[0].parentNode.id.includes(sheetDetails.id))
    //         widget.setHeaderTitle(sheetDetails.name);
    //     }else if (widget.id.includes(sheetDetails.id)) {
    //       widget.setHeaderTitle(sheetDetails.name);
    //     }
    //   });
    // }
  };

  /**
   * @name createDuplicateSheet
   * @desc duplicate the sheet by calling duplicateSheet action
   **/
  createDuplicateSheet = sheet => {
    this.props.duplicateSheet(sheet, this.handleClicksFromFooter);
  };

  /**
   * @name deleteSelectedSheet
   * @desc remove the sheet from the array by calling removeSheet action
   **/
  deleteSelectedSheet = sheet => {
    /* this.props.data.sheetListReducer.sheetList = this.props.data.sheetListReducer.sheetList.filter(function(i) {
      return i.id !== sheet.id;
    });*/
    this.props.removeSheet(this.props.data.sheetListReducer.sheetList, sheet, this.handleClicksFromFooter);
  };

  /**
   * @name navigateSheet
   * @desc function that passes event & index of loading sheet to handleClicksFromFooter of parent.
   * @param {number} index
   **/
  navigateSheet = (index) => {
    if (this.props.data.sheetListReducer.sheetList && this.props.data.sheetListReducer.sheetList.length - 1 === index) {
      let element = document.getElementById("menuitemPopover" + (index - 1));
      this.handleClicksFromFooter(this.props.data.sheetListReducer.sheetList[index - 1], element);
    } else if (this.props.data.sheetListReducer.sheetList && this.props.data.sheetListReducer.sheetList.length - 1 > index) {
      let element = document.getElementById("menuitemPopover" + (index));
      this.handleClicksFromFooter(this.props.data.sheetListReducer.sheetList[index + 1], element);
    }
  };

  /**
   * @name removeDroppedSheet
   * @desc function that calls removeDroppedSheet of parent.
   * @param {string, string} sheetId,widgetId
   **/
  removeDroppedSheet = (sheetId, widgetId) => {
    this.props.removeDroppedSheet(sheetId, widgetId);
  }


  render() {
    const isPublisDataModel = getIsDataJoinEditable();//!!aeDiscoverDocData.data.REPORTID;
    let scrollH_container = document.querySelector('#dsList');
    const isScrollVisible = scrollH_container ? (scrollH_container.scrollWidth > scrollH_container.offsetWidth) : false;
    return (
      <div className="data-preparation-footer">
        <div
          className={`data-preparation d-inline-flex align-items-start ${this.target === aeFooterConst.DATA_PREPARATION ? "active" : ""}`}>
          <Popover overlayClassName="info-popover" placement="right" content={REPORT_SHEET} trigger="hover">
            <i className="ae-db-icon outline-budicon-task-list" aria-hidden="true" />
          </Popover>
          <a
            href="void()"
            className="prepartaion-title"
            title={aeFooterTitleConst.DATA_PREPARATION}
            onClick={this.handleClicksFromFooter.bind(this, { type: aeFooterConst.DATA_PREPARATION })}>
            {aeFooterTitleConst.DATA_PREPARATION}
          </a>
        </div>
        {
          isPublisDataModel ?
            <div className="data-actions d-inline-flex align-items-start">
              <ToggleNavigationButtons
                addPopover
                headerReducer={this.props.data.headerReducer}
                discoveryDoc={this.props.data.discoveryDocReducer.discoveryDoc}
                addPopoverContent={<List
                  className="data-list"
                  listItems={this.popupMenuItems()}
                  setSelectableStyle={true}
                  handleOnClick={this.addSelectedSheet} />}
                listPopoverContent={<List
                  className="data-list vertical-sheets"
                  listItems={this.props.data.sheetListReducer.sheetList}
                  handleOnClick={this.handleClicksFromFooter}
                  setSelectableStyle={true} />}
                isDisable={isEmpty(this.props.data.discoveryDocReducer.discoveryDoc.data.join)} />
              <div
                className="nav sheet-container"
                id="dsList"
                disabled={isEmpty(this.props.data.discoveryDocReducer.discoveryDoc.data.join)}>
                {this.props.data.sheetListReducer.sheetList.map(
                  (sheet, index) => {
                    return (
                      <Sheet
                        handleOnClick={this.handleClicksFromFooter}
                        updateName={this.updateName}
                        sheet={sheet}
                        index={index}
                        key={index}
                        createDuplicateSheet={this.createDuplicateSheet}
                        deleteSelectedSheet={this.deleteSelectedSheet}
                        removeDroppedSheet={this.removeDroppedSheet}
                        navigateSheet={this.navigateSheet}
                        data={this.props.data}
                      />
                    );
                  }
                )}
              </div>
              {
                isScrollVisible ?
                  <div className="ae-scroll-actions">
                    <div className="ae-scroll-actions-left" onClick={this.scrollToLeft}>
                      <Popover overlayClassName="info-popover" placement="bottom" content={PREVIOUS_TOOLTIP} trigger="hover">
                        <i className="solid-budicon-chevron-left" />
                      </Popover>
                    </div>
                    <div className="ae-scroll-divider" />
                    <div className="ae-scroll-actions-right" onClick={this.scrollToRight}>
                      <Popover overlayClassName="info-popover" placement="bottomRight" content={NEXT_TOOLTIP} trigger="hover">
                        <i className="solid-budicon-chevron-right" />
                      </Popover>
                    </div>
                  </div> : ''
              }
            </div> : ''
        }
      </div>
    );
  }
};
Footer.propTypes = footerPropTypes;
export { Footer };