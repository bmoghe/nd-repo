import React, { Component } from 'react';
import PropTypes from 'prop-types';
//import { words } from "lodash";
import { Row, Col, Icon, Input, Radio } from 'antd';
//import { AeButton } from '../../../shared/components';
import {
  PUBLISH_AND_SAVE_DATA_VIEW, GIVE_YOUR_UNTITLED_NAME,
  WARNING_INFOMATION_WHILE_PUBLISH_SAVE,
  ENTER_DATA_VIEW_NAME, GIVE_YOUR_DESCRIPTION_FOR_DISCOVERY_DOC, ENTER_DESCRIPTION
} from './AePublishDataModel.constant';

const RadioGroup = Radio.Group;
const { TextArea } = Input;

export default class AePublishDataModel extends Component {
  static propTypes = {
    closePublishDataModel: PropTypes.func,
    isCloseButton: PropTypes.bool,
    publishDataModel: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = { dataModelName: null, corporate: "Y", desc: '' };
    this.closePublishDataModel = this.closePublishDataModel.bind(this);
    this.getDataModelName = this.getDataModelName.bind(this);
    this.publishDataModel = this.publishDataModel.bind(this);
    this.getDiscoveryDesc = this.getDiscoveryDesc.bind(this);

  }

  /**
    * @method AePublishDataModel#closePublishDataModel
    * @private
    * @description action fuction is callback help to close modal 
    **/
  closePublishDataModel() {
    if (this.props.closePublishDataModel instanceof Function) {
      this.props.closePublishDataModel();
    }
    this.setState({ dataModelName: null });
  }

  /**
    * @method AePublishDataModel#getDataModelName
    * @private
    * @description action fuction is update state for input box 
    **/
  getDataModelName(e) {
    this.setState({ dataModelName: e.target.value === '' ? null : e.target.value });
  }

  /**
  * @method AePublishDataModel#getDiscoveryDesc
  * @private
  * @description action fuction is update state for Description of discovery
  **/
  getDiscoveryDesc(e) {
    this.setState({ desc: e.target.value });
  }

  /**
    * @method AePublishDataModel#publishDataModel
    * @private
    * @description action fuction is callback for publish button 
    **/
  publishDataModel() {
    if (this.props.publishDataModel instanceof Function) {
      this.props.publishDataModel(this.state.dataModelName, this.state.desc, this.state.corporate);
    }
  }

  /**
  * @method AeCustomMeasure#visibilitySelection
  * @private
  * @param {Event} e
  * @description Visibility from options and update state
  **/
  visibilitySelection = (e) => {
    this.setState({
      corporate: e.target.value,
    });
  }

  render() {
    //const { dataModelName } = this.state;
    //const isPublishSave = words(dataModelName).length === 0 || words(this.state.desc).length === 0;
    return (
      <div className="ae-publish-data-model">
        <div className="ae-publish-data-model-header">
          <Row>
            <Col span={18} style={{ lineHeight: "32px" }}>{PUBLISH_AND_SAVE_DATA_VIEW}</Col>
            {
              this.props.isCloseButton ?
                <Col span={6} className="text-right">
                  <Icon
                    type="close"
                    className="ae-publish-data-model-close"
                    onClick={this.closePublishDataModel} />
                </Col>
                : ''}
          </Row>
        </div>
        <div className="ae-publish-data-model-container">
          <div className="ae-input-info">
            {GIVE_YOUR_UNTITLED_NAME}
            <Input className="ae-publish-input" placeholder={ENTER_DATA_VIEW_NAME} maxLength="30" onChange={this.getDataModelName} autoFocus />
          </div>
          <div className="ae-major-info">{WARNING_INFOMATION_WHILE_PUBLISH_SAVE}</div>
          <div className="ae-input-info">
            {GIVE_YOUR_DESCRIPTION_FOR_DISCOVERY_DOC}
            <TextArea className="ae-publish-input" placeholder={ENTER_DESCRIPTION} maxLength="256" onChange={this.getDiscoveryDesc} />
          </div>
          <label className="ae-input-labels">
            <RadioGroup onChange={this.visibilitySelection} value={this.state.corporate}>
              <Radio value="N">Only Me (Private)</Radio>
              <Radio value="Y">Available to Everyone (Corporate)</Radio>
            </RadioGroup>
          </label>
          <div className="ae-publish-data-model-footer">
            {/* <AeButton
              title="Cancel"
              onClick={this.closePublishDataModel} />
            <AeButton
              type="primary"
              title={PUBLISH_AND_SAVE}
              onClick={this.publishDataModel}
              disabled={isPublishSave} /> */}
          </div>
        </div>
      </div>
    );
  }
}
