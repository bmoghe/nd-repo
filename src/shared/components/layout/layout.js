import React from 'react';
import { AppRoutes, RouteWithSubRoutes } from '../../../config/router-config';
import { HeaderContainer, FooterContainer } from '../../../components/';
import { HashRouter as Router, Switch } from 'react-router-dom';
import './layout.scss';

const Layout = (props) => {
  const { data } = props;
  const closeDiscovery = () => {
    const prj = localStorage.getItem(window.location.host + '_project_id');
    const url = window.location.href.split('ispring/')[0] + `ispring/awc?mode=page&processID=319CA075_9E46_4F7F_BA94_145610D417BB&prj=${prj}&v=3#discoveries`;
    window.location.replace(url);
  };

  const title = data.name || 'Untitled';
  return (
    <div className="ae-discovery-doc">
      <Router>
        {!props.isReadOnly ? <HeaderContainer
          title={title}
          onClose={closeDiscovery}
        /> : ''}
        <Switch>
          {AppRoutes.map((route, i) => (
            <RouteWithSubRoutes key={i} {...route} {...props} />
          ))}
        </Switch>
        {!props.isReadOnly ? <div className="footer">
          <FooterContainer />
        </div> : ''}

      </Router>
    </div>
  )
}

export { Layout };