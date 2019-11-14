import { applyMiddleware, compose, createStore } from 'redux';
import allReducer from './reducers';
import { createLogger } from 'redux-logger';
import promise from 'redux-promise-middleware';

const logger = createLogger({});

function configureStoreProd(initialState) {
  const middleware = [
    promise
  ];

  return createStore(allReducer, initialState, compose(applyMiddleware(...middleware))
  );
}

function configureStoreDev(initialState) {
  const middleware = [
    // Add other middleware on this line...
    // Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
    // reduxImmutableStateInvariant(),
    promise,
    logger
  ];

  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose; // add support for Redux dev tools

  const store = createStore(allReducer, initialState, composeEnhancers(applyMiddleware(...middleware))
  );

  // eslint-disable-next-line no-undef
  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    // eslint-disable-next-line no-undef
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line no-undef
      const nextReducer = require('./reducers').default; // eslint-disable-line global-require

      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const configureStore = process.env.NODE_ENV === 'production' ? configureStoreProd : configureStoreDev;

export default configureStore;
