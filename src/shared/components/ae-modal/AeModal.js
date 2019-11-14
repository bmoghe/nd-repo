import React, { Component } from 'react';
import { Modal } from "antd";
//import { Modal } from 'aera-react-library';

import PropTypes from 'prop-types';
import './aeModal.scss';

export class AeModal extends Component {

  render() {
    const {
      visible, children, closable, footer, bodyStyle, cancelText,
      confirmLoading, destroyOnClose, mask, maskClosable, maskStyle,
      okText, okType, width, zIndex, wrapClassName, title, onCancel
    } = this.props;
    return (
      <div className="ae-modal">
        <Modal
          wrapClassName={wrapClassName}
          visible={visible}
          closable={closable}
          footer={footer}
          bodyStyle={bodyStyle}
          cancelText={cancelText}
          confirmLoading={confirmLoading}
          destroyOnClose={destroyOnClose}
          mask={mask}
          maskClosable={maskClosable}
          maskStyle={maskStyle}
          okText={okText}
          okType={okType}
          width={width}
          zIndex={zIndex}
          title={title}
          onCancel={onCancel} {...this.props}>
          {children}
        </Modal>
      </div >
    );
  }
}

AeModal.defaultProps = {
  cancelText: 'Cancel',
  closable: false,
  confirmLoading: false,
  destroyOnClose: false,
  footer: null,
  mask: false,
  maskClosable: false,
  maskStyle: {
    backgroundColor: "rgba(255, 255, 255, 0.8)"
  },
  okText: 'OK',
  okType: 'primary',
  visible: false,
  zIndex: 1000,
  wrapClassName: ''
};

AeModal.propTypes = {
  afterClose: PropTypes.func,
  bodyStyle: PropTypes.bool,
  cancelText: PropTypes.string,
  closable: PropTypes.bool,
  confirmLoading: PropTypes.bool,
  destroyOnClose: PropTypes.bool,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  getContainer: PropTypes.instanceOf(HTMLElement),
  mask: PropTypes.bool,
  maskClosable: PropTypes.bool,
  maskStyle: PropTypes.object,
  okText: PropTypes.string,
  okType: PropTypes.string,
  style: PropTypes.object,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  visible: PropTypes.bool,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  wrapClassName: PropTypes.string,
  zIndex: PropTypes.number,
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
};
