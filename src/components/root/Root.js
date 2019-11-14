import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { LoadingIndicator } from 'aera-react-library';
import { DiscoveryContainer } from '../';
import GetAuthToken from '../login/login-service/LoginService';
import { getSlashSeparatedValue } from '../../shared/utils';
import './Root.scss';


//TODO:
// Need to create readme file for each component
class Root extends Component {
  constructor(props) {
    super(props);
    // TO DO - We are using this for doc reference as of now, will get removed in prod.
    this.state = {
      docId: getSlashSeparatedValue(window.location.href, 'document', '#') || '29D5D3D2-D78D-441E-93F3-A91EBE3F04E6',
      loading: true
    };
  };

  //TODO: Need to re-write the login logic
  componentWillMount() {
    const access_token = localStorage.getItem(window.location.host + '_access_token');
    if (!access_token) {
      GetAuthToken('brajesh.mehra@aeratechnology.com', 'Welcome@23')
        .then((data) => {
          localStorage.setItem('access_token', data.data.access_token);
          this.setState({
            loading: false
          });
          //setaccessToken(data.data.access_token);
        });
    } else {
      this.setState({
        loading: false
      });
    }
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div className="ae-discovery">
          {
            this.state.loading ?
              <LoadingIndicator className="discovery-loader" /> :
              <DiscoveryContainer docId={this.state.docId} isReadOnly={false} />
          }
        </div>
      </Provider>
    );
  }
}

Root.propTypes = {
  store: PropTypes.object.isRequired,
};

export default Root;
