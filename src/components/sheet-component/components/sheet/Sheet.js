import React, { Component } from 'react';
import { sheetDefaultProps, sheetTypes } from './types';
import Table from '../table';
import Chart from '../chart';

class Sheet extends Component {

  render () {
    const { viewTable } = this.props;
    return (
      <div className="ae-sheet-container">
        <div className="ae-sheet-body">
          {viewTable ? <Table/> : <Chart/>}
        </div>
      </div>
    );
  }
}

Sheet.propTypes = sheetTypes;
Sheet.defaultProps = sheetDefaultProps;

export default Sheet;
