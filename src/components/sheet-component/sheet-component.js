import React from 'react';
import { Provider } from 'react-redux';
import configureStore from './config/storeConfiguration';
import SheetContainer from './components/sheet/Sheet.container';
import './styles/main.scss';

const SheetComponent = (props) => {
  const sheetStore = configureStore();
  return (
    <Provider store={sheetStore}>
      <SheetContainer {...props} />
    </Provider>
  );
};

export default SheetComponent;
