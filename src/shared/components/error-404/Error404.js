import React from 'react';
import { IconBudicon } from 'aera-react-library';
import './Error404.scss';

const Error404 = () => {
  return (
    <div className="error-404">
      <div className="error-404-icon">
        <IconBudicon icon="outline-budicon-cog" />
      </div>
      <div className="error-404-text">
        <h2><b>400.</b> That's an error</h2>
        <p>Your client has issued a malformed or illegal request.</p></div>
    </div>
  );
};

export default Error404;
