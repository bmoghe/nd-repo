import React from 'react';
import { IconBudicon } from 'aera-react-library';
import './pageNotFound.scss';

const PageNotFound = () => {
  return (
    <div className="ae-page-not-found">
      <div className="page-not-found-icon">
        <IconBudicon icon="outline-budicon-trash" />
      </div>
      <div className="page-not-found-text">Page Not Found</div>
    </div>
  );
};

export { PageNotFound };
