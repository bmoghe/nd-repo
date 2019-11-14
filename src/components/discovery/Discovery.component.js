import React, { Component } from 'react';
import { message } from "antd";
import { LoadingIndicator } from 'aera-react-library';
import {
  aeDiscoverDocData,
  saveDiscoveryDoc,
  getListOfDataModelID,
  updateDiscoveryDoc
} from '../../shared/constants';
import DiscoveryServices from "./Discovery.service";
import { PageNotFound, Layout } from "../../shared/components";
//import { Layout } from '../../../../shared/components/';
import discoveryPropTypes from './types';

class Discovery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };

    if (props.docId) {
      DiscoveryServices.getDiscoveryDocument({ id: this.props.docId }).then(
        (data) => {
          const PublishedDataModelDetail = data.data.dataObjectProperties;
          const discoveryDocData = data.data;
          delete discoveryDocData.dataObjectProperties;
          discoveryDocData.data.REPORTID = PublishedDataModelDetail.dataObject.dataobjectID;
          DiscoveryServices.getMulipleDataModelDetails(getListOfDataModelID(discoveryDocData.data.join)).then(
            ({ data }) => {
              props.initDiscoveryDoc(updateDiscoveryDoc(discoveryDocData, data), { data: PublishedDataModelDetail });
              this.returnDiscovery();
            }
          );
        }, this.showError);
    } else {
      this.state.loading = false;
      let discoveryDoc = { ...aeDiscoverDocData };
      discoveryDoc.editable = 'Y';
      saveDiscoveryDoc(discoveryDoc);
      this.state.discovery = <Layout {...this.props} data={discoveryDoc} />;
      props.fetchDiscoveryDocument({ id: props.docId });
    }
  }

  showError = (error) => {
    message.destroy();
    message.error(error.response.data.errorMessage);
    if (error.response.status === 401) {
      sessionStorage.clear();
    }
    this.setState({ loading: false, discovery: <PageNotFound response={error.response} /> });
  };

  returnDiscovery = () => {
    this.setState({
      loading: false,
      discovery: <Layout {...this.props} data={this.props.data.discoveryDocReducer.discoveryDoc} />
    });
  };

  render() {
    if (this.state.loading) {
      return <LoadingIndicator className="discovery-loader" />;
    } else {
      return this.state.discovery;
    };
  }
};

Discovery.propTypes = discoveryPropTypes;

export { Discovery };