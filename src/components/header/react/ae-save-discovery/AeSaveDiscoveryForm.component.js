import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { words } from "lodash";
import { Layout, Row, Col, Icon, Radio, Input, Popover } from 'antd';
import { LoadingIndicator, Button } from 'aera-react-library';
import { aeDiscoverDocData } from '../../../../shared/constants/discovery-doc-data/Discovery-doc-data';
import {
  SAVE_DISCOVERY_DOCUMENT, SAVE_AS_DISCOVERY_DOCUMENT, DISCOVERY_NAME, DISCOVERY_DESC,
  DISCOVERY_SAVE_BUTTON, DISCOVERY_CANCEL_BUTTON, DISCOVERY_PRIVATE, DISCOVERY_CORPORATE, CLOSE_TOOLTIP
} from './AeSaveDiscoveryForm.constant';

const { Header, Content } = Layout;
const RadioGroup = Radio.Group;
const { TextArea } = Input;

/**
 * AeSaveDiscoveryForm class.
 * @class AeSaveDiscoveryForm
 */
export default class AeSaveDiscoveryForm extends Component {

  static propTypes = {
    onSave: PropTypes.func,
    onCancel: PropTypes.func,
    isCloseButton: PropTypes.bool,
    isFromSaveAs: PropTypes.bool,
    isLoading: PropTypes.bool,
  }

  /**
   * AeSaveDiscoveryForm constructor.
   * @constructs AeSaveDiscoveryForm
   * @param {Props} onSave -  PropTypes.function | onclick event on save button 
   * @param {Props} onCancel -  PropTypes.function |  onclick event on cancel button
   * @param {Props} isCloseButton -  PropTypes.boolean | show/hide close icon 
   */
  constructor(props) {
    super(props);
    this.state = {
      name: aeDiscoverDocData.name ? aeDiscoverDocData.name : '',
      desc: aeDiscoverDocData.description ? aeDiscoverDocData.description : '',
      corp: aeDiscoverDocData.corporate ? aeDiscoverDocData.corporate : 'Y'
    };
  }

  componentDidMount() {
    this.focusRef.focus();
    let val = this.focusRef.input.value;
    this.focusRef.input.value = '';
    this.focusRef.input.value = val;
  }

  /**
   * @name setFormData
   * @desc update state of the form.
   * @param {event} event
   **/
  setFormData = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  /**
    * @method AeCustomMeasure#visibilitySelection
    * @private
    * @param {Event} e
    * @description Visibility from options and update state
    **/
  visibilitySelection = (e) => {
    this.setState({
      corp: e.target.value,
    });
  }

  /**
   * @name AeSaveDiscoveryForm#onSave
   * @desc onclick event on save button
   */
  onSave = () => {
    if (this.props.onSave instanceof Function) {
      const { name, desc, corp } = this.state;
      this.props.onSave(name, desc, corp);
    }
  }

  /**
   * @name AeSaveDiscoveryForm#onCancel
   * @desc onclick event on cancel button
   */
  onCancel = () => {
    if (this.props.onCancel instanceof Function) {
      this.props.onCancel();
    }
  }

  render() {
    const { isCloseButton, isFromSaveAs } = this.props;
    const { name, desc, corp } = this.state;
    const disabledSave = words(name).length === 0 || words(desc).length === 0;
    const disableCorportate = !aeDiscoverDocData.editable;
    return (
      <Layout className="ae-save-discovery">
        {this.props.isLoading ? <LoadingIndicator /> : ''}
        <Header className="ae-save-discovery-header">
          <Row>
            {isFromSaveAs ? <Col span={18}>{SAVE_AS_DISCOVERY_DOCUMENT}</Col> : <Col span={18}>{SAVE_DISCOVERY_DOCUMENT}</Col>}
            {
              isCloseButton ?
                <Col span={6} className="text-right">
                  <Popover overlayClassName="info-popover" placement="right" content={CLOSE_TOOLTIP} trigger="hover">
                    <Icon type="close" className="ae-close-icon" onClick={this.onCancel} />
                  </Popover>
                </Col>
                : ''}
          </Row>
        </Header>
        <Content className="ae-save-discovery-content">
          <label className="ae-input-labels"> {DISCOVERY_NAME}
            <Input className="form-control" name="name" value={name} maxLength="30" onChange={this.setFormData} ref={node => this.focusRef = node} />
          </label>
          <label className="ae-input-labels"> {DISCOVERY_DESC}
            <TextArea maxLength="256" autosize={{ minRows: 4, maxRows: 4 }} name="desc" value={desc} onChange={this.setFormData} />
          </label>
        </Content>
        <div className="ae-save-discovery-footer">
          <RadioGroup onChange={this.visibilitySelection} value={corp} disabled={disableCorportate}>
            <Radio value="N">{DISCOVERY_PRIVATE}</Radio>
            <Radio value="Y">{DISCOVERY_CORPORATE}</Radio>
          </RadioGroup>
          <div className="text-right " style={{ marginTop: 20, marginRight: -4 }}>
            <Button
              title={DISCOVERY_CANCEL_BUTTON}
              onClick={this.onCancel} />
            <Button
              type="primary"
              title={DISCOVERY_SAVE_BUTTON}
              onClick={this.onSave}
              disabled={disabledSave} />
          </div>
        </div>
      </Layout >
    );
  }
}
