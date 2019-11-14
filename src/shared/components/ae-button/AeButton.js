import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

export class AeButton extends Component {
  render() {
    const props = this.props;
    return <Button {...props}>{props.title}</Button>;
  }
}

AeButton.propTypes = {
  title: PropTypes.string,
};
