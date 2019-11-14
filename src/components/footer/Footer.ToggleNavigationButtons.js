import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Footer.ToggleNavigationButtons.style.scss';
import { Popover, message } from "antd";
import { isEmpty } from "lodash";
import { AE_CREATE_JOIN, READ_ONLY_MSG } from "../../shared/constants/messages/Messages.constant";
import {
  aeDiscoverDocData,
  getClassName
} from '../../shared/constants';

class ToggleNavigationButtons extends Component {
  constructor(props) {
    super(props);
    this.state = {
      addSheetPopoverOpen: false,
      showSheetListPopoverOpen: false,
    };
  }

  /**
   * @name toggleAddDiscoverySheetPopup
   * @desc function that sets the state of addSheetPopoverOpen on which toggling of popover is dependent.
   */
  onAddButtonClick = () => { 
    if (getClassName(this.props.headerReducer.isEditable)) {
      message.destroy();
      message.warning(`"${aeDiscoverDocData.name}" ${READ_ONLY_MSG}`);
      return;
    }
    if (isEmpty(this.props.discoveryDoc.data.join)) {
      message.destroy();
      message.warning(`${AE_CREATE_JOIN}`);
      return;
    }
    this.setState({
      addSheetPopoverOpen: !this.state.addSheetPopoverOpen
    });
    if (this.props.onAddButtonClick instanceof Function) {
      this.props.onAddButtonClick();
    }
  };

  onListButtonClick = () => {
    this.setState({
      showSheetListPopoverOpen: !this.state.showSheetListPopoverOpen
    });
    if (this.props.onListButtonClick instanceof Function) {
      this.props.onListButtonClick();
    }
  };

  render() {
    const { isDisable, addPopoverContent, listPopoverContent } = this.props;
    const { addSheetPopoverOpen, showSheetListPopoverOpen } = this.state;
    return (
      <div className="ae-toggle-navigation-buttons">
        <div className="ae-add-section" onClick={this.onAddButtonClick} disabled={isDisable}>
          <Popover
            placement="top"
            overlayClassName="menu-popover"
            content={addPopoverContent}
            trigger="click"
            visible={addSheetPopoverOpen}
            onVisibleChange={this.onAddButtonClick}>
            <i className="solid-budicon-plus-ui" />
          </Popover>
        </div>
        <div className="ae-divider-section" />
        <div className="ae-list-section" onClick={this.onListButtonClick} disabled={isDisable}>
          <Popover
            placement="top"
            overlayClassName="menu-popover show-discovery-sheets-list"
            content={listPopoverContent}
            trigger="click"
            visible={showSheetListPopoverOpen}
            onVisibleChange={this.onListButtonClick}>
            <i className="solid-budicon-hamburger-ui" />
          </Popover>
        </div>
      </div>
    );
  }
}

ToggleNavigationButtons.propTypes = {
  onAddButtonClick: PropTypes.func,
  onListButtonClick: PropTypes.func,
  isDisable: PropTypes.bool,
  addPopover: PropTypes.bool,
  addPopoverContent: PropTypes.element,
  listPopoverContent: PropTypes.element,
  headerReducer: PropTypes.object,
  discoveryDoc: PropTypes.object,
};

export default ToggleNavigationButtons;