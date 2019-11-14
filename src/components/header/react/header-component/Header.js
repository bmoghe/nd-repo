import React, { Component } from 'react';
import headerPropTypes from '../prop-types/types';
//import { keys } from "lodash";
import { Row, Col, message, Popover } from 'antd';
import { DiscoveryShareContainer } from '../../../../components/discovery-share';
import { Messages } from '../../../../shared/constants';
//import { Button, Modal } from 'aera-react-library';
import {
  prepareDiscoveryDocument,
  isDiscoverDocUpdated,
  aeDiscoverDocData
} from '../../../../shared/constants';
import {
  AeModal as Modal,
  AeButton as Button
} from '../../../../shared/components';
import AePublishDataModel from '../ae-publish-data-model';
import AeSaveDiscoveryForm from '../ae-save-discovery';
import * as constant from '../../constants/HeaderConstant';
import './Header.scss';

export class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      saveModal: false,
      shareModal: false,
      confirmationModal: false,
      documentName: this.props.title,
      corporate: aeDiscoverDocData.corporate ? aeDiscoverDocData.corporate : 'Y',
      documentDescription: "",
      isPublishModal: false,
    };

    this.closeDocument = this.closeDocument.bind(this);
    this.enableDisableEditDoc = this.enableDisableEditDoc.bind(this);
    //this.props.enableDisableEditDoc(true);
  }
  /**
   * @name closeDocument
   * @desc close Document will check is confimation needed
   * then show confimation box and perform other options
   **/
  closeDocument() {
    if (!isDiscoverDocUpdated()) {
      this.setState({
        confirmationModal: true
      });
    } else {
      if (this.props.onClose instanceof Function) {
        this.props.onClose();
      }
    }
  }

  /**
   * @name toggleConfirmationModal
   * @desc toggle save modal and update the state
   **/
  toggleConfirmationModal = () => {
    this.setState({
      confirmationModal: !this.state.confirmationModal
    });
  };

  /**
   * @name closeConfirmation
   * @desc toggle state of confirmationModal
   **/
  closeConfirmation = () => {
    this.setState({
      confirmationModal: !this.state.confirmationModal
    });
    this.props.onClose();
  };

  /**
   * @name saveAndCloseModal
   * @desc toggle state of confirmationModal & calls saveDocument() & call onClose() of parent.
   **/
  saveAndCloseModal = () => {
    this.setState({
      confirmationModal: !this.state.confirmationModal
    });
    // this.toggleSaveDscoveryModal();
    const data = prepareDiscoveryDocument(
      aeDiscoverDocData.name, aeDiscoverDocData.description,
      aeDiscoverDocData.id, aeDiscoverDocData.corporate ? aeDiscoverDocData.corporate : 'Y');
    this.props.saveDocument(data, this.props.onClose);
  }

  /**
   * @name toggleSaveModal
   * @desc toggle save modal and update the state
   **/
  toggleSaveModal = () => {
    this.setState({
      saveModal: !this.state.saveModal,
      documentName: this.props.title,
      documentDescription: '',
    });
  };

  /**
   *
   * @desc checks for the existense of discovery id to identify whether document is saved
   * @returns boolean
   * @memberof HeaderComponent
   **/
  isDiscoveryDocSaved() {
    if (aeDiscoverDocData.id && aeDiscoverDocData.id !== "") {
      return false;
    }
    return true;
  }

  /**
   * @name toggleShareModal
   * @desc toggle save modal and update the state
   **/
  toggleShareModal = () => {
    if (!this.isDiscoveryDocSaved()) {
      this.props.toggleShareModal();
    } else {
      message.warning(Messages.AE_SHARE_DOCUMENT_MESSAGE);
    }
  }

  /**
   * @name enableEdit
   * @desc Prepare JSON for the request payload and call the Save Discovery Document API.
   **/
  enableDisableEditDoc() {
    let isEditable = !this.props.data.headerReducer.isEditable;
    if (this.props.enableDisableEditDoc instanceof Function) {
      this.props.enableDisableEditDoc(isEditable);
    }
  }

  /**
   * @name HeaderComponent#togglePublishDatViewModal
   * @desc function that updates state of Publish Data View
   */
  togglePublishDataViewModal = () => {
    this.setState((prevState) => {
      return { isPublishModal: !prevState.isPublishModal };
    });
  }

  /**
   * @name HeaderComponent#publishDataModel
   * @desc function that updates state of Publish Data View
   */
  publishDataModel = (dataModelName, desc, corporate) => {
    // TODO call the api to save the data model
    if (this.props.publishDataModel instanceof Function) {
      this.props.publishDataModel(dataModelName, desc, this.props.getDataSourceDetails, this.props.handleNavigation, this.props.saveDocument, corporate);
    }
    this.togglePublishDataViewModal();
  }

  /**
   * @name HeaderComponent#publishAndUpdate
   * @desc function that updates state of Publish Data View
   */
  publishAndUpdate = () => {
    // TODO call the api to save the data model
    if (this.props.publishAndUpdate instanceof Function) {
      this.props.publishAndUpdate(this.props.saveDocument);
    }
    // this.togglePublishDataViewModal();
  }

  toggleSaveDscoveryModal = () => {
    if (this.props.toggleSaveDscoveryModal instanceof Function) {
      this.props.toggleSaveDscoveryModal();
    }
  }

  saveDiscovery = (name, desc, corp) => {
    const data = prepareDiscoveryDocument(name, desc, aeDiscoverDocData.id, corp);
    if (this.props.saveDocument instanceof Function) {
      this.props.saveDocument(data);
    }
  }

  toggleSetDiscoveryAsFav = () => {
    if (this.props.toggleSetDiscoveryAsFav instanceof Function) {
      this.props.toggleSetDiscoveryAsFav(aeDiscoverDocData.favorite);
    }
  }

  render() {
    const { showModel, isSaveDiscovery, isSaveAsDiscovery } = this.props.data.headerReducer;
    const { favorite } = aeDiscoverDocData;
    const isSaveDisabled = this.props.data.headerReducer.loading || isDiscoverDocUpdated();
    //const isPublishDisable = keys(aeDiscoverDocData.data.join).length < 1 || aeDiscoverDocData.data.REPORTID;
    //const isPublishAndUpdateDisable = this.props.data.dataSourceListReducer && this.props.data.dataSourceListReducer.dataJoinTable && this.props.data.dataSourceListReducer.dataJoinTable.columnDefs.length === 0;
    //const isSave = !!aeDiscoverDocData.data.REPORTID;
    //const isDataJoinEditable = getIsDataJoinEditable();
    const isSave = true;
    const isDataJoinEditable = true;
    return (
      <div className="ae-discovey-header">
        <Row>
          <Col span={12} className="discovery-title text-left">
            <Popover
              overlayClassName="info-popover" placement="right"
              content={favorite ? constant.aeDiscoveryHeaderTooltipText.REMOVE_FAVOURITE : constant.aeDiscoveryHeaderTooltipText.MARK_FAVOURITE}
              trigger="hover">
              {favorite ?
                <i
                  style={{ color: 'rgb(195, 184, 44)', fontWeight: 'bold' }}
                  className="title-indicator solid-budicon-star"
                  onClick={this.toggleSetDiscoveryAsFav} /> :
                <i
                  className="title-indicator outline-budicon-star"
                  onClick={this.toggleSetDiscoveryAsFav} />
              }
            </Popover>
            {this.props.title}
          </Col>
          <Col span={12} className="discovery-actions text-right">
            {
              isSave && isDataJoinEditable ?
                <Popover overlayClassName="info-popover" placement="bottom" content={constant.aeDiscoveryHeaderTooltipText.SHARE} trigger="hover">
                  <i className="action-icon outline-budicon-reply" onClick={this.toggleShareModal} />
                </Popover> : ''
            }
            <span>
              <Popover overlayClassName="info-popover" placement="bottom" content="Save As" trigger="hover">
                <i className="action-icon bi_interface-repeating" onClick={this.toggleSaveAsDscoveryModal} />
              </Popover>
              <Button
                className="save-action"
                type="primary"
                onClick={this.toggleSaveDscoveryModal}
                disabled={isSaveDisabled}>Save</Button>
            </span>
            <Popover
              overlayClassName="info-popover" placement="bottom"
              content={constant.aeDiscoveryHeaderTooltipText.CLOSE} trigger="hover">
              <Button className="action-icon close-icon" icon="close" onClick={this.closeDocument} />
            </Popover>
          </Col>
        </Row>
        <Modal
          maskStyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)' }}
          visible={this.state.isPublishModal}
          closable={false} footer={null}
          width={400}
          mask
          style={{ top: '15%' }}
          centered
          destroyOnClose>
          <AePublishDataModel
            isCloseButton
            closePublishDataModel={this.togglePublishDataViewModal}
            publishDataModel={this.publishDataModel} />
        </Modal>
        <Modal
          mask
          wrapClassName="ae-save-discovery-container" visible={isSaveDiscovery} closable={false} footer={null}
          width={400} height={432} maskstyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)', top: '15%', height: "100%" }} centered destroyOnClose>
          <AeSaveDiscoveryForm isFromSaveAs={false} isLoading={this.props.data.headerReducer.loading} isCloseButton onSave={this.saveDiscovery} onCancel={this.toggleSaveDscoveryModal} />
        </Modal>
        <Modal
          mask
          wrapClassName="ae-save-discovery-container" visible={isSaveAsDiscovery} closable={false} footer={null}
          width={400} height={432} maskstyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)', top: '15%', height: "100%" }} centered destroyOnClose>
          <AeSaveDiscoveryForm isFromSaveAs={true} isLoading={this.props.data.headerReducer.loading} isCloseButton onSave={this.saveAsDiscovery} onCancel={this.toggleSaveAsDscoveryModal} />
        </Modal>
        <Modal
          mask
          maskStyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)' }}
          wrapClassName="ae-confrimation-modal"
          width={400}
          visible={this.state.confirmationModal}
          closable={false}
          footer={null}
          destroyOnClose>
          <div className="fluid-container">
            <div
              className="confirmation-message">{aeDiscoverDocData.id ? Messages.AE_CLOSE_DOCUMENT_MESSAGE : Messages.AE_CLOSE_DOCUMENT_WITHOUT_PUBLISH_MESSAGE}</div>
            <button type="button" className={`ae-header-close ${aeDiscoverDocData.id ? "" : " close-without-publish"}`} onClick={this.toggleConfirmationModal} autoFocus={true} />
            <div className="form-group text-right confrimation-modal-footer">
              {aeDiscoverDocData.editable && aeDiscoverDocData.id ?
                <Button type="primary" onClick={this.saveAndCloseModal} title={`Save & Close`} /> : ""}
              <Button type="default" onClick={this.closeConfirmation} title="Close" />
            </div>
          </div>
        </Modal>
        <Modal
          mask maskStyle={{ backgroundColor: 'rgba(92, 100, 118, 0.5)' }}
          destroyOnClosewrapClassName="share-discovery-modal" visible={showModel}
          onCancel={this.toggleShareModal} closable={false} footer={null} width="600px" destroyOnClose>
          {<DiscoveryShareContainer toggleShareModal={this.toggleShareModal} />}
        </Modal>
      </div>
    );
  }
};

Header.propTypes = headerPropTypes;