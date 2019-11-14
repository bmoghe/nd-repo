import React from 'react'
import { Route } from "react-router-dom";

const RouteWithSubRoutes = (props) => {
  if (props.path && props.component) {
    return (
      <Route
        path={props.path}
        exact={props.exact}
        render={({ match }) => (
          <props.component {...match} {...props} />
        )}
      />
    );
  } else {
    return <Route
      render={({ match }) => (
        <props.component {...match} {...props} />
      )}
    />
  }

}
export default RouteWithSubRoutes;
