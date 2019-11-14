import React, { Component } from 'react';
import { sheetLinksPropTypes } from "./types";
import { AeModal, AeButton } from "../../shared/components";
import { message, Popover } from 'antd';
import {
  aeDiscoverDocData,
  getSheet,
  getClassName
} from '../../shared/constants';
import { READ_ONLY_MSG } from '../../shared/constants/messages/Messages.constant';
import * as lodash from 'lodash';
import { NAME_ALREADY_TAKEN, ENTER_TO_CONTINUE, WARNING_MESSAGE, WARNING_MESSAGE1, WARNING_MESSAGE2, MENU_ITEM_ICON, DELETE_DATA_SHEET, DELETE_SHEET_WARNING_MESSAGE_1, DELETE_SHEET_WARNING_MESSAGE_2 } from './Footer.constants';
import { Button, Modal } from 'aera-react-library';

class Sheet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sheet: props.sheet,
      index: props.index,
      popoverOpen: false,
      deleteConfirmationModal: false
    };
    this.title = null;
    this.duplicateSelectedSheet = this.duplicateSelectedSheet.bind(this);
    this.checkDuplicate = this.checkDuplicate.bind(this);
    this.isLastSheet = this.isLastSheet.bind(this);
    this.updateName = this.updateName.bind(this);
    this.sumbitRename = this.sumbitRename.bind(this);
    this.deleteSelectedSheet = this.deleteSelectedSheet.bind(this);
    this.markAsDefault = this.markAsDefault.bind(this);
    this.renameTitle = this.props.sheet.name;
    this.disableDelete = true;
    this.clickCount = null;
    this.mvsList = [];
  }

  /**
   * @method Sheet#componentDidUpdate
   * @private
   * @description  life cycle method used to select input content
   * */
  componentDidUpdate(prevProps, prevState) {
    let inputElement = document.getElementById(this.props.sheet.id);
    if (inputElement && this.state.showRenameView !== prevState.showRenameView) {
      // inputElement.select instanceof Function ? inputElement.select() : null;
    }

    if (this.props.sheet.isActive && !aeDiscoverDocData.data.isDatapreparationOpen && (this.props.sheet.id !== prevProps.sheet.id)) {
      let dsList = document.getElementById("dsList").getElementsByClassName("nav-item");
      let currentItem = lodash.find(dsList, { title: this.props.sheet.name });
      if (!currentItem.classList.contains("nav-item-active")) {
        this.props.handleOnClick(this.props.sheet);
      }
    }
  }

  /**
   * @method Sheet#toggle
   * @description  function to toggles popover & calls the isLastSheet().
   * @param {string} val
   **/
  toggle = () => {
    this.isLastSheet(this.props.sheet.type);
    this.setState({
      popoverOpen: !this.state.popoverOpen,
      showRenameView: false
    });
  }
  showRenameView = (event) => {
    event.stopPropagation();
    this.renameTitle = this.props.sheet.name ? this.props.sheet.name : '';
    this.setState({
      showRenameView: true,
      showError: ENTER_TO_CONTINUE
    });
  }
  closeRenameFrom = () => {
    this.setState({
      showRenameView: false
    });
  }

  /**
   * @method Sheet#updateName
   * @description  function that calls callback function updateName().
   *               if that name is already taken or empty then set appropriate error message to showError variable
   * @param {string} val
   **/
  updateName() {
    let inputElement = document.getElementById(this.props.sheet.id);
    if (this.title) {
      let noDuplicateFound = this.checkDuplicate(this.title);
      if (this.props.updateName && noDuplicateFound) {
        this.setState({
          popoverOpen: false,
          showRenameView: false
        });
        this.props.updateName(this.props.sheet, this.title);
      }
      else if (!noDuplicateFound && this.title !== this.props.sheet.name) {
        inputElement.focus();
        message.destroy();
        message.error(NAME_ALREADY_TAKEN);
        this.setState({
          showRenameView: false
        });
      }
    } else {
      this.setState({
        showRenameView: false
      });
    }
  }
  sumbitRename(event) {
    // Cancel the default action, if needed
    event.preventDefault();
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
      // Trigger the button element with a click
      document.getElementById(this.props.sheet.id).blur();
    }
  }
  change(event) {
    this.title = event.target.value;
    if (this.title === '') {
      this.setState({
        showError: ENTER_TO_CONTINUE
      });
    } else {
      this.setState({
        showError: ''
      });
    }
  }

  /**
   * @name onClick
   * @desc callback function to handle onClick Event on li.
   * @param {Object} item 
   **/
  onClick = (item, event) => {
    event.preventDefault(0);
    let targetElement = event.target;
    let sheet = getSheet(item.id);
    this.clickCount++;
    if (this.clickCount === 1) {
      this.singleClickTimer = setTimeout(function () {
        this.clickCount = 0;
        if (this.props.handleOnClick && targetElement.id && !this.state.showRenameView) {
          this.props.handleOnClick(sheet, targetElement);
        }
      }.bind(this), 400);
    } else if (this.clickCount === 2 && this.props.data.headerReducer.isEditable) {
      clearTimeout(this.singleClickTimer);
      this.title = this.props.sheet.name;
      this.clickCount = 0;
      if (targetElement.id !== "SHEET_MENU") {
        this.setState({
          showRenameView: true
        });
      }
    }
  }

  /**
   * @method Sheet#onArrowClick
   * @param {object, event} item, event
   * @description  function that open sheet, whoes arrow icon got clicked 
   **/
  onArrowClick = (item, event) => {
    if (getClassName(this.props.data.headerReducer.isEditable)) {
      message.destroy();
      message.warning(`"${aeDiscoverDocData.name}" ${READ_ONLY_MSG}`);
      return;
    }
    let targetElement = event.target.parentElement;
    this.toggle();
    this.props.handleOnClick(item, targetElement);
  }

  duplicateSelectedSheet = () => {
    this.props.createDuplicateSheet(this.props.sheet);
    this.toggle();
  }

  /**
   * @method Sheet#checkDroppedSheet
   * @description  function that adds items to  mvsWidgetId & mvsList array if current sheetId is presents in droppedSheet of MVS.
   **/
  checkDroppedSheet = () => {
    let mvsWidgetIds = [];
    this.mvsList = [];
    let dataSheets = aeDiscoverDocData.data.sheets;
    let sheets = lodash.filter(dataSheets, { type: "MULTIVIEW_SHEET" });
    lodash.forEach(sheets, (mvsSheet) => {
      lodash.forEach(mvsSheet.droppedSheets, (sheet) => {
        if (this.props.sheet.id === sheet.sheetId) {
          mvsWidgetIds.push({ mvsSheetId: mvsSheet.id, widgetId: sheet.widgetId });
          if (this.mvsList.indexOf(mvsSheet.name) === -1)
            this.mvsList.push(mvsSheet.name);
        }
      });
    });
    return mvsWidgetIds;
  }

  /**
   * @method Sheet#deleteSelectedSheet
   * @description  function that calls checkDroppedSheet() to get array of mvsSheetId & widgetId. Then calls removeDroppedSheet for each item in mvsWidgetId's array.
   * function that calls navigateSheet of parent, if sheet to delete is present in MVS droppedsheets then calls navigateSheet of parent 
   **/
  deleteSelectedSheet = () => {
    //let dataSheets = aeDiscoverDocData.data.sheets;
    let mvsWidgetIds = this.checkDroppedSheet();
    lodash.forEach(mvsWidgetIds, (item) => {
      this.props.removeDroppedSheet(item.mvsSheetId, item.widgetId);
    });
    //this.props.navigateSheet(lodash.findIndex(dataSheets, (o) => { return o.id === this.props.sheet.id; }), this.props.sheet.id);
    this.props.deleteSelectedSheet(this.props.sheet);
    this.setState({
      deleteConfirmationModal: !this.state.deleteConfirmationModal
    });
  }


  markAsDefault = () => {
    this.setState({
      popoverOpen: false
    });
    let dataSheet = lodash.find(aeDiscoverDocData.data.sheets, { id: this.props.sheet.id });
    dataSheet.isDefault = !dataSheet.isDefault;
    if (dataSheet.isDefault) {
      lodash.forEach(aeDiscoverDocData.data.sheets, (sheet) => {
        if (this.props.sheet.id !== sheet.id) {
          sheet.isDefault = false;
        }
      });
    }
  }

  getDefaultStatus = () => {
    let dataSheet = lodash.find(aeDiscoverDocData.data.sheets, { id: this.props.sheet.id });
    if (dataSheet) {
      return dataSheet.isDefault;
    }
  }
  /**
   * @method Sheet#isLastSheet
   * @param {string} type
   * @description  function that returns boolean value for isLastSheet depend on wheather sheet count greater than 1
   * @return {boolean} 
   **/
  isLastSheet = (type) => {
    let typeCount = 0;
    let dataSheets = aeDiscoverDocData.data.sheets;
    lodash.forEach(dataSheets, function (value) {
      if (value.type === type) {
        typeCount++;
      }
    });
    if (typeCount > 1)
      this.disableDelete = false;
    else
      this.disableDelete = true;
  }

  /**
   * @method Sheet#checkDuplicate
   * @param {string} title
   * @description  function that returns boolean value for duplicate shetname depend on wheather sheet name already exist 
   * @return {boolean} noDuplicate
   **/
  checkDuplicate = (title) => {
    let dataSheets = aeDiscoverDocData.data.sheets;
    let noDuplicate = true;
    lodash.forEach(dataSheets, function (value) {
      if (value.name === title) {
        noDuplicate = false;
      }
    });
    return noDuplicate;
  }

  /**
   * @method Sheet#toggleDeleteConfirmation
   * @description  function that updates state of deleteConfirmationModal & popoverOpen 
   **/
  toggleDeleteConfirmation = () => {
    this.checkDroppedSheet();
    this.setState({
      deleteConfirmationModal: !this.state.deleteConfirmationModal,
      popoverOpen: false,
    });
  }
  handleCancel = () => {
    this.setState({
      deleteConfirmationModal: false,
    });
  }

  render() {
    const isDefault = this.getDefaultStatus();
    return (
      <div id={'menuitemPopover' + this.props.index}
        className={`nav-item ${!aeDiscoverDocData.data.isDatapreparationOpen && this.props.sheet.isActive ? " nav-item-active" : ""}`}
        title={this.props.sheet.name}
        onClick={this.onClick.bind(this, this.props.sheet)}>
        <span className={"footer-icon " + (this.props.sheet.type === "MULTIVIEW_SHEET" ? 'multiview-icon' : 'sheet-icon')} id={MENU_ITEM_ICON} />
        {this.state.showRenameView ?
          <input id={this.props.sheet.id}
            autoFocus
            maxLength="30"
            className="ae-rename-input"
            defaultValue={this.props.sheet.name}
            onChange={this.change.bind(this)}
            onBlur={this.updateName}
            onKeyUp={this.sumbitRename} />
          : this.props.sheet.name}
        <Popover placement="topLeft" overlayClassName="menu-popover" content={
          <div id="SHEET_MENU">
            <button type="button" className={"btn btn-link cursor-pointer " + (this.disableDelete ? 'item-disable' : '')} onClick={this.toggleDeleteConfirmation}> Delete </button><br />
            <button type="button" className="btn btn-link cursor-pointer" onClick={this.duplicateSelectedSheet.bind(this)}> Duplicate</button><br />
            {
              isDefault ?
                <button type="button" className="btn btn-link cursor-pointer default-text-position" onClick={this.markAsDefault.bind(this)}> <span className="ae-check-icon" /> Default Sheet</button> :
                <button type="button" className="btn btn-link cursor-pointer" onClick={this.markAsDefault.bind(this)}> Mark as default</button>
            }
            <br />
          </div>
        } trigger="click" visible={this.state.popoverOpen} onVisibleChange={this.toggle} />
        <span className={"solid-budicon-chevron-bottom pop-btn"} onClick={this.onArrowClick.bind(this, this.props.sheet)} />
        <AeModal
          maskStyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)' }}
          wrapClassName="data-src-confirm-modal"
          visible={this.state.deleteConfirmationModal}
          closable={false}
          width={600}
          footer={null}
          destroyOnClose>
          <div>
            <div className="ae-modal-header">
              <div className="ae-header-title">{DELETE_DATA_SHEET}</div>
              <button type="button" className="ae-header-close" onClick={this.handleCancel} autoFocus={true} />
            </div>
            <div className="msg">
              {
                this.mvsList.length > 0 && (
                  <span>
                    {`${WARNING_MESSAGE} "${this.props.sheet.name}" ?`} <br />
                    {`${WARNING_MESSAGE1} "${this.mvsList.join()}"`}<br />
                    {WARNING_MESSAGE2}
                  </span>) || <span>
                  {`${DELETE_SHEET_WARNING_MESSAGE_1}`}<br />
                  {`${DELETE_SHEET_WARNING_MESSAGE_2}`}
                </span>
              }
            </div>
            <div className="confirmation">
              <AeButton onClick={this.handleCancel} title="No" />
              <AeButton type="primary" onClick={this.deleteSelectedSheet} title="Yes" />
            </div>
          </div>
        </AeModal>
      </div >
    );
  }
}

Sheet.propTypes = sheetLinksPropTypes;
export { Sheet };