import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, Divider } from 'antd';

const propTypes = {
  onSUMChange: PropTypes.func,
  onAVGChange: PropTypes.func,
  onTOTALChange: PropTypes.func,
  sum: PropTypes.bool,
  avg: PropTypes.bool,
  total: PropTypes.bool,
  sheetId: PropTypes.string,
};

function AeSettingOptions(props) {
  return (
    <div className="ae-setting-options">
      <div className="ae-column-summeries">
        <p>Column Summaries</p>
        <Divider />
        <div className="ae-setting-option-item">
          <Checkbox onChange={props.onTOTALChange}
            checked={props.total}>TOTAL</Checkbox>
        </div>
        <div className="ae-setting-option-item">
          <Checkbox onChange={props.onSUMChange}
            checked={props.sum}>SUM</Checkbox>
        </div>
        <div className="ae-setting-option-item">
          <Checkbox onChange={props.onAVGChange}
            checked={props.avg}>AVG</Checkbox>
        </div>

      </div >
    </div >
  );
}

AeSettingOptions.propTypes = propTypes;

export default AeSettingOptions;
