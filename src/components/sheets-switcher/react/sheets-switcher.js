import React, { Component } from 'react';
import { RouteWithSubRoutes } from '../../../config/router-config';
import { find } from 'lodash';
import { LoadingIndicator } from 'aera-react-library';
import { Switch } from 'react-router-dom';
//import { Sheet } from '../../new-sheet';


class SheetsSwitcher extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  };

  getDataForSheet = () => {
    if (this.props && this.props.data && this.props.data.discoveryDocReducer && this.props.data.discoveryDocReducer.discoveryDoc) {
      return this.props.data.discoveryDocReducer.discoveryDoc;

    } else {
      return null;
    }
  };

  getSheetById = () => {
    let id = this.props.params.id;
    let { data } = this.getDataForSheet();
    let { sheets } = data;
    const result = find(sheets, { id: id });
    return result;
  }

  render() {
    const { data } = this.getDataForSheet();
    const { dataObject, dimensions, measures } = data.publishedDataModel;
    const sheetData = this.getSheetById();
    return this.state.loading ? <LoadingIndicator /> :
      sheetData ?
        <div className="ae-discovery-container">
          {/* <Sheet
            bioid={dataObject.bioid}
            fid={dataObject.fid}
            isEditable={false}
            accessToken={localStorage.getItem('access_token')}
            dataobjectName={dataObject.dataobjectName}
            sheetData={sheetData}
            dimensions={dimensions}
            measures={measures}
          /> */}
          <Switch>
            {this.props.children.map((route, i) => (
              <RouteWithSubRoutes
                bioid={dataObject.bioid}
                fid={dataObject.fid}
                isEditable={!this.props.isReadOnly}
                accessToken={localStorage.getItem('access_token')}
                dataobjectName={dataObject.dataobjectName}
                sheetData={this.getSheetById()}
                dimensions={dimensions}
                measures={measures}
                key={i} {...route} />)
            )}
          </Switch>
        </div> :
        <div>No data Available for the sheet id # {this.props.params.id}</div>
  }
}

export default SheetsSwitcher;
