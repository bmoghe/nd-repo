import React, { Component } from 'react';
import { Select, message, Input } from 'antd';
import PropTypes from 'prop-types';
import './ShareComponent.scss';
import { AeButton } from '../../../../shared/components';
import { aeDiscoverDocData, PLEASE_SELECT_A_RECIPIENTS } from '../../../../shared/constants';
import * as constant from '../../constants/ShareConstant';

const { TextArea } = Input;
const Options = Select.Option;

/**
 * @class ShareComponent
 * AeShare class will accept options from parent compenent and 
 * provide confirguration object containing all the selected values.
 */

export class ShareComponent extends Component {
  static propTypes = {
    toggleShareModal: PropTypes.func,
    onShareClick: PropTypes.func,
    fetchUsersList: PropTypes.func,
    shareDocument: PropTypes.func,
    data: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      shareDocumentDescription: "",
      selected: []
    };
  }

  /**
   * @desc Makding API call to fetch user list based on the discoveryId
   * 
   **/
  componentWillMount() {
    this.props.fetchUsersList(aeDiscoverDocData.id);
  }

  componentDidMount() {
    this.focusRef.focus();
  }

  /**
   * @name onShareClick
   * @desc toggle share modal and update the share Configuration
   **/
  onShareClick = () => {
    if (this.state.selected && this.state.selected.length <= 0) {
      message.destroy();
      message.error(PLEASE_SELECT_A_RECIPIENTS);
      return;
    }
    this.shareConfig = {
      selectedUsers: this.selectedUsers,
      description: this.state.shareDocumentDescription
    };
    if (this.props.shareDocument instanceof Function) {
      this.props.shareDocument(aeDiscoverDocData.id, this.state.selected, this.state.shareDocumentDescription);
      this.props.toggleShareModal();
      this.clearSelectedUsers();
    }
  };

  /**
   * @name clearSelectedUsers
   * @desc clear selected users on cancel
   **/
  clearSelectedUsers = () => {
    this.setState({ selected: [] });
    if (this.props.toggleShareModal instanceof Function) {
      this.props.toggleShareModal();
    }
  }

  /**
   * @name onSelectUserOption
   * @desc handle change on selection of users and update the selected User array.
   * @param {event} event
   **/
  onSelectUserOption = value => {
    this.selectedUsers = value;
    this.setState({ selected: value });
  }

  /**
   * @name setFormData
   * @desc update state of the form.
   * @param {event} event
   **/
  setFormData = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const userList = this.props.data.headerReducer.userList.map(ele => {
      return <Options key={`${ele.firstName} ${ele.lastName}:-${ele.id}`}>{`${ele.firstName} ${ele.lastName}`}</Options>;
    });
    return (
      <div className="share-discovery-container">
        <div className="share-header">
          <h5>Share</h5>
          <span className="close-modal outline-budicon-cross-ui"
            onClick={this.clearSelectedUsers} /></div>
        <div className="ae-text-area-section">
          <TextArea rows={4}
            id="shareDiscoveryDocument"
            placeholder={constant.TEXTAREA_PLACEHOLDER}
            name="shareDocumentDescription"
            value={this.state.shareDocumentDescription}
            maxLength="250"
            autosize={{ minRows: 3, maxRows: 3 }}
            onChange={this.setFormData}
            ref={node => this.focusRef = node} />
        </div>
        <div className="ae-user-list-section">
          <Select
            mode="multiple"
            dropdownClassName="select-container"
            onChange={this.onSelectUserOption}
            tokenSeparators={[',']}
            placeholder={constant.SELECT_PLACEHOLDER}
            value={this.state.selected}
            allowClear={true} >
            {userList}
          </Select>
        </div>
        <div className="ae-share-discovery-footer text-right">
          <AeButton onClick={this.clearSelectedUsers} title="Cancel" />
          <AeButton className="ae-share-btn" type="primary" onClick={this.onShareClick} title={constant.SHARE} />
        </div>
      </div>
    );
  }
}
